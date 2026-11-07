---
title: "How to write good Home Assistant automations"
date: "2026-11-07"
summary: "Keeping control of your smart home"
cover: "/posts/images/lamp-banner.webp"
tags: [homelab, coding, open-source]
---

[Home Assistant](https://www.home-assistant.io/) gives you a lot of freedom to
automate your home. It is quite easy to get started with something like turning
on a light when you enter a room. However, getting that same automation to
behave how you want throughout the day takes a bit more thought. Nobody wants to
be waving their arms around in the dark or fighting with a light that keeps
turning itself back on (trust me, I've been there).

In my opinion, a good automation should be predictable and easy to override.
Here is how I would approach designing one, followed by a walkthrough of my own
room lighting blueprint.

## Consider your inputs

Before writing an automation, I would suggest looking at what information you
actually have available. Humidity, presence, luminosity, and temperature can all
be useful inputs, but each tells you something different about the room. A
humidity sensor might help you recognise when someone is showering. A presence
sensor can tell you whether a room is occupied. A luminosity reading can help
you decide whether additional lighting is needed, while temperature might
determine when to run a fan or heater.

The placement and behaviour of these sensors matter as much as the values they
report. A temperature sensor next to a radiator will give you a different
picture from one near where you sit. A motion sensor may stop detecting you
while you are reading. I'd recommend watching the history of your sensors during
normal use before deciding on thresholds and delays. Work around the data you
have, including its limitations.

You also need to consider how your outputs affect your inputs. Turning on the
lights will increase the reading on a luminosity sensor in the same room. If
your automation turns the lights off whenever the room becomes bright, it could
immediately undo its own work. The room becomes dark again, the lights come back
on, and you have accidentally made a disco.

Think about what a sensor reading will mean after your automation has acted. A
room made bright by your lights does not mean those lights are no longer needed.
Account for that feedback when deciding what should happen next.

I'd include an
[input boolean helper](https://www.home-assistant.io/integrations/input_boolean/)
in every automation so you can easily enable or disable its behaviour. Put the
toggle somewhere accessible on your dashboard so you can take manual control
whenever you need to.

## Setting the scene

An automation is only as good as what someone could do manually. If the lights
are too bright or the colour temperature is unpleasant, automatically applying
those settings does not make them any better. I would start by getting the room
how you want it using the normal controls.

Once you are happy with the result, save it as a
[Home Assistant scene](https://www.home-assistant.io/integrations/scene/).
Scenes store the states you want your entities to have and let you apply them
together. I'd suggest creating one for each outcome of your automation. For room
lighting, that could be a daytime scene, an evening scene, a dim night scene,
and a scene which turns all the relevant lights off. Test these manually first,
then let the automation decide which scene to activate.

This also means you can put the same scenes on your dashboard or assign them to
buttons. When you want something different, freeze the automation and choose a
scene yourself. Activating a scene manually does not automatically pause the
automation, so both controls are useful. The user should be in control of the
smart home, not the other way round.

## A real world example

My
[Room Occupancy Lighting blueprint](https://gist.github.com/TA-Solaris/a4c7475cd37e0a541e62b2ed3ec9f808)
puts these ideas together. It takes occupancy and luminosity sensors as inputs,
along with a variety of generic helpers. This lets me reuse the same logic with
different entities for each room. The snippets below are excerpts from the
blueprint.

### Knowing when to act

The occupancy triggers distinguish between someone entering and the room
remaining empty for a configurable period. This is the best trigger as its fits
the automations pattern best. You want lights to turn on when you are present
and to be off when you are not. Including this is a follows:

```yaml
triggers:
  - trigger: state
    entity_id: !input occupancy
    to: "off"
    for:
      minutes: !input clear_delay
    id: occupancy_clear

  - trigger: state
    entity_id: !input occupancy
    to: "on"
    id: occupancy_detected
```

My clear delay defaults to one minute. This gives the sensor some time before
the lights go off, which is useful if it briefly loses track of someone. You
will need to tune this for your room and sensor. A hallway and an office where
you sit still for long periods have quite different requirements.

My full blueprint also reacts when the luminosity sensor crosses a darkness
threshold, at sunrise and sunset, when Home Assistant starts, and once every
minute. That last trigger allows the lighting to move between time periods while
someone is still in the room.

### Applying scenes

My blueprint chooses a scene based on the time of day, allowing for brighter
lighting during the day and dimmer lighting at night. Once it has found the
matching time period, applying the scene is straightforward:

```yaml
- action: scene.turn_on
  target:
    entity_id: "{{ scenes_list[matching_index | int] }}"
  data:
    transition: !input transition
```

The brightness and colour settings live in the scene. The automation just
selects it, and uses a separate off scene when the room is empty. It also
accounts for lights already being on, so their effect on the darkness sensor
does not prevent it from applying the next scheduled scene.

### Leaving the user in control

Before applying either a lighting scene or the off scene, the blueprint checks
that freeze mode is off:

```yaml
- condition: state
  entity_id: !input freeze
  state: "off"
```

Turning freeze on prevents the automation from changing the lights, leaving you
free to adjust them or choose a scene manually. This matters because the
automation regularly reapplies its chosen scene while the room is occupied.

You can also have an automation back off when someone takes manual control. My
[Room Blinds Control blueprint](https://gist.github.com/TA-Solaris/4e6a136a7951d2ccadeef7bb9d41aaf4)
listens for changes to the blinds and pauses for an hour by default before
resuming the appropriate scene.

## Final thoughts

I'd recommend starting with one room and getting its scenes, sensor placement,
and timing right before reusing the blueprint elsewhere. Try entering, sitting
still, leaving, and taking manual control. Those everyday situations will tell
you far more about the quality of your automation than how complicated its YAML
looks.

As with all aspects of a smart home, your automations will grow and change with
your life. Understand what you need, reflect it in your configuration and life
will become easier.
