---
title: "NVF Introduction"
date: "2025-11-08"
summary: "Are you tired of copying your Neovim configuration around? Meet NVF"
cover: "/posts/images/neovim.webp"
tags: [nix, coding, open-source]
---

I've talked to other software engineers about how they manage their Neovim
configurations. Solutions I've heard range from managing configuration files
with home manager on Nix or a Git repo, all the way to copying and pasting the
files onto a new system. In any case, solutions seemed unreliable and prone to
configurations getting out of sync or being difficult to maintain.

This is where [NVF](https://github.com/NotAShelf/nvf) comes in. It leverages the
declaritive nature of the Nix programming language to define how your Neovim
configuration should be. Additionally, as it stores plugins and the
configuration in the Nix store, multiple devs could use their own personal
Neovim configurations on the same machine with ease. Options for configuration
can be found in the [manual](https://notashelf.github.io/nvf/index.xhtml), which
is quite a convenient resource.

## Downsides

NVF provides an extra level of abstraction over the Lua code, requiring extra
knowledge when implementing configuration. I've found this is a big barrier to
getting things working, especially when customising Neovim is already quite a
complicated process.

## NVF vs NixVim

From the most part, I've gathered that NVF and NixVim are two projects both
trying to achieve the same thing. NixVim is more mature and has more options for
customisation that NVF, but NVF has more sensible configuration defaults which I
think aligns with Nix philosophies. I look forward to NVF catching up in
maturity to NixVim.

## Afterthought

If you'd like to try out my own
[personal NVF configuration](https://github.com/TA-Solaris/nvf), run the
following:

```bash
nix run github:TA-Solaris/nvf#default
```

Getting started with your own NVF configuration is quite easy. I'd recommend
watching [Vimjoyer's video](https://www.youtube.com/watch?v=uP9jDrRvAwM) on NVF.
Also, you can use my NVF configuration as a template or search through GitHub
for other peoples configurations like I did.
