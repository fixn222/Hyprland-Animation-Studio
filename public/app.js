// Preset Profiles
const PRESETS = [
  {
    id: 'default',
    name: 'Omarchy Default',
    desc: 'The clean, modern defaults configured by Omarchy. Smooth and balanced.',
    beziers: [
      { name: 'easeOutQuint', value: [0.23, 1, 0.32, 1] },
      { name: 'easeInOutCubic', value: [0.65, 0.05, 0.36, 1] },
      { name: 'linear', value: [0, 0, 1, 1] },
      { name: 'almostLinear', value: [0.5, 0.5, 0.75, 1.0] },
      { name: 'quick', value: [0.15, 0, 0.1, 1] }
    ],
    animations: [
      { name: 'global', enabled: true, speed: 10, curve: 'default', style: '' },
      { name: 'border', enabled: true, speed: 5.39, curve: 'easeOutQuint', style: '' },
      { name: 'windows', enabled: true, speed: 3.79, curve: 'easeOutQuint', style: '' },
      { name: 'windowsIn', enabled: true, speed: 4.1, curve: 'easeOutQuint', style: 'popin 87%' },
      { name: 'windowsOut', enabled: true, speed: 1.49, curve: 'linear', style: 'popin 87%' },
      { name: 'fadeIn', enabled: true, speed: 1.73, curve: 'almostLinear', style: '' },
      { name: 'fadeOut', enabled: true, speed: 1.46, curve: 'almostLinear', style: '' },
      { name: 'fade', enabled: true, speed: 3.03, curve: 'quick', style: '' },
      { name: 'workspaces', enabled: true, speed: 5.0, curve: 'easeOutQuint', style: 'slide' }
    ],
    layerRules: [
      { namespace: 'walker', enabled: false, style: 'slide' },
      { namespace: 'waybar', enabled: false, style: 'slide' },
      { namespace: 'mako', enabled: false, style: 'fade' }
    ]
  },
  {
    id: 'md3_expressive',
    name: 'Material Decel (MD3)',
    desc: 'Fluid, Material Design 3 inspired settings from end-4 dots. Beautifully expressive spatial popins.',
    beziers: [
      { name: 'md3_decel', value: [0.05, 0.7, 0.1, 1.0] },
      { name: 'expressiveFast', value: [0.42, 1.67, 0.21, 0.9] },
      { name: 'menu_decel', value: [0.1, 1.0, 0.0, 1.0] },
      { name: 'md3_accel', value: [0.3, 0.0, 0.8, 0.15] }
    ],
    animations: [
      { name: 'global', enabled: true, speed: 5.0, curve: 'md3_decel', style: '' },
      { name: 'border', enabled: true, speed: 4.0, curve: 'md3_decel', style: '' },
      { name: 'windows', enabled: true, speed: 3.5, curve: 'md3_decel', style: 'popin 60%' },
      { name: 'windowsIn', enabled: true, speed: 3.0, curve: 'expressiveFast', style: 'popin 80%' },
      { name: 'windowsOut', enabled: true, speed: 3.0, curve: 'md3_accel', style: 'popin 80%' },
      { name: 'fadeIn', enabled: true, speed: 2.5, curve: 'md3_decel', style: '' },
      { name: 'fadeOut', enabled: true, speed: 2.5, curve: 'md3_decel', style: '' },
      { name: 'fade', enabled: true, speed: 3.0, curve: 'md3_decel', style: '' },
      { name: 'workspaces', enabled: true, speed: 4.5, curve: 'menu_decel', style: 'slide' }
    ],
    layerRules: [
      { namespace: 'walker', enabled: true, style: 'popin 80%' },
      { namespace: 'waybar', enabled: true, style: 'slide' },
      { namespace: 'mako', enabled: true, style: 'popin 80%' }
    ]
  },
  {
    id: 'soft_elastic',
    name: 'Soft Elastic (Spring)',
    desc: 'Bouncy, rubber-band like elastic curves for a playful desktop character.',
    beziers: [
      { name: 'elasticOut', value: [0.34, 1.56, 0.64, 1.0] },
      { name: 'smooth', value: [0.25, 1.0, 0.5, 1.0] }
    ],
    animations: [
      { name: 'global', enabled: true, speed: 6.0, curve: 'smooth', style: '' },
      { name: 'border', enabled: true, speed: 5.0, curve: 'smooth', style: '' },
      { name: 'windows', enabled: true, speed: 5.5, curve: 'elasticOut', style: 'popin 75%' },
      { name: 'windowsIn', enabled: true, speed: 5.0, curve: 'elasticOut', style: 'popin 80%' },
      { name: 'windowsOut', enabled: true, speed: 3.0, curve: 'smooth', style: 'popin 80%' },
      { name: 'fadeIn', enabled: true, speed: 3.0, curve: 'smooth', style: '' },
      { name: 'fadeOut', enabled: true, speed: 3.0, curve: 'smooth', style: '' },
      { name: 'fade', enabled: true, speed: 4.0, curve: 'smooth', style: '' },
      { name: 'workspaces', enabled: true, speed: 6.0, curve: 'elasticOut', style: 'slide' }
    ],
    layerRules: [
      { namespace: 'walker', enabled: true, style: 'slide' },
      { namespace: 'waybar', enabled: true, style: 'slide' },
      { namespace: 'mako', enabled: true, style: 'slide' }
    ]
  },
  {
    id: 'snappy',
    name: 'Hyperspeed Snappy',
    desc: 'Vibrant and responsive. Bouncy overshot curves for a lively, tactile feel.',
    beziers: [
      { name: 'overshot', value: [0.05, 0.9, 0.1, 1.1] },
      { name: 'smooth', value: [0.25, 1, 0.5, 1] }
    ],
    animations: [
      { name: 'global', enabled: true, speed: 5, curve: 'default', style: '' },
      { name: 'border', enabled: true, speed: 3.0, curve: 'smooth', style: '' },
      { name: 'windows', enabled: true, speed: 3.5, curve: 'overshot', style: '' },
      { name: 'windowsIn', enabled: true, speed: 3.8, curve: 'overshot', style: 'popin 80%' },
      { name: 'windowsOut', enabled: true, speed: 2.0, curve: 'smooth', style: 'popin 85%' },
      { name: 'fadeIn', enabled: true, speed: 2.0, curve: 'smooth', style: '' },
      { name: 'fadeOut', enabled: true, speed: 2.0, curve: 'smooth', style: '' },
      { name: 'fade', enabled: true, speed: 3.0, curve: 'smooth', style: '' },
      { name: 'workspaces', enabled: true, speed: 4.0, curve: 'overshot', style: 'slide' }
    ],
    layerRules: [
      { namespace: 'walker', enabled: true, style: 'popin 80%' },
      { namespace: 'waybar', enabled: true, style: 'slide' },
      { namespace: 'mako', enabled: true, style: 'popin 80%' }
    ]
  },
  {
    id: 'cinematic',
    name: 'Cinematic Smooth',
    desc: 'Elongated, gentle ease-in-out curves for a luxury macOS-like desktop feel.',
    beziers: [
      { name: 'fluid', value: [0.25, 1, 0.2, 1] },
      { name: 'slowEase', value: [0.4, 0, 0.2, 1] }
    ],
    animations: [
      { name: 'global', enabled: true, speed: 12, curve: 'default', style: '' },
      { name: 'border', enabled: true, speed: 8.0, curve: 'fluid', style: '' },
      { name: 'windows', enabled: true, speed: 7.0, curve: 'fluid', style: '' },
      { name: 'windowsIn', enabled: true, speed: 7.5, curve: 'fluid', style: 'popin 85%' },
      { name: 'windowsOut', enabled: true, speed: 5.0, curve: 'slowEase', style: 'popin 80%' },
      { name: 'fadeIn', enabled: true, speed: 4.0, curve: 'fluid', style: '' },
      { name: 'fadeOut', enabled: true, speed: 4.0, curve: 'fluid', style: '' },
      { name: 'fade', enabled: true, speed: 6.0, curve: 'fluid', style: '' },
      { name: 'workspaces', enabled: true, speed: 8.0, curve: 'fluid', style: 'slide' }
    ],
    layerRules: [
      { namespace: 'walker', enabled: true, style: 'slide' },
      { namespace: 'waybar', enabled: true, style: 'slide' },
      { namespace: 'mako', enabled: true, style: 'slide' }
    ]
  },
  {
    id: 'instant',
    name: 'Instant Response',
    desc: 'Extremely fast transitions for maximum speed. Focuses on minimal transit times.',
    beziers: [
      { name: 'linear', value: [0, 0, 1, 1] }
    ],
    animations: [
      { name: 'global', enabled: true, speed: 1.5, curve: 'linear', style: '' },
      { name: 'border', enabled: true, speed: 1.0, curve: 'linear', style: '' },
      { name: 'windows', enabled: true, speed: 1.2, curve: 'linear', style: '' },
      { name: 'windowsIn', enabled: true, speed: 1.2, curve: 'linear', style: 'popin 95%' },
      { name: 'windowsOut', enabled: true, speed: 1.0, curve: 'linear', style: 'popin 95%' },
      { name: 'fadeIn', enabled: true, speed: 1.0, curve: 'linear', style: '' },
      { name: 'fadeOut', enabled: true, speed: 1.0, curve: 'linear', style: '' },
      { name: 'fade', enabled: true, speed: 1.0, curve: 'linear', style: '' },
      { name: 'workspaces', enabled: true, speed: 1.5, curve: 'linear', style: 'slide' }
    ],
    layerRules: [
      { namespace: 'walker', enabled: true, style: 'fade' },
      { namespace: 'waybar', enabled: false, style: 'fade' },
      { namespace: 'mako', enabled: true, style: 'fade' }
    ]
  }
];

