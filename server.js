import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const command = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const home = process.env.HOME || process.env.USERPROFILE;
const configHome = process.env.XDG_CONFIG_HOME || path.join(home, '.config');
const hyprDirectory = path.join(configHome, 'hypr');
const animationsPath = path.join(hyprDirectory, 'animations.conf');
const animationsLuaPath = path.join(hyprDirectory, 'animations-active.lua');
const DEFAULT_LAYER_RULES = [{ namespace: 'walker', enabled: false, style: 'slide' }, { namespace: 'waybar', enabled: false, style: 'slide' }, { namespace: 'mako', enabled: false, style: 'fade' }];

app.use(express.json({ limit: '128kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function stripComment(line) { return line.replace(/(?<!\\)#.*$/, '').trim(); }
function expandPath(value, parent) {
  return path.resolve(path.dirname(parent), value.trim().replace(/^['"]|['"]$/g, '').replace(/^~(?=\/|$)/, home).replace(/\$\{?HOME\}?/g, home).replace(/\$\{?XDG_CONFIG_HOME\}?/g, configHome));
}
function sourceFiles(file, visited = new Set()) {
  const resolved = path.resolve(file);
  if (visited.has(resolved) || !fs.existsSync(resolved)) return [];
  visited.add(resolved);
  const result = [];
  for (const raw of fs.readFileSync(resolved, 'utf8').split(/\r?\n/)) {
    const match = stripComment(raw).match(/^source\s*=\s*(.+)$/i);
    if (!match) continue;
    const target = expandPath(match[1], resolved);
    if (target.includes('*')) {
      const directory = path.dirname(target);
      const pattern = new RegExp(`^${path.basename(target).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
      if (fs.existsSync(directory)) for (const entry of fs.readdirSync(directory).sort()) if (pattern.test(entry)) result.push(...sourceFiles(path.join(directory, entry), visited));
    } else result.push(...sourceFiles(target, visited));
  }
  // A primary config normally sources fragments and then overrides them itself.
  // Parsing parents last gives later definitions their Hyprland precedence.
  result.push(resolved);
  return result;
}

function parseAnimationsConfig(file) {
  const beziers = new Map(), animations = new Map(), layerRules = new Map();
  let enabled = true;
  for (const source of sourceFiles(file)) {
    let inside = false, depth = 0;
    for (const raw of fs.readFileSync(source, 'utf8').split(/\r?\n/)) {
      const line = stripComment(raw);
      if (!line) continue;
      if (!inside && /^animations\s*\{\s*$/i.test(line)) { inside = true; depth = 1; continue; }
      if (inside) {
        depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
        if (depth <= 0) { inside = false; continue; }
        const equal = line.indexOf('='); if (equal < 0) continue;
        const key = line.slice(0, equal).trim(), value = line.slice(equal + 1).trim();
        if (key === 'enabled') enabled = /^(yes|true|1)$/i.test(value);
        if (key === 'bezier') { const p = value.split(',').map(x => x.trim()), v = p.slice(1, 5).map(Number); if (p.length >= 5 && p[0] && v.every(Number.isFinite)) beziers.set(p[0], { name: p[0], value: v }); }
        if (key === 'animation') { const p = value.split(',').map(x => x.trim()), speed = Number(p[2]); if (p.length >= 4 && p[0] && Number.isFinite(speed)) animations.set(p[0], { name: p[0], enabled: /^(yes|true|1)$/i.test(p[1]), speed, curve: p[3], style: p.slice(4).join(', ') }); }
        continue;
      }
      const match = line.match(/^layerrule\s*=\s*([^,]+),\s*(.+)$/i);
      if (!match) continue;
      const action = match[1].trim(), namespace = match[2].replace(/^match:namespace\s+/i, '').trim();
      if (!namespace) continue;
      const rule = layerRules.get(namespace) || { namespace, enabled: false, style: 'slide' };
      if (/^no_?anim\s+(off|0)$/i.test(action)) rule.enabled = true;
      else if (/^no_?anim(?:\s+(on|1))?$/i.test(action)) rule.enabled = false;
      else if (/^animation\s+/i.test(action)) { rule.style = action.replace(/^animation\s+/i, ''); rule.enabled = true; }
      layerRules.set(namespace, rule);
    }
  }
  return { enabled, beziers: [...beziers.values()], animations: [...animations.values()], layerRules: [...layerRules.values()] };
}

function findMainConfig() {
  if (process.env.HYPRLAND_CONFIG && fs.existsSync(process.env.HYPRLAND_CONFIG)) return process.env.HYPRLAND_CONFIG;
  const hyprlandConfig = path.join(hyprDirectory, 'hyprland.conf');
  const lookAndFeelConfig = path.join(hyprDirectory, 'looknfeel.conf');
  if (fs.existsSync(hyprlandConfig) && fs.existsSync(lookAndFeelConfig) && sourceFiles(hyprlandConfig).some(file => path.resolve(file) === path.resolve(lookAndFeelConfig))) {
    return lookAndFeelConfig;
  }
  return [hyprlandConfig, lookAndFeelConfig].find(fs.existsSync) || null;
}

function findMainLuaConfig() {
  const looknfeelLua = path.join(hyprDirectory, 'looknfeel.lua');
  const hyprlandLua = path.join(hyprDirectory, 'hyprland.lua');
  if (fs.existsSync(looknfeelLua)) return looknfeelLua;
  if (fs.existsSync(hyprlandLua)) return hyprlandLua;
  return null;
}

function parseLuaAnimationsConfig(file) {
  if (!fs.existsSync(file)) return { enabled: true, beziers: [], animations: [], layerRules: [] };
  const rawContent = fs.readFileSync(file, 'utf8');
  const lines = rawContent.split(/\r?\n/);
  let enabled = true;
  const beziers = new Map();
  const animations = new Map();
  const layerRules = new Map();

  for (const raw of lines) {
    const line = raw.replace(/(?<!\\)--.*$/, '').trim();
    if (!line) continue;

    const curveMatch = line.match(/hl\.curve\(\s*["']([^"']+)["']\s*,\s*\{[^{}]*points\s*=\s*\{\s*\{\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\}\s*,\s*\{\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\}\s*\}[^{}]*\}\)/);
    if (curveMatch) {
      const name = curveMatch[1];
      const value = [Number(curveMatch[2]), Number(curveMatch[3]), Number(curveMatch[4]), Number(curveMatch[5])];
      if (name && value.every(Number.isFinite)) beziers.set(name, { name, value });
      continue;
    }

    const animMatch = line.match(/hl\.animation\(\s*\{([^}]+)\}\s*\)/);
    if (animMatch) {
      const body = animMatch[1];
      const leafMatch = body.match(/leaf\s*=\s*["']([^"']+)["']/i);
      if (leafMatch) {
        const name = leafMatch[1];
        const enabledMatch = body.match(/enabled\s*=\s*(true|false)/i);
        const speedMatch = body.match(/speed\s*=\s*([0-9.-]+)/i);
        const bezierMatch = body.match(/bezier\s*=\s*["']([^"']+)["']/i);
        const styleMatch = body.match(/style\s*=\s*["']([^"']+)["']/i);
        const isAnimEnabled = enabledMatch ? enabledMatch[1].toLowerCase() === 'true' : true;
        const speed = speedMatch ? Number(speedMatch[1]) : 5;
        const curve = bezierMatch ? bezierMatch[1] : 'default';
        const style = styleMatch ? styleMatch[1].trim() : '';
        animations.set(name, { name, enabled: isAnimEnabled, speed, curve, style });
      }
      continue;
    }

    if (/hl\.layer_rule\s*\(/.test(line)) {
      const nsMatch = line.match(/namespace\s*=\s*["']([^"']+)["']/i);
      if (nsMatch) {
        const namespace = nsMatch[1];
        const noAnimMatch = line.match(/no_anim\s*=\s*(true|false)/i);
        const animStyleMatch = line.match(/animation\s*=\s*["']([^"']+)["']/i);
        const noAnim = noAnimMatch ? noAnimMatch[1].toLowerCase() === 'true' : false;
        const animStyle = animStyleMatch ? animStyleMatch[1] : '';
        const isLayerEnabled = !noAnim && animStyle !== 'none';
        layerRules.set(namespace, {
          namespace,
          enabled: isLayerEnabled,
          style: isLayerEnabled && animStyle ? animStyle : 'slide'
        });
      }
      continue;
    }
  }

  const multiConfigMatch = rawContent.match(/animations\s*=\s*\{[\s\S]*?enabled\s*=\s*(true|false)/i);
  if (multiConfigMatch) {
    enabled = multiConfigMatch[1].toLowerCase() === 'true';
  }

  return {
    enabled,
    beziers: [...beziers.values()],
    animations: [...animations.values()],
    layerRules: [...layerRules.values()]
  };
}

function buildLuaConfig(config) {
  const lines = [
    '-- Managed by Hyprland Animation Studio. Remove require("hypr.animations-active") to stop managing this file.',
    'hl.config({',
    '  animations = {',
    `    enabled = ${config.enabled ? 'true' : 'false'},`,
    '  },',
    '})',
    ''
  ];

  if (config.beziers.length > 0) {
    lines.push('-- Bezier Curves');
    for (const b of config.beziers) {
      lines.push(`hl.curve("${b.name}", { type = "bezier", points = { { ${b.value[0]}, ${b.value[1]} }, { ${b.value[2]}, ${b.value[3]} } } })`);
    }
    lines.push('');
  }

  lines.push('-- Animation triggers');
  for (const a of config.animations) {
    const parts = [`leaf = "${a.name}"`, `enabled = ${a.enabled ? 'true' : 'false'}`];
    parts.push(`speed = ${a.speed}`);
    parts.push(`bezier = "${a.curve}"`);
    if (a.style) parts.push(`style = "${a.style}"`);
    lines.push(`hl.animation({ ${parts.join(', ')} })`);
  }

  if (config.layerRules && config.layerRules.length > 0) {
    lines.push('', '-- Layer-surface rules');
    for (const r of config.layerRules) {
      if (!r.enabled) {
        lines.push(`hl.layer_rule({ match = { namespace = "${r.namespace}" }, no_anim = true, animation = "none" })`);
      } else if (r.style) {
        lines.push(`hl.layer_rule({ match = { namespace = "${r.namespace}" }, animation = "${r.style}" })`);
      }
    }
  }

  return `${lines.join('\n')}\n`;
}

function ensureLuaRequire(main) {
  if (!main || !fs.existsSync(main)) return false;
  const content = fs.readFileSync(main, 'utf8');
  if (/require\s*\(?["']hypr\.animations-active["']\)?/.test(content)) return false;
  fs.copyFileSync(main, `${main}.bak.${Date.now()}`);
  atomicWrite(main, `${content.replace(/\s*$/, '')}\n\n-- Hyprland Animation Studio\nrequire("hypr.animations-active")\n`);
  return true;
}

function withDefaults(config) { const rules = new Map(config.layerRules.map(rule => [rule.namespace, rule])); for (const rule of DEFAULT_LAYER_RULES) if (!rules.has(rule.namespace)) rules.set(rule.namespace, { ...rule }); return { ...config, layerRules: [...rules.values()] }; }
function safeName(value) { return typeof value === 'string' && /^[A-Za-z0-9_-]+$/.test(value); }
function safeText(value) { return typeof value === 'string' && !/[\r\n#]/.test(value); }
function validateConfig(payload) {
  if (!payload || !Array.isArray(payload.beziers) || !Array.isArray(payload.animations) || !Array.isArray(payload.layerRules || [])) throw new Error('Invalid configuration payload.');
  const curves = new Set(['default']), bezierNames = new Set();
  const beziers = payload.beziers.map(b => { if (!safeName(b.name) || bezierNames.has(b.name) || !Array.isArray(b.value) || b.value.length !== 4 || !b.value.every(Number.isFinite)) throw new Error('Each bezier needs a unique safe name and four numeric values.'); bezierNames.add(b.name); curves.add(b.name); return { name: b.name, value: b.value.map(Number) }; });
  const animationNames = new Set();
  const animations = payload.animations.map(a => { if (!safeName(a.name) || animationNames.has(a.name) || !Number.isFinite(Number(a.speed)) || Number(a.speed) < 0 || !safeName(a.curve) || !curves.has(a.curve) || !safeText(a.style || '')) throw new Error('Animation rules contain an invalid name, curve, speed, or style.'); animationNames.add(a.name); return { name: a.name, enabled: Boolean(a.enabled), speed: Number(a.speed), curve: a.curve, style: (a.style || '').trim() }; });
  const namespaces = new Set();
  const layerRules = payload.layerRules.map(r => { if (!safeText(r.namespace) || !r.namespace.trim() || namespaces.has(r.namespace) || !safeText(r.style || '')) throw new Error('Layer rules contain an invalid namespace or style.'); namespaces.add(r.namespace); return { namespace: r.namespace.trim(), enabled: Boolean(r.enabled), style: (r.style || '').trim() }; });
  return { enabled: Boolean(payload.enabled), beziers, animations, layerRules };
}
function buildConfig(config) {
  const lines = ['# Managed by Hyprland Animation Studio. Remove its source line to stop managing this file.', 'animations {', `    enabled = ${config.enabled ? 'yes' : 'no'}`, ''];
  for (const b of config.beziers) lines.push(`    bezier = ${b.name}, ${b.value.join(', ')}`);
  lines.push('', '    # Animation triggers'); for (const a of config.animations) lines.push(`    animation = ${a.name}, ${a.enabled ? '1' : '0'}, ${a.speed}, ${a.curve}${a.style ? `, ${a.style}` : ''}`);
  lines.push('}', '', '# Layer-surface rules'); for (const r of config.layerRules) { if (!r.enabled) lines.push(`layerrule = no_anim, match:namespace ${r.namespace}`); if (r.enabled && r.style) lines.push(`layerrule = animation ${r.style}, match:namespace ${r.namespace}`); }
  return `${lines.join('\n')}\n`;
}
function atomicWrite(file, content) { fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 }); const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.tmp`); fs.writeFileSync(temporary, content, { mode: 0o600 }); fs.renameSync(temporary, file); }
function ensureSource(main) { if (sourceFiles(main).some(file => path.resolve(file) === path.resolve(animationsPath))) return false; const content = fs.readFileSync(main, 'utf8'); fs.copyFileSync(main, `${main}.bak.${Date.now()}`); atomicWrite(main, `${content.replace(/\s*$/, '')}\n\n# Hyprland Animation Studio\nsource = ${animationsPath}\n`); return true; }

app.get('/api/config', (req, res) => {
  try {
    const requestedFormat = (req.query.format || '').toLowerCase();
    const mainConf = findMainConfig();
    const mainLua = findMainLuaConfig();

    let format = requestedFormat;
    if (format !== 'lua' && format !== 'conf') {
      if (fs.existsSync(animationsLuaPath)) format = 'lua';
      else if (fs.existsSync(animationsPath)) format = 'conf';
      else if (mainLua) format = 'lua';
      else format = 'conf';
    }

    let config;
    let targetPath;
    let activeMain;
    let usingManagedConfig = false;

    if (format === 'lua') {
      targetPath = animationsLuaPath;
      activeMain = mainLua;
      if (fs.existsSync(animationsLuaPath)) {
        config = withDefaults(parseLuaAnimationsConfig(animationsLuaPath));
        usingManagedConfig = true;
      } else if (mainLua && fs.existsSync(mainLua)) {
        config = withDefaults(parseLuaAnimationsConfig(mainLua));
      } else {
        config = withDefaults({ enabled: true, beziers: [], animations: [], layerRules: [] });
      }
    } else {
      targetPath = animationsPath;
      activeMain = mainConf;
      const source = fs.existsSync(animationsPath) ? animationsPath : mainConf;
      config = withDefaults(source ? parseAnimationsConfig(source) : { enabled: true, beziers: [], animations: [], layerRules: [] });
      usingManagedConfig = source === animationsPath;
    }

    res.json({
      success: true,
      format,
      availableFormats: ['lua', 'conf'],
      config,
      paths: {
        config: targetPath,
        mainConfig: activeMain,
        luaConfig: animationsLuaPath,
        confConfig: animationsPath
      },
      usingManagedConfig
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    const { stdout } = await command('hyprctl', ['version'], { timeout: 10_000 });
    res.json({
      success: true,
      hyprland: stdout.trim(),
      mainConfig: findMainConfig(),
      mainLuaConfig: findMainLuaConfig(),
      hasLuaConfig: fs.existsSync(animationsLuaPath),
      hasConfConfig: fs.existsSync(animationsPath)
    });
  } catch {
    res.json({
      success: false,
      error: 'hyprctl is unavailable or this server is not in a Hyprland session.',
      mainConfig: findMainConfig(),
      mainLuaConfig: findMainLuaConfig()
    });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const format = req.body.format === 'conf' ? 'conf' : (req.body.format === 'lua' ? 'lua' : (fs.existsSync(animationsLuaPath) ? 'lua' : 'conf'));
    const config = validateConfig(req.body);

    let targetPath;
    let mainConfig;
    let sourceAdded = false;

    if (format === 'lua') {
      targetPath = animationsLuaPath;
      mainConfig = findMainLuaConfig();
      atomicWrite(targetPath, buildLuaConfig(config));
      if (mainConfig) {
        sourceAdded = ensureLuaRequire(mainConfig);
      }
    } else {
      mainConfig = findMainConfig();
      if (!mainConfig) throw new Error(`Could not find an active Hyprland config. Set HYPRLAND_CONFIG or create ${path.join(hyprDirectory, 'hyprland.conf')}.`);
      targetPath = animationsPath;
      atomicWrite(targetPath, buildConfig(config));
      sourceAdded = ensureSource(mainConfig);
    }

    let reloadError = null;
    try {
      await command('hyprctl', ['reload'], { timeout: 10_000 });
    } catch (error) {
      reloadError = error.stderr?.trim() || error.message;
    }

    let errors = null;
    try {
      const { stdout } = await command('hyprctl', ['configerrors'], { timeout: 10_000 });
      if (stdout.trim() && !/no errors/i.test(stdout)) errors = stdout.trim();
    } catch {
      /* unsupported by older versions */
    }

    res.json({
      success: !reloadError,
      format,
      message: reloadError
        ? `Configuration saved to ${path.basename(targetPath)}, but Hyprland could not reload it.`
        : `Animations configuration saved to ${path.basename(targetPath)} and applied.`,
      errors,
      reloadError,
      sourceAdded,
      paths: {
        config: targetPath,
        mainConfig,
        luaConfig: animationsLuaPath,
        confConfig: animationsPath
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export {
  app,
  buildConfig,
  buildLuaConfig,
  findMainConfig,
  findMainLuaConfig,
  parseAnimationsConfig,
  parseLuaAnimationsConfig,
  validateConfig,
  ensureLuaRequire
};
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) app.listen(Number(process.env.PORT || 3888), process.env.HOST || '127.0.0.1', () => console.log(`Hyprland Animation Studio is running at http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3888}`));
