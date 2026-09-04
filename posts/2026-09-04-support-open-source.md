---
title: "Support Open Source"
date: "2026-09-04"
summary: "Put your server resources to good use"
cover: "/posts/images/penguin-banner.webp"
---

Open source software makes up a significant part of the infrastructure I use
every day. It is easy to install a project, benefit from years of other people's
work, and never think about what keeps it going. Writing code, reporting issues,
and donating money are all great ways to give something back. However, they are
not the only options.

Some open source projects depend on networks of volunteers. If you already have
a server and an internet connection with spare capacity, you can donate compute,
storage, and bandwidth instead.

This was a goal of mine for a long time while running my homelab, however I
found the articles documenting what to run never hit the mark on contributing to
others. Here is my compiled top 5 list:

## 1. Tor Bridge

![Tor bridge](/posts/images/tor.webp)

[Tor](https://www.torproject.org/) helps people access the internet with more
privacy. This can help people avoid censorship in the country that they live in,
helping maintain a free and open world.

Normal Tor relays are listed publicly, which makes it relatively easy for an ISP
or government to block them. A
[Tor bridge](https://support.torproject.org/relays/getting-started/what-is-a-bridge/)
is not listed in the public directory, making it harder to block. Running a
bridge is a much better option for a residential connection as it can help you
stay more anonymous while running this.

One thing I strongly recommend you do not run is an exit relay unless you have
explicit approval from your ISP. Running an exit relay means traffic leaves the
Tor network from your IP address, potentially leading to legal trouble for you.

The main resource being donated here is bandwidth. It is worth setting a limit
which your connection can sustain and keeping the service up to date. A small,
reliable bridge is more useful than one which is regularly switched off because
it is consuming too much bandwidth.

## 2. Syncthing Relay

![Syncthing relay](/posts/images/syncthing.webp)

I use [Syncthing](https://syncthing.net/) to synchronise files between my
devices. Usually, two Syncthing devices will connect directly. This does not
always work when restrictive firewalls or NAT are involved (as most of the
internet is). Syncthing falls back on public relays in these situations.

The public relay network is community operated. By running
[strelaysrv](https://docs.syncthing.net/users/strelaysrv.html), my server joins
the relay pool and becomes available to other Syncthing users. The relay only
retransmits encrypted data; the connection between the two devices remains
end-to-end encrypted. It can see connection information and the amount of
traffic being transferred, but not the contents of the files.

This was one of the simpler services to add. It does not need much storage, but
it can use a considerable amount of bandwidth. Syncthing provides global and
per-session rate limits, which makes it easy to donate a useful amount without
allowing one connection to take over the server.

Syncthing is one of my favourite bits of software and I strongly recommend
considering this above all others in this list due to its low system
requirements, ease of setup, and impact.

## 3. Flightradar24 ADS-B Receiver

![Flightradar24 ADS-B receiver](/posts/images/flightradar24.webp)

This entry is slightly different from the others because
[Flightradar24](https://www.flightradar24.com/) is a commercial service rather
than an open source project. However, its coverage still depends heavily on
people providing hardware, electricity, an antenna location, and an internet
connection. It is a network mostly run by enthusiasts.

Flightradar24 builds its live map from a worldwide network of ADS-B receivers.
Aircraft broadcast their position, altitude, speed, and other information freely
available over radio, which nearby receivers decode and send to Flightradar24.

If you already have a compatible receiver, the official
[data sharing software](https://www.flightradar24.com/share-your-data) can feed
your observations into the network. Flightradar24 also provides complete
receiver kits free of charge to suitable hosts in areas where more coverage is
needed. In return for keeping a receiver online, contributors receive access to
the Contributor plan.

The important resource here is not compute or storage, but a good view of the
sky. ADS-B uses a line-of-sight radio signal, so a well-positioned antenna will
make a much larger contribution than a powerful server hidden behind several
walls. However, even without this you can still provide miles of coverage.

## 4. Monero Node

![Monero node](/posts/images/monero.webp)

A [Monero node](https://docs.getmonero.org/running-node/monerod-systemd/)
downloads and verifies the Monero blockchain. It then communicates with other
nodes to relay blocks and transactions. Running my own node means I can interact
with the network directly instead of depending on somebody else's remote node.

It is also possible to provide a public, restricted RPC service for people who
do not run their own node. This requires more resources and should not be
confused with exposing unrestricted administrative access to the daemon. The
official guide provides a sensible starting configuration and runs monerod as a
systemd service so that it remains synchronised.

Running a node is not the same as mining, and there is no automatic reward for
doing it. The contribution is additional capacity and another independently
verifying participant in the network. The largest cost is storage, although a
pruned node is available if keeping the full blockchain is impractical.

## 5. Bitcoin Node

![Bitcoin node](/posts/images/bitcoin.webp)

My Bitcoin node has a similar purpose. A full node downloads transactions and
blocks, checks them against Bitcoin's consensus rules, and relays valid data to
other peers. This helps keep verification distributed instead of leaving it to a
small number of large services.

A [Bitcoin Core](https://bitcoin.org/en/full-node) node can work for its owner
with only outbound connections, but accepting inbound connections makes it more
useful to the rest of the network. As with Monero, running a Bitcoin node does
not mine coins or provide a financial reward.

The initial synchronisation takes time and uses a significant amount of disk
space (even more than Monero) and bandwidth. Once it has caught up, it becomes a
fairly uneventful service to operate.

## Closing thoughts

Supporting open source does not always mean opening a code editor. These
projects need infrastructure as well as code, and a spare server can do more
than sit idle. Running these services has allowed me to make better use of my
homelab while supporting privacy, decentralisation, and software that I value.

If you have reliable hardware and spare bandwidth, I would recommend picking one
project you already use and looking at what you can provide. Even a modest
contribution becomes valuable when many people make it.