// App State
let state = {
  enabled: true,
  beziers: [],
  animations: [],
  layerRules: [],
  selectedBezierIndex: 0
};

// Canvas Properties (300x300)
const canvas = document.getElementById('bezier-canvas');
const ctx = canvas.getContext('2d');
const padding = 60;
const graphSize = 180;

let draggingPoint = null; // 1 or 2 to indicate which handle is being dragged
let previewFrame = null;

// Coordinate mappings
function toCanvasX(x) {
  return padding + x * graphSize;
}

function toCanvasY(y) {
  // invert Y for canvas orientation
  return padding + (1.0 - y) * graphSize;
}

function toLogicalX(cx) {
  return Math.max(0, Math.min(1, (cx - padding) / graphSize));
}

function toLogicalY(cy) {
  // Allow values slightly outside 0-1 range for overshoot
  const val = 1.0 - (cy - padding) / graphSize;
  return Math.max(-0.5, Math.min(1.5, val));
}

// Draw Bezier Curves Grid & Handles
function drawBezierDesigner() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const activeBezier = state.beziers[state.selectedBezierIndex];
  if (!activeBezier) return;

  const [x1, y1, x2, y2] = activeBezier.value;

  // 1. Draw Grid Background
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  // Horizontal lines
  for (let i = 0; i <= 4; i++) {
    const yVal = i * 0.25;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), toCanvasY(yVal));
    ctx.lineTo(toCanvasX(1), toCanvasY(yVal));
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#5e6682';
    ctx.font = '10px sans-serif';
    ctx.fillText(yVal.toFixed(2), toCanvasX(0) - 35, toCanvasY(yVal) + 4);
  }
  // Vertical lines
  for (let i = 0; i <= 4; i++) {
    const xVal = i * 0.25;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(xVal), toCanvasY(-0.25));
    ctx.lineTo(toCanvasX(xVal), toCanvasY(1.25));
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#5e6682';
    ctx.font = '10px sans-serif';
    ctx.fillText(xVal.toFixed(2), toCanvasX(xVal) - 10, toCanvasY(0) + 18);
  }

  // 2. Draw bounds border (0 to 1 box)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(toCanvasX(0), toCanvasY(1), graphSize, graphSize);

  // 3. Draw Helper Coordinate Lines (P0 -> P1 and P3 -> P2)
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  // P0 to P1
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), toCanvasY(0));
  ctx.lineTo(toCanvasX(x1), toCanvasY(y1));
  ctx.stroke();
  // P3 to P2
  ctx.beginPath();
  ctx.moveTo(toCanvasX(1), toCanvasY(1));
  ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // 4. Draw the actual Cubic Bezier Curve
  ctx.strokeStyle = 'linear-gradient';
  const grad = ctx.createLinearGradient(toCanvasX(0), toCanvasY(0), toCanvasX(1), toCanvasY(1));
  grad.addColorStop(0, '#00f2fe');
  grad.addColorStop(1, '#9d4edd');
  
  ctx.strokeStyle = grad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), toCanvasY(0));
  ctx.bezierCurveTo(
    toCanvasX(x1), toCanvasY(y1),
    toCanvasX(x2), toCanvasY(y2),
    toCanvasX(1), toCanvasY(1)
  );
  ctx.stroke();

  // 5. Draw Handles (P1 & P2 circles)
  // Handle P1
  ctx.fillStyle = '#00f2fe';
  ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(toCanvasX(x1), toCanvasY(y1), 8, 0, 2 * Math.PI);
  ctx.fill();

  // Handle P2
  ctx.fillStyle = '#9d4edd';
  ctx.shadowColor = 'rgba(157, 78, 221, 0.5)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(toCanvasX(x2), toCanvasY(y2), 8, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.shadowBlur = 0; // Reset shadow

  // 6. Update HTML labels
  document.getElementById('p1-x-label').innerText = x1.toFixed(2);
  document.getElementById('p1-y-label').innerText = y1.toFixed(2);
  document.getElementById('p2-x-label').innerText = x2.toFixed(2);
  document.getElementById('p2-y-label').innerText = y2.toFixed(2);
  document.getElementById('bezier-formula-name').innerText = activeBezier.name;
  document.getElementById('bezier-formula-coords').innerText = `${x1.toFixed(2)}, ${y1.toFixed(2)}, ${x2.toFixed(2)}, ${y2.toFixed(2)}`;
}

