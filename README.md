# Hyprland Animation Studio

Hyprland Animation Studio is a local graphical web interface designed to configure, visually design, simulate, and apply window manager animations for the **Hyprland** Wayland compositor in real time.

Instead of guessing cubic-bezier coordinates and decisecond timings in text files, you can pick presets, drag bezier curve control points with overshoot bounce support, test transitions in a built-in sandbox, and apply changes directly to Hyprland with one click.

---

## ✨ Features

- **Dual-Engine Output**: Seamlessly switch between **Lua** (`animations-active.lua`) and **Hyprland Conf** (`animations.conf`) formats.
- **Visual Bezier Curve Designer**: Interactive HTML5 canvas with draggable control handles ($P_1$ & $P_2$) supporting overshoot ($Y > 1.0$) for bouncy physics.
- **Granular Animation Controls**: Configure speeds in deciseconds, bezier curves, and style modifiers (`popin 80%`, `slide`, `slidevert`, `fade`).
- **Layer Surface Animations**: Control entry and exit animations for desktop components like Walker (launcher), Waybar (panel), and Mako (notifications).
- **Curated Presets**: Quick-load profiles including *Omarchy Default*, *Material Decel (MD3)*, *Soft Elastic (Spring)*, *Hyperspeed Snappy*, *Cinematic Smooth*, and *Instant Response*.
- **Interactive Sandbox**: Live desktop simulator translating compositor timings into CSS transitions to preview window movements, workspace slides, and border glows before saving.
- **Safe & Non-Destructive**: Generates dedicated override files, creates timestamped backups before updating parent configs, and executes atomic file writes.

---

## 📋 Requirements

Before running the studio, ensure you have:
1. **Linux** running an active **Hyprland** session.
2. **Node.js 18+** installed (`node -v`).
3. **`hyprctl`** available in your `$PATH`.
4. A writable Hyprland config directory at `~/.config/hypr/` (or `$XDG_CONFIG_HOME/hypr/`).

---

## 🚀 Quick Start

1. Clone or navigate to the project directory:
   ```bash
   git clone https://github.com/your-username/hyprland-animation-configurator.git
   cd hyprland-animation-configurator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3888](http://localhost:3888) in your web browser.

> [!NOTE]
> By default, the server binds to `127.0.0.1:3888` for local security. To customize the port or host, pass environment variables:
> ```bash
> PORT=4000 HOST=127.0.0.1 npm start
> ```

---

## ⚙️ What Needs to Be Configured to Use This

Hyprland Animation Studio works out of the box and **automatically configures the required integration line** when you click **Save & Apply Config**. However, you can also verify or configure it manually.

Choose the mode matching your desktop environment:

### Mode A: Lua Configuration (Recommended for Omarchy & Hyprland Lua)

* **Managed File**: `~/.config/hypr/animations-active.lua`
* **Parent Config File**: `~/.config/hypr/looknfeel.lua` (or `~/.config/hypr/hyprland.lua`)

#### How it integrates:
Your Lua config loads the managed file with a standard Lua `require`:

```lua
-- In ~/.config/hypr/looknfeel.lua or ~/.config/hypr/hyprland.lua
require("hypr.animations-active")
```

#### What gets generated inside `animations-active.lua`:
```lua
-- Managed by Hyprland Animation Studio.
hl.config({
  animations = {
    enabled = true,
  },
})

-- Bezier Curves
hl.curve("fixnSmooth", { type = "bezier", points = { { 0.22, 1 }, { 0.36, 1 } } })

-- Animation triggers
hl.animation({ leaf = "global", enabled = true, speed = 8, bezier = "fixnSmooth" })
hl.animation({ leaf = "windowsIn", enabled = true, speed = 5.5, bezier = "fixnSmooth", style = "slide 18%" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 4.5, bezier = "fixnSmooth", style = "slide" })

-- Layer-surface rules
hl.layer_rule({ match = { namespace = "walker" }, animation = "slide" })
```

---

### Mode B: Conf Configuration (Stock Hyprland)

* **Managed File**: `~/.config/hypr/animations.conf`
* **Parent Config File**: `~/.config/hypr/hyprland.conf` (or `~/.config/hypr/looknfeel.conf`)

#### How it integrates:
Your main configuration file sources the dedicated animation file:

```ini
# In ~/.config/hypr/hyprland.conf or ~/.config/hypr/looknfeel.conf
source = ~/.config/hypr/animations.conf
```

#### What gets generated inside `animations.conf`:
```ini
# Managed by Hyprland Animation Studio.
animations {
    enabled = yes

    bezier = easeOutQuint, 0.23, 1, 0.32, 1
    bezier = quick, 0.15, 0, 0.1, 1

    # Animation triggers
    animation = global, 1, 10, default
    animation = windows, 1, 3.79, easeOutQuint
    animation = windowsIn, 1, 4.1, easeOutQuint, popin 87%
    animation = workspaces, 1, 5, easeOutQuint, slide
}

# Layer-surface rules
layerrule = animation slide, match:namespace walker
layerrule = no_anim, match:namespace waybar
```

---

## 🕹️ Step-by-Step Usage Guide

1. **Select Target Format**:
   - In the **Generated Configuration** panel on the right, click **Lua (.lua)** or **Hyprland (.conf)**.
   - The preview updates immediately to show the corresponding syntax and target file path.
2. **Select a Preset or Design Curves**:
   - Click a preset in the left sidebar (e.g. *Snappy*, *Soft Elastic*, or *Material Decel*).
   - In the **Curve Designer**, select any curve from **Active Beziers** and drag handles $P_1$ and $P_2$ on the canvas.
3. **Configure Rules**:
   - Adjust animation durations in the **Animation Rules** table. Timings are in deciseconds (`1 ds = 100 ms`, so `5.0 ds = 500 ms`).
   - Assign easing curves and optional style modifiers (such as `popin 80%` or `slide`).
4. **Test in the Sandbox**:
   - Click **Toggle Window In/Out**, **Switch Workspace**, or **Flash Border Active** to preview the physics in real time.
5. **Save & Apply**:
   - Click **Save & Apply Config**.
   - The backend atomically saves your settings, verifies integration, triggers `hyprctl reload`, and reports compositor diagnostics.
6. **Reload Saved Settings**:
   - Click **↻ Load saved** above the preview code block at any time to re-sync the UI with what is currently stored on disk.

---

## 🛡️ Safety & Rollback

- **Automatic Backups**: Before adding any integration line (`source = ...` or `require(...)`), a timestamped backup is created (e.g. `looknfeel.lua.bak.<timestamp>` or `hyprland.conf.bak.<timestamp>`).
- **Atomic File Writes**: Configurations are written to a temporary PID file and atomically renamed to prevent file corruption.
- **How to Stop Using the Studio**:
  1. Remove the integration line (`require("hypr.animations-active")` or `source = ~/.config/hypr/animations.conf`) from your primary config file.
  2. Optionally delete `~/.config/hypr/animations-active.lua` or `~/.config/hypr/animations.conf`.
  3. Run `hyprctl reload` in your terminal.

---

## 🧪 Testing

To run the automated test suite verifying both Lua and `.conf` parsers, generators, and security validations:

```bash
npm test
```
