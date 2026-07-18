const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3888;
const HOST = '127.0.0.1';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Paths
const USER_HOME = process.env.HOME || '/home/fixn';
const LOOK_AND_FEEL_PATH = path.join(USER_HOME, '.config/hypr/looknfeel.conf');
const ANIMATIONS_CONFIG_PATH = path.join(USER_HOME, '.config/hypr/animations.conf');
const DEFAULT_LOOK_AND_FEEL_PATH = path.join(USER_HOME, '.local/share/omarchy/default/hypr/looknfeel.conf');

// Helper to execute commands and return output
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stdout || stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Simple Parser for Hyprland config files
function parseAnimationsConfig(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const beziers = [];
  const animations = [];
  const layerRules = [];
  let enabled = true;

  lines.forEach(line => {
    // Remove comments
    const cleanLine = line.split('#')[0].trim();
    if (!cleanLine) return;

    // Check for enabled flag
    if (cleanLine.startsWith('enabled')) {
      const parts = cleanLine.split('=');
      if (parts.length > 1) {
        const val = parts[1].trim();
        enabled = val.startsWith('yes') || val.startsWith('true') || val.startsWith('1');
      }
    }

    // Parse bezier
    if (cleanLine.startsWith('bezier')) {
      // Format: bezier = name, x1, y1, x2, y2
      const parts = cleanLine.split('=');
      if (parts.length > 1) {
        const params = parts[1].split(',').map(s => s.trim());
        if (params.length >= 5) {
          const name = params[0];
          const coords = params.slice(1, 5).map(parseFloat);
          beziers.push({ name, value: coords });
        }
      }
    }

    // Parse animation
    if (cleanLine.startsWith('animation')) {
      // Format: animation = name, onoff, speed, curve, style
      // or: animation = name, onoff, speed, curve
      const parts = cleanLine.split('=');
      if (parts.length > 1) {
        const params = parts[1].split(',').map(s => s.trim());
        if (params.length >= 4) {
          const name = params[0];
          const animEnabled = params[1] === '1' || params[1] === 'yes' || params[1] === 'true';
          const speed = parseFloat(params[2]);
          const curve = params[3];
          const style = params.slice(4).join(', '); // Join remaining for style (e.g. popin 80%)
          animations.push({ name, enabled: animEnabled, speed, curve, style });
        }
      }
    }

    // Parse layerrule
    if (cleanLine.startsWith('layerrule')) {
      // Format: layerrule = rule, match:namespace
      // or: layerrule = rule, namespace
      const parts = cleanLine.split('=');
      if (parts.length > 1) {
        const params = parts[1].split(',').map(s => s.trim());
        if (params.length >= 2) {
          const ruleAction = params[0];
          const matchCriteria = params[1];

          let namespace = matchCriteria;
          if (matchCriteria.startsWith('match:namespace ')) {
            namespace = matchCriteria.replace('match:namespace ', '').trim();
          }

          let entry = layerRules.find(l => l.namespace === namespace);
          if (!entry) {
            entry = { namespace, enabled: false, style: 'slide' };
            layerRules.push(entry);
          }

          if (ruleAction === 'no_anim off' || ruleAction === 'no_anim 0' || ruleAction === 'noanim off') {
            entry.enabled = true;
          } else if (ruleAction === 'no_anim on' || ruleAction === 'no_anim 1' || ruleAction === 'noanim') {
            entry.enabled = false;
          } else if (ruleAction.startsWith('animation ')) {
            entry.style = ruleAction.replace('animation ', '').trim();
            entry.enabled = true;
          }
        }
      }
    }
  });

  return { enabled, beziers, animations, layerRules };
}

// Default layer rule definitions
const DEFAULT_LAYER_RULES = [
  { namespace: 'walker', enabled: false, style: 'slide' },
  { namespace: 'waybar', enabled: false, style: 'slide' },
  { namespace: 'mako', enabled: false, style: 'fade' }
];