function getCanvasPoint(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

function queueBezierPreview() {
  if (previewFrame) return;
  previewFrame = requestAnimationFrame(() => {
    previewFrame = null;
    drawBezierDesigner();
    updateConfigTextarea();
    updateSimulationTransitions();
  });
}

function startDragging(e) {
  const { x: mx, y: my } = getCanvasPoint(e.clientX, e.clientY);

  const activeBezier = state.beziers[state.selectedBezierIndex];
  if (!activeBezier) return;

  const [x1, y1, x2, y2] = activeBezier.value;

  // Check if click is near P1
  const distP1 = Math.hypot(mx - toCanvasX(x1), my - toCanvasY(y1));
  // Check if click is near P2
  const distP2 = Math.hypot(mx - toCanvasX(x2), my - toCanvasY(y2));

  if (distP1 < 15) {
    draggingPoint = 1;
  } else if (distP2 < 15) {
    draggingPoint = 2;
  }
}

function moveDragging(e) {
  if (!draggingPoint) return;

  const { x: mx, y: my } = getCanvasPoint(e.clientX, e.clientY);

  const activeBezier = state.beziers[state.selectedBezierIndex];
  if (!activeBezier) return;

  const lx = toLogicalX(mx);
  const ly = toLogicalY(my);

  if (draggingPoint === 1) {
    activeBezier.value[0] = parseFloat(lx.toFixed(2));
    activeBezier.value[1] = parseFloat(ly.toFixed(2));
  } else if (draggingPoint === 2) {
    activeBezier.value[2] = parseFloat(lx.toFixed(2));
    activeBezier.value[3] = parseFloat(ly.toFixed(2));
  }

  queueBezierPreview();
}

function stopDragging() {
  draggingPoint = null;
}

canvas.addEventListener('pointerdown', (e) => {
  startDragging(e);
  if (draggingPoint) canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', moveDragging);
canvas.addEventListener('pointerup', stopDragging);
canvas.addEventListener('pointercancel', stopDragging);


// Load active config from server APIs
async function fetchConfig() {
  try {
    const response = await fetch('/api/config');
    const data = await response.json();
    if (data.success) {
      state.enabled = data.config.enabled;
      state.beziers = data.config.beziers;
      state.animations = data.config.animations;
      state.layerRules = data.config.layerRules || [];
      
      // Ensure we have some default beziers if none found
      if (state.beziers.length === 0) {
        state.beziers = [...PRESETS[0].beziers];
      }
      
      // Select the first bezier initially
      state.selectedBezierIndex = 0;
      
      // Update checkmark in HTML toggle
      document.getElementById('animations-enabled-checkbox').checked = state.enabled;

      // Populate interface
      renderPresets();
      renderBeziers();
      renderRulesTable();
      renderLayerRulesTable();
      drawBezierDesigner();
      updateConfigTextarea();
      updateSimulationTransitions();
      
      showToast('Loaded configuration successfully.');
    } else {
      showToast('Error loading configuration: ' + data.error, true);
    }
  } catch (err) {
    showToast('Failed to connect to backend configuration daemon.', true);
    document.getElementById('connection-status').className = 'status-badge disconnected';
    document.getElementById('connection-status').innerText = 'Offline';
    
    // Fall back to Omarchy defaults so the app remains interactive!
    loadPreset(PRESETS[0]);
  }
}

// Render the Presets List
function renderPresets() {
  const container = document.getElementById('presets-container');
  container.innerHTML = '';

  PRESETS.forEach(preset => {
    const card = document.createElement('div');
    card.className = 'preset-card';
    card.innerHTML = `
      <div class="preset-name">${preset.name}</div>
      <div class="preset-desc">${preset.desc}</div>
    `;
    card.addEventListener('click', () => {
      // Toggle visual active
      document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      loadPreset(preset);
    });
    container.appendChild(card);
  });
}

// Load a preset profile
function loadPreset(preset) {
  state.enabled = true;
  state.beziers = JSON.parse(JSON.stringify(preset.beziers));
  state.animations = JSON.parse(JSON.stringify(preset.animations));
  state.layerRules = JSON.parse(JSON.stringify(preset.layerRules || []));
  state.selectedBezierIndex = 0;

  document.getElementById('animations-enabled-checkbox').checked = state.enabled;

  renderBeziers();
  renderRulesTable();
  renderLayerRulesTable();
  drawBezierDesigner();
  updateConfigTextarea();
  updateSimulationTransitions();
  showToast(`Loaded "${preset.name}" preset details.`);
}

// Render Beziers list in sidebar
function renderBeziers() {
  const container = document.getElementById('beziers-container');
  container.innerHTML = '';

  state.beziers.forEach((b, index) => {
    const item = document.createElement('div');
    item.className = `bezier-item ${index === state.selectedBezierIndex ? 'selected' : ''}`;
    item.innerHTML = `
      <span class="bezier-item-name">${b.name}</span>
      <span>[${b.value.join(', ')}]</span>
      <button class="delete-bezier-btn" data-index="${index}">&times;</button>
    `;

    // Click to select
    item.addEventListener('click', (e) => {
      if (e.target.className === 'delete-bezier-btn') return;
      state.selectedBezierIndex = index;
      document.querySelectorAll('.bezier-item').forEach(c => c.classList.remove('selected'));
      item.classList.add('selected');
      
      // Update inputs
      document.getElementById('bezier-name-input').value = b.name;
      drawBezierDesigner();
    });

    // Delete handler
    item.querySelector('.delete-bezier-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.beziers.length <= 1) {
        showToast('You must keep at least one bezier curve curve.', true);
        return;
      }
      const idx = parseInt(e.target.getAttribute('data-index'));
      state.beziers.splice(idx, 1);
      if (state.selectedBezierIndex >= state.beziers.length) {
        state.selectedBezierIndex = state.beziers.length - 1;
      }
      renderBeziers();
      renderRulesTable(); // Re-populate dropdown menus
      drawBezierDesigner();
      updateConfigTextarea();
    });

    container.appendChild(item);
  });
}

// Add Custom Bezier Curve
document.getElementById('btn-add-bezier').addEventListener('click', () => {
  const uniqueId = state.beziers.length + 1;
  const newCurve = {
    name: `curve_${uniqueId}`,
    value: [0.25, 0.75, 0.5, 1.0]
  };
  state.beziers.push(newCurve);
  state.selectedBezierIndex = state.beziers.length - 1;
  
  renderBeziers();
  renderRulesTable();
  drawBezierDesigner();
  updateConfigTextarea();
  
  document.getElementById('bezier-name-input').value = newCurve.name;
  showToast(`Added new curve: ${newCurve.name}`);
});

// Update curve details when clicking "Update Curve Coordinate"
document.getElementById('btn-save-curve').addEventListener('click', () => {
  const activeBezier = state.beziers[state.selectedBezierIndex];
  if (!activeBezier) return;

  const rawName = document.getElementById('bezier-name-input').value.trim();
  const cleanName = rawName.replace(/[^a-zA-Z0-9_]/g, ''); // enforce alphanumerics for Hyprland stability
  
  if (!cleanName) {
    showToast('Bezier name cannot be blank and must contain only alphanumeric letters.', true);
    return;
  }

  // Rename across rules if renaming
  const oldName = activeBezier.name;
  activeBezier.name = cleanName;
  state.animations.forEach(r => {
    if (r.curve === oldName) {
      r.curve = cleanName;
    }
  });

  renderBeziers();
  renderRulesTable();
  drawBezierDesigner();
  updateConfigTextarea();
  showToast('Curve parameters saved.');
});

// Render the Rules Table
function renderRulesTable() {
  const tbody = document.getElementById('rules-tbody');
  tbody.innerHTML = '';

  state.animations.forEach((r, idx) => {
    const row = document.createElement('tr');
    
    // Create bezier curve selector
    let curveOptions = `<option value="default" ${r.curve === 'default' ? 'selected' : ''}>default</option>`;
    state.beziers.forEach(b => {
      curveOptions += `<option value="${b.name}" ${r.curve === b.name ? 'selected' : ''}>${b.name}</option>`;
    });

    row.innerHTML = `
      <td data-label="Target">
        <span class="rule-name">${r.name}</span>
        <span class="rule-desc-sub">${getRuleDescription(r.name)}</span>
      </td>
      <td data-label="Active">
        <label class="switch">
          <input type="checkbox" class="rule-enabled" data-idx="${idx}" ${r.enabled ? 'checked' : ''}>
          <span class="slider round"></span>
        </label>
      </td>
      <td data-label="Duration">
        <div class="speed-slider-wrapper">
          <input type="range" class="rule-speed" data-idx="${idx}" min="0.5" max="15" step="0.1" value="${r.speed}">
          <span class="speed-val-label" id="speed-lbl-${idx}">${r.speed.toFixed(1)}</span>
        </div>
      </td>
      <td data-label="Curve">
        <select class="table-select rule-curve" data-idx="${idx}">
          ${curveOptions}
        </select>
      </td>
      <td data-label="Style modifier">
        <input type="text" class="table-input rule-style" data-idx="${idx}" value="${r.style || ''}" placeholder="e.g. popin 80%">
      </td>
    `;

    // Hook listeners
    row.querySelector('.rule-enabled').addEventListener('change', (e) => {
      r.enabled = e.target.checked;
      updateConfigTextarea();
      updateSimulationTransitions();
    });

    row.querySelector('.rule-speed').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      r.speed = val;
      document.getElementById(`speed-lbl-${idx}`).innerText = val.toFixed(1);
      updateConfigTextarea();
      updateSimulationTransitions();
    });

    row.querySelector('.rule-curve').addEventListener('change', (e) => {
      r.curve = e.target.value;
      updateConfigTextarea();
      updateSimulationTransitions();
    });

    row.querySelector('.rule-style').addEventListener('input', (e) => {
      r.style = e.target.value.trim();
      updateConfigTextarea();
      updateSimulationTransitions();
    });

    tbody.appendChild(row);
  });
}

