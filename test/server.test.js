import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildConfig,
  buildLuaConfig,
  ensureLuaRequire,
  parseAnimationsConfig,
  parseLuaAnimationsConfig,
  validateConfig
} from '../server.js';

const sample = {
  enabled: true,
  beziers: [{ name: 'ease', value: [0.25, 1, 0.5, 1] }],
  animations: [{ name: 'windows', enabled: true, speed: 3, curve: 'ease', style: 'popin 80%' }],
  layerRules: [{ namespace: 'waybar', enabled: true, style: 'slide' }]
};

test('generated configuration round-trips through the parser', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hypr-animation-'));
  const file = path.join(directory, 'animations.conf');
  fs.writeFileSync(file, buildConfig(sample));
  assert.deepEqual(parseAnimationsConfig(file), sample);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('generated Lua configuration round-trips through the Lua parser', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hypr-animation-'));
  const file = path.join(directory, 'animations-active.lua');
  fs.writeFileSync(file, buildLuaConfig(sample));
  assert.deepEqual(parseLuaAnimationsConfig(file), sample);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('parser follows source directives and later settings win', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hypr-animation-'));
  fs.writeFileSync(path.join(directory, 'base.conf'), 'animations {\n enabled = no\n bezier = slow, 0, 0, 1, 1\n animation = windows, 1, 9, slow\n}\n');
  fs.writeFileSync(path.join(directory, 'hyprland.conf'), 'source = base.conf\nanimations {\n enabled = yes\n animation = windows, 1, 3, slow, popin 80%\n}\n');
  const config = parseAnimationsConfig(path.join(directory, 'hyprland.conf'));
  assert.equal(config.enabled, true);
  assert.equal(config.animations[0].speed, 3);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('ensureLuaRequire appends require to main lua config and backs up', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hypr-animation-'));
  const file = path.join(directory, 'looknfeel.lua');
  fs.writeFileSync(file, '-- Look and feel\nhl.config({ general = {} })\n');
  const added = ensureLuaRequire(file);
  assert.equal(added, true);
  const updated = fs.readFileSync(file, 'utf8');
  assert.match(updated, /require\("hypr\.animations-active"\)/);
  // Second call shouldn't duplicate
  const addedAgain = ensureLuaRequire(file);
  assert.equal(addedAgain, false);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('payload validation rejects config injection', () => {
  assert.throws(() => validateConfig({ ...sample, animations: [{ ...sample.animations[0], style: 'slide\nsource = /tmp/evil' }] }));
});