// API: Get current configurations (custom, falling back to defaults)
app.get('/api/config', (req, res) => {
  try {
    let config = parseAnimationsConfig(ANIMATIONS_CONFIG_PATH);
    let isUsingDefaults = false;

    if (!config || !config.beziers || config.beziers.length === 0) {
      // Try to read from main looknfeel.conf or fall back to system defaults
      config = parseAnimationsConfig(DEFAULT_LOOK_AND_FEEL_PATH);
      isUsingDefaults = true;
    }

    if (config) {
      // Pre-populate missing layer rules
      if (!config.layerRules) {
        config.layerRules = [];
      }
      DEFAULT_LAYER_RULES.forEach(defRule => {
        if (!config.layerRules.find(l => l.namespace === defRule.namespace)) {
          config.layerRules.push({ ...defRule });
        }
      });
    }

    res.json({
      success: true,
      isUsingDefaults,
      config: config || { enabled: true, beziers: [], animations: [], layerRules: DEFAULT_LAYER_RULES }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Save custom animations config
app.post('/api/config', async (req, res) => {
  const { enabled, beziers, animations, layerRules } = req.body;

  if (!beziers || !animations) {
    return res.status(400).json({ success: false, error: 'Invalid configuration payload.' });
  }

  try {
    // 1. Ensure `source = ~/.config/hypr/animations.conf` is appended to looknfeel.conf
    let looknfeelContent = '';
    if (fs.existsSync(LOOK_AND_FEEL_PATH)) {
      looknfeelContent = fs.readFileSync(LOOK_AND_FEEL_PATH, 'utf8');
    }

    const sourceLine = 'source = ~/.config/hypr/animations.conf';
    if (!looknfeelContent.includes(sourceLine)) {
      // Backup looknfeel.conf first
      const timestamp = Math.floor(Date.now() / 1000);
      fs.writeFileSync(`${LOOK_AND_FEEL_PATH}.bak.${timestamp}`, looknfeelContent);

      // Append source line
      const delimiter = looknfeelContent.endsWith('\n') ? '' : '\n';
      fs.writeFileSync(LOOK_AND_FEEL_PATH, looknfeelContent + delimiter + '\n# Include custom animations configurator config\n' + sourceLine + '\n');
    }

    // 2. Build the animations config string
    let configStr = `# Auto-generated by Hyprland Animation Configurator GUI\n`;
    configStr += `# Generated at: ${new Date().toISOString()}\n\n`;
    configStr += `animations {\n`;
    configStr += `    enabled = ${enabled ? 'yes' : 'no'}\n\n`;

    configStr += `    # Bezier Curves\n`;
    beziers.forEach(b => {
      configStr += `    bezier = ${b.name}, ${b.value.join(', ')}\n`;
    });
    configStr += `\n    # Animation Triggers\n`;
    animations.forEach(a => {
      const stylePart = a.style ? `, ${a.style}` : '';
      configStr += `    animation = ${a.name}, ${a.enabled ? '1' : '0'}, ${a.speed}, ${a.curve}${stylePart}\n`;
    });
    configStr += `}\n`;

    // 3. Add Layer Surface Animations
    if (layerRules && Array.isArray(layerRules)) {
      configStr += `\n# Layer Surface Animations\n`;
      layerRules.forEach(l => {
        if (l.enabled) {
          configStr += `layerrule = no_anim off, match:namespace ${l.namespace}\n`;
          if (l.style) {
            configStr += `layerrule = animation ${l.style}, match:namespace ${l.namespace}\n`;
          }
        } else {
          configStr += `layerrule = no_anim on, match:namespace ${l.namespace}\n`;
        }
      });
    }

    // 4. Write config file
    fs.writeFileSync(ANIMATIONS_CONFIG_PATH, configStr);

    // 5. Force Hyprland to reload config
    await runCommand('hyprctl reload');

    // 6. Check if there are any config errors
    let errorMsg = null;
    try {
      const errorOutput = await runCommand('hyprctl configerrors');
      if (errorOutput && errorOutput.trim() && !errorOutput.includes('no errors')) {
        errorMsg = errorOutput.trim();
      }
    } catch (e) {
      // Ignored if command fails
    }

    res.json({
      success: true,
      message: 'Animations configuration saved and applied successfully!',
      errors: errorMsg
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});


// Start server
app.listen(PORT, HOST, () => {
  console.log(`Hyprland Animation Configurator is running at http://${HOST}:${PORT}`);
});