// Render Layer Rules Table
function renderLayerRulesTable() {
  const tbody = document.getElementById('layer-rules-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.layerRules.forEach((l, idx) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td data-label="Layer component">
        <span class="rule-name">${l.namespace}</span>
        <span class="rule-desc-sub">${getLayerDescription(l.namespace)}</span>
      </td>
      <td data-label="Animations active">
        <label class="switch">
          <input type="checkbox" class="layer-enabled" data-idx="${idx}" ${l.enabled ? 'checked' : ''}>
          <span class="slider round"></span>
        </label>
      </td>
      <td data-label="Transition style">
        <select class="table-select layer-style" data-idx="${idx}">
          <option value="slide" ${l.style === 'slide' ? 'selected' : ''}>slide</option>
          <option value="slidevert" ${l.style === 'slidevert' ? 'selected' : ''}>slidevert</option>
          <option value="popin 80%" ${l.style === 'popin 80%' ? 'selected' : ''}>popin 80%</option>
          <option value="fade" ${l.style === 'fade' ? 'selected' : ''}>fade</option>
        </select>
      </td>
    `;

    // Hook listeners
    row.querySelector('.layer-enabled').addEventListener('change', (e) => {
      l.enabled = e.target.checked;
      updateConfigTextarea();
    });

    row.querySelector('.layer-style').addEventListener('change', (e) => {
      l.style = e.target.value;
      updateConfigTextarea();
    });

    tbody.appendChild(row);
  });
}

function getLayerDescription(namespace) {
  const descs = {
    'walker': 'Application menu launcher, emoji picker, clipboard viewer',
    'waybar': 'Top status bar loading and toggling animation style',
    'mako': 'System notification popup entries and exits'
  };
  return descs[namespace] || 'System GUI layer surface';
}

function getRuleDescription(name) {
  const descs = {
    'global': 'Fallback settings for all categories',
    'border': 'Fade transitions on active/inactive borders',
    'windows': 'Global window open, close, and movements',
    'windowsIn': 'Opening style (e.g. popin / slide)',
    'windowsOut': 'Closing style (e.g. popin / slide)',
    'fadeIn': 'Opacity fade when window opens',
    'fadeOut': 'Opacity fade when window closes',
    'fade': 'Tooltip and popup fading durations',
    'workspaces': 'Transition between desktop workspaces',
  };
  return descs[name] || 'Custom animation trigger';
}

// Global Enable Checkbox
document.getElementById('animations-enabled-checkbox').addEventListener('change', (e) => {
  state.enabled = e.target.checked;
  updateConfigTextarea();
  updateSimulationTransitions();
});

// Update the code blocks textarea showing raw Hyprland config
function updateConfigTextarea() {
  const codeBox = document.getElementById('config-code-text');
  
  let codeStr = `# Auto-generated by Hyprland Animation Configurator GUI\n`;
  codeStr += `animations {\n`;
  codeStr += `    enabled = ${state.enabled ? 'yes' : 'no'}\n\n`;
  
  codeStr += `    # Bezier Curves\n`;
  state.beziers.forEach(b => {
    codeStr += `    bezier = ${b.name}, ${b.value.join(', ')}\n`;
  });
  
  codeStr += `\n    # Animation Rules\n`;
  state.animations.forEach(r => {
    const stylePart = r.style ? `, ${r.style}` : '';
    codeStr += `    animation = ${r.name}, ${r.enabled ? '1' : '0'}, ${r.speed.toFixed(2)}, ${r.curve}${stylePart}\n`;
  });
  
  codeStr += `}\n`;

  if (state.layerRules && state.layerRules.length > 0) {
    codeStr += `\n# Layer Surface Animations\n`;
    state.layerRules.forEach(l => {
      if (l.enabled) {
        codeStr += `layerrule = no_anim off, match:namespace ${l.namespace}\n`;
        if (l.style) {
          codeStr += `layerrule = animation ${l.style}, match:namespace ${l.namespace}\n`;
        }
      } else {
        codeStr += `layerrule = no_anim on, match:namespace ${l.namespace}\n`;
      }
    });
  }
  
  codeBox.textContent = codeStr;
}


// Interactive Sandbox Simulation Easing Application
function getTransitionDurationAndCurve(targetName) {
  // Find matching rule
  let rule = state.animations.find(r => r.name === targetName);
  
  // Fallback to 'global' if rule disabled or missing
  if (!rule || !rule.enabled) {
    rule = state.animations.find(r => r.name === 'global');
  }

  if (!state.enabled || !rule || !rule.enabled) {
    return { durationSeconds: 0, cssBezier: 'linear' };
  }

  // Convert deciseconds (ds) to seconds
  const durationSeconds = rule.speed / 10;

  // Find curve coordinates
  let cssBezier = 'cubic-bezier(0.25, 1, 0.5, 1)'; // default browser easeOut
  if (rule.curve !== 'default') {
    const b = state.beziers.find(c => c.name === rule.curve);
    if (b) {
      // Clamp coordinates to valid CSS cubic-bezier bounds:
      // X coordinates must be [0, 1]. Y coordinates can overshoot.
      const x1 = Math.max(0, Math.min(1, b.value[0]));
      const y1 = b.value[1];
      const x2 = Math.max(0, Math.min(1, b.value[2]));
      const y2 = b.value[3];
      cssBezier = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
    }
  }

  return { durationSeconds, cssBezier };
}

function updateSimulationTransitions() {
  const win = document.getElementById('win-1');
  const win2 = document.getElementById('win-2');
  const workspaceSlider = document.getElementById('workspace-container');

  // 1. Get window properties
  const winAnim = getTransitionDurationAndCurve('windows');
  const windowTransition = `transform ${winAnim.durationSeconds}s ${winAnim.cssBezier}, opacity ${winAnim.durationSeconds}s ${winAnim.cssBezier}`;
  
  win.style.transition = windowTransition;
  if (win2) win2.style.transition = windowTransition;

  // 2. Get workspace properties
  const wsAnim = getTransitionDurationAndCurve('workspaces');
  workspaceSlider.style.transition = `transform ${wsAnim.durationSeconds}s ${wsAnim.cssBezier}`;
}

// Sandbox Interactive Actions
let winOpen = true;
document.getElementById('btn-sim-window').addEventListener('click', () => {
  const win = document.getElementById('win-1');
  const win2 = document.getElementById('win-2');
  
  winOpen = !winOpen;
  
  if (winOpen) {
    win.classList.remove('win-closed');
    if (win2) {
      // stagger opening
      setTimeout(() => win2.classList.remove('win-closed'), 80);
    }
  } else {
    win.classList.add('win-closed');
    if (win2) win2.classList.add('win-closed');
  }
});

let currentWorkspace = 1;
document.getElementById('btn-sim-workspace').addEventListener('click', () => {
  const slider = document.getElementById('workspace-container');
  currentWorkspace = currentWorkspace === 1 ? 2 : 1;
  
  if (currentWorkspace === 1) {
    slider.style.transform = 'translateX(0)';
  } else {
    slider.style.transform = 'translateX(-50%)';
  }
});

document.getElementById('btn-sim-border').addEventListener('click', () => {
  const win = document.getElementById('win-1');
  const borderAnim = getTransitionDurationAndCurve('border');

  win.style.transition = `border-color ${borderAnim.durationSeconds}s ${borderAnim.cssBezier}, box-shadow ${borderAnim.durationSeconds}s ${borderAnim.cssBezier}`;
  win.classList.add('win-border-active');

  setTimeout(() => {
    win.classList.remove('win-border-active');
  }, 1000);
});


// Save Config & API Dispatcher
document.getElementById('btn-apply-config').addEventListener('click', async () => {
  const btn = document.getElementById('btn-apply-config');
  btn.disabled = true;
  btn.innerText = 'Applying Config...';

  try {
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    });
    
    const result = await response.json();
    if (result.success) {
      if (result.errors) {
        showToast(`Applied with warnings:\n${result.errors}`, true);
      } else {
        showToast('Successfully applied animations to Hyprland!');
      }
    } else {
      showToast('Error applying config: ' + result.error, true);
    }
  } catch (err) {
    showToast('Failed to transmit configuration details to the local server daemon.', true);
  } finally {
    btn.disabled = false;
    btn.innerText = 'Save & Apply Config';
  }
});

// Revert to default configs
document.getElementById('btn-revert').addEventListener('click', async () => {
  if (confirm('Are you sure you want to revert to system default animations? This will reset all customs.')) {
    loadPreset(PRESETS[0]);
  }
});

// Toast Manager
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  
  msgEl.innerText = message;
  toast.className = isError ? 'toast-success toast-error' : 'toast-success';
  
  // Remove toast-hidden
  toast.classList.remove('toast-hidden');
  
  // Auto-hide
  setTimeout(() => {
    toast.classList.add('toast-hidden');
  }, 4000);
}

// Initial triggers
window.addEventListener('load', () => {
  fetchConfig();
});
