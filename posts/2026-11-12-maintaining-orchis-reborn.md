---
title: "Maintaining Orchis Reborn"
date: "2026-11-12"
summary: "Bringing Orchis to GNOME 51 with adaptive window colours and system accents"
cover: "/posts/images/Orchis-Reborn.png"
tags: [coding, open-source]
---

I've recently picked up maintenance of a GNOME theme through my own fork,
[Orchis Reborn](https://github.com/TA-Solaris/Orchis-Reborn-theme). It is based
on [Orchis by vinceliuice](https://github.com/vinceliuice/Orchis-theme), so a
considerable amount of the work and the design already existed. My focus has
been bringing it forward from GNOME Shell 48 to 51 and updating the GTK styling
for modern applications.

A core feature that I wanted was to support accent colours and light or dark
windows through the normal GNOME settings. If I select green in Settings, I
want the theme to use green. If I switch to dark mode, I want my windows to
follow. This sounds like quite a simple requirement, but there are several
different parts of the desktop involved in making it work.

![Orchis Reborn with light application windows, a green accent colour, and dark GNOME Shell quick settings](/posts/images/Orchis-Reborn.png)

## Understanding the different parts

GNOME Shell handles things like the top panel, overview, notifications, and
quick settings. GTK handles the widgets inside applications. Libadwaita builds
on GTK 4 and provides additional widgets and styling for many GNOME apps.
These parts can appear together on the same screen while handling their
appearance separately.

This makes updating a desktop theme a little more complicated than it first
appears. Getting the quick settings menu looking right does not mean that Files
will look right. From the user's perspective it is all one desktop, so having
these parts look consistent is quite important.

## Moving from GNOME Shell 48 to 51

The challenge with carrying the Shell theme forward is that the interface being
styled changes over time. Menus, dialogs, and the overview can change underneath
a theme, leaving parts looking wrong even when the rest of the desktop appears
fine. A theme which worked on GNOME Shell 48 cannot simply be assumed to work on
51.

Some problems are quite subtle. Text might be readable against a dark background
but disappear against a light one, or a button might look fine until it is
selected. GNOME Shell 51 support is now working, but keeping up with future
changes will be an ongoing part of maintaining the theme.

## Moving from GTK 3 to GTK 4

The [move to GTK 4](https://docs.gtk.org/gtk4/migrating-3to4.html) brings changes
to the widgets and styling that applications use. An older theme cannot always
be carried across unchanged, even when the application itself looks fairly
similar.

Libadwaita adds another consideration. Many modern GNOME applications use it for
their appearance and behaviour, including light and dark preferences. Applying
a traditional GTK theme does not automatically mean that all of these
applications will follow it. This helps explain why customising a GNOME desktop
can leave some windows looking quite different from others.

Orchis Reborn now targets GTK 4.20 and later, alongside libadwaita. The current
version does not include a GTK 3 theme, so I've left it to the user to choose
how they want to theme older applications.

## Following the accent colour

An accent colour affects more than a single button. It appears in selections,
switches, and other places which show that something is active. If an
application keeps its own fixed colours, changing the accent in Settings can
leave you with a mixture across the desktop.

I wanted Orchis Reborn to follow that setting while keeping its own appearance.
Choosing a different accent should not require installing another version of
the theme. There is also readability to consider: a colour which works well on
a dark window might be difficult to see on a light one. Supporting the choice
means making sure it works in both.

## Following light and dark settings

The same applies to light and dark windows. Once the theme is applied, switching
appearance in GNOME Settings should be enough. Orchis Reborn follows that
preference, although applications with their own light or dark setting can still
make a different choice. This is part of how
[libadwaita handles appearance](https://gnome.pages.gitlab.gnome.org/libadwaita/doc/main/styles-and-appearance.html).

The Shell popup colours are a separate choice. The standard Orchis Reborn
variant keeps them dark, while the light variants provide light popups and
dialogs. Application windows follow the appearance setting in either case.
This means I can have light windows alongside dark quick settings, as shown in
the screenshot, while using the same accent colour across both.

## Developing with Nix

I've also moved to using Nix for development and building the theme. The project
defines the tools it needs in a development environment, alongside the builds
for each theme variant. This makes it easier to get the same setup on another
machine without manually installing the dependencies.

As I already use Nix for my own configuration, this fits quite naturally into
how I manage my desktop. It also means the theme can be installed through Home
Manager, with release archives available for people who do not use Nix. I've
written more about this approach in my
[introduction to Nix](/post/2025-12-14-nix-introduction).

## Final thoughts

Picking up maintenance of an existing theme involves understanding the decisions
already in it, then working out which ones still fit the current desktop. A lot
of the detail is in selectors, colour handling, and the interaction between
components which look like one interface to the person using them.

I'm pleased to have Orchis Reborn working on GNOME 51, particularly with the
normal appearance settings controlling the accent and window colours. These are
settings I want to use without having to rebuild or manually edit my theme each
time.

If you'd like to try it, the
[repository](https://github.com/TA-Solaris/Orchis-Reborn-theme) has installation
instructions, including Nix and Home Manager configuration. The original Orchis
project provided a great starting point, and I look forward to continuing the
work on this fork.
