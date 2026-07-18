# Hyprland Animation Studio

Hyprland Animation Studio is a small local web app for people who want to tune Hyprland animations without repeatedly editing config files by hand. Pick a starting preset, shape a bezier curve, try the result in the built-in sandbox, then apply it when it feels right.

It is designed for Hyprland setups that use Omarchy's `looknfeel.conf`, but it keeps your animation changes in their own file rather than changing the shipped defaults.

## What you can do

- Start with balanced, snappy, cinematic, or near-instant presets.
- Drag bezier control points to build custom easing curves, including overshoot for a little bounce.
- Adjust individual animation rules, durations, curves, and style modifiers such as `popin 85%` or `slidevert`.
- Configure animation behavior for common layer surfaces including Walker, Waybar, and Mako.
- Preview window, workspace, and border transitions before saving.
- Use the interface comfortably on smaller screens; controls stack and the rule tables become readable cards.

## Requirements

- Linux with Hyprland installed and running
- Node.js 18 or newer
- `hyprctl` available in your `PATH`
- An Omarchy-style Hyprland configuration if you want automatic `looknfeel.conf` integration

## Getting started

From the project directory, install the one runtime dependency and start the local server:

```bash
npm install
npm start
```

Open [http://localhost:3888](http://localhost:3888) in a browser. The app reads the current animation configuration when it loads. Make your changes, use the sandbox to sanity-check the feel, and choose **Save & Apply Config** when you are ready.

The server is local-only in normal use; it is not intended to be exposed to a network.

## What gets changed

On the first save, the app makes sure this line is present in `~/.config/hypr/looknfeel.conf`:

```ini
source = ~/.config/hypr/animations.conf
```

It writes the generated settings to `~/.config/hypr/animations.conf`, backs up `looknfeel.conf` before adding that source line, and then runs `hyprctl reload`. If Hyprland reports config errors, the interface shows them after the save.

The defaults under `~/.local/share/omarchy/` are used as a fallback for reading and are not edited.

## A couple of notes

Hyprland expresses animation speed in deciseconds: `1 ds` is 100 ms. Lower values feel faster. The sandbox is a useful approximation of timing and easing, but it cannot perfectly reproduce every compositor animation or app-specific layer surface.

If a save fails, check that Hyprland is running in the same user session as the server and that your `~/.config/hypr/` files are writable.
