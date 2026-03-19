---
title: "Deploying with Nix"
date: "2026-03-19"
summary: "Make server management easier with Nix"
cover: "/posts/images/ship-nix-banner.png"
---

I'm back again, this time with even more experience using
[Nix](https://nixos.org/). If you've ever met someone whos tried Nix, you'll
understand how easy it is to fall deeper and deeper into the spiral. I'd like to
tell you about a project I've been working on recently.

I've been running my own [homelab](https://en.wiktionary.org/wiki/homelab) for
about 5 years now. Over that time, I've gained a lot of experience with computer
networking and managing infrastructure. I have found myself in the situation
where I have several [Debian Linux](https://www.debian.org/) Virtual Machines in
various [VLANs](https://en.wiktionary.org/wiki/VLAN). Despite how organised I
can be, my configs were scattered, and I was perpetually backing up my machines
in case of disaster. In my opinion, this is not how a server should be.

Through the past few months I have been on my Nix journey, and so I thought why
can't Nix be the solution? I had heard some of my friends used Nix for managing
their servers. Thus I began my journey of stripping out the old and in with the
new.

## Getting started

The most important tool for this is
[Colmena](https://github.com/zhaofengli/colmena). It allows you to create a
"Hive" of target hosts and perform deployments on them. You can deploy from your
repo to one or more servers at once. Here is the fundamental
[flake](https://nixos.wiki/wiki/Flakes):

```nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    colmena.url = "github:zhaofengli/colmena";
  };

  outputs = {
    nixpkgs,
    colmena,
    ...
  }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [colmena.packages.x86_64-linux.colmena];
    }; # Use this shell for deployment (nix develop)

    colmenaHive = colmena.lib.makeHive {
      meta = {
        nixpkgs = import nixpkgs {
          system = "x86_64-linux";
          overlays = [];
        };
      };

      alpha = {
        deployment = {
          targetHost = "192.168.0.2";
          targetUser = "ed";
          tags = [];
        };

        imports = [
          ./hosts/alpha/configuration.nix
        ];
      };
      
      beta = {
        deployment = {
          targetHost = "192.168.0.3";
          targetUser = "ed";
          tags = [];
        };

        imports = [
          ./hosts/beta/configuration.nix
        ];
      };
    };
  };
}
```

## Secrets management

Managing secrets throughout your servers is a very important task. Should you
need to change a key or should a host have a surprise guest who isn't on the SSH
invite list, you would want to be able to change the key quickly and from a
centralized machine, especially if your hosts start to scale into the hundreds.

This is where [SOPS](https://github.com/getsops/sops) with
[age](https://github.com/FiloSottile/age) comes in. By having a unique age key
and SOPS configuration for each host, you can ensure that each host has
individually tailored access to what it needs.

## Services

When it comes to services on the hosts, you can choose from many options. One
path is to go for Nix-native services; I do this for some of my services as it
is simple and effective. Another route some of my friends take is using Nix +
Colmena + SOPS to manage the hosts, and then running a Kubernetes cluster on top
of them. That is very cool, but a bit overkill for my home. Most of what I run
is in Nix-managed [Docker](https://www.docker.com/) containers.

Whatever you do go for, I'd suggest you make a generic interface based on your
needs and abstract most of the logic. This will ensure that you can reuse the
service in many hosts as simply as possible.

One of the services I run is
[Speedtest Tracker](https://github.com/alexjustesen/speedtest-tracker). It helps
me to track how my internet bandwidth is performing and identify any potential
issues. In order to host this, I use the Docker container kindly provided by
[www.linuxserver.io](https://www.linuxserver.io/). Here is what my generic
module looks like:

```nix
{
  config,
  lib,
  ...
}: let
  inherit (lib) mkEnableOption mkIf mkOption types;
  cfg = config.homelab.speedtestTracker;
in {
  options.homelab.speedtestTracker = {
    enable = mkEnableOption "Speedtest Tracker service";

    port = mkOption {
      type = types.port;
      default = 8444;
      description = "Host port to expose the Speedtest Tracker HTTPS UI on.";
    };

    appKeyFile = mkOption {
      type = types.path;
      default = "/run/secrets/speedtest-tracker-app-key";
      description = "Environment file containing APP_KEY for Speedtest Tracker.";
    };

    puid = mkOption {
      type = types.int;
      default = 1000;
      description = "PUID for the container user.";
    };

    pgid = mkOption {
      type = types.int;
      default = 1000;
      description = "PGID for the container user.";
    };

    schedule = mkOption {
      type = types.str;
      default = "0 3 * * *";
      description = "Cron schedule for running speed tests.";
    };
  };

  config = mkIf cfg.enable {
    networking.firewall.allowedTCPPorts = [cfg.port];

    virtualisation.oci-containers = {
      backend = "docker";
      containers.speedtest-tracker = {
        image = "lscr.io/linuxserver/speedtest-tracker:latest";
        autoStart = true;
        ports = [
          "${toString cfg.port}:443/tcp"
        ];
        environment = {
          PUID = toString cfg.puid;
          PGID = toString cfg.pgid;
          DB_CONNECTION = "sqlite";
          SPEEDTEST_SCHEDULE = cfg.schedule;
        };
        environmentFiles = [
          cfg.appKeyFile
        ];
        volumes = [
          "speedtest-tracker-config:/config"
          "speedtest-tracker-keys:/config/keys"
        ];
      };
    };
  };
}
```

## Conclusion

So what does my homelab look like after these changes? Well, not only are my
secrets well managed, but my VMs are more secure, they are more performant, and
I can update all my servers in a single command. Additionally, I don't bother
with backing the VMs up as it is quick to restore them from Nix config. This
saves me a remarkable amount of disk space. I would 100% recommend that you try
this method of server management out.

## Acknowledgements

I wouldn't have been able to do this without this great
[video](https://www.youtube.com/watch?v=myPwY-prbNw) from
[Singularity Club](https://www.youtube.com/@singularityclub). He has an
[example repo](https://github.com/logandonley/fleet) with some of the stuff I
talked about here.
