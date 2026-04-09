const soundOnSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const soundOffSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
var gameSoundMuted = false; // starts unmuted — sound is on by default

const _wooshAudio = new Audio('Woosh Sound.mp3');
_wooshAudio.volume = 0.35;
_wooshAudio.preload = 'auto';
function playWoosh() {
  if (gameSoundMuted) return;
  try {
    _wooshAudio.currentTime = 0;
    _wooshAudio.play();
  } catch(e) {}
}

// D pentatonic scale tables — three moods
const _scaleRates = {
  // M = D major pentatonic (bright, warm, home)
  M: { owl: 1.0000, dog: 1.1250, deer: 1.2500, fox: 1.5000, cat: 1.6667, crane: 2.0000 },
  // L = D minor pentatonic (dark, melancholy, introspective)
  // Dog E→F, Deer F#→G, Cat B→C — Owl/Fox/Crane stay anchored (root, fifth, octave)
  L: { owl: 1.0000, dog: 1.2000, deer: 1.3333, fox: 1.5000, cat: 1.7778, crane: 2.0000 },
  // H = D major pentatonic, fifth register (bright, airy, sparkle)
  // All rates × 3/2 — max 3.0 (still bell-like, not clicky)
  H: { owl: 1.5000, dog: 1.6875, deer: 1.8750, fox: 2.2500, cat: 2.5000, crane: 3.0000 },
};
let _currentScale = 'M';

// NPC walkable area brush — painted zones animals must stay inside
let _walkablePaintMode = false;
let _walkablePainting = false;
let _walkableBrushSize = 28;
let _walkablePaintColor = 'green'; // 'green' = walkable | 'red' = occlusion (hide animal)
let _walkableBrushData = (function() {
  try { return JSON.parse(localStorage.getItem('clayVillageWalkable') || '[]'); } catch(e) { return []; }
})();
let _occlusionBrushData = (function() {
  try { return JSON.parse(localStorage.getItem('clayVillageOcclusion') || '[]'); } catch(e) { return []; }
})();
function _isInWalkablePaint(x, y) {
  for (let i = 0; i < _walkableBrushData.length; i++) {
    const b = _walkableBrushData[i];
    const dx = x - b.x, dy = y - b.y;
    if (dx*dx + dy*dy <= b.r*b.r) return true;
  }
  return false;
}
function _nearestWalkablePoint(x, y) {
  let best = null, bestDist = Infinity;
  for (let i = 0; i < _walkableBrushData.length; i++) {
    const b = _walkableBrushData[i];
    const d = Math.hypot(x - b.x, y - b.y);
    if (d < bestDist) { bestDist = d; best = b; }
  }
  return best ? { x: best.x, y: best.y } : { x, y };
}
// Green = ground layer (walkable, feet level) — checked by _isInWalkablePaint
// Red  = above layer (occlusion, canopy/roof) — checked here for visual fade
// Both can overlap: animal walks on green, fades under red
function _getOcclusionAlpha(x, y) {
  if (_occlusionBrushData.length === 0) return 1;
  let bestT = 0; // best normalised depth (0 = edge, 1 = centre)
  for (let i = 0; i < _occlusionBrushData.length; i++) {
    const b = _occlusionBrushData[i];
    const dx = x - b.x, dy = y - b.y;
    const distSq = dx * dx + dy * dy;
    if (distSq < b.r * b.r) {
      const t = 1 - Math.sqrt(distSq) / b.r;
      if (t > bestT) bestT = t;
    }
  }
  if (bestT <= 0) return 1;
  // Fade quickly: fully hidden at 40% depth into any circle
  return Math.max(0, 1 - Math.min(1, bestT * 2.5));
}
let _bellBuffer = null;
(function preloadBell() {
  fetch('bell.mp3').then(r => r.arrayBuffer()).then(buf => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.decodeAudioData(buf, decoded => { _bellBuffer = decoded; ctx.close(); });
  }).catch(() => {});
})();
const _bellSources = {}; // npcId → { source, gain, ctx }
function playNpcBell(npcId, gainVal) {
  if (gameSoundMuted || !_bellBuffer) return;
  if (_bellSources[npcId]) return; // already playing
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = _bellBuffer;
    source.playbackRate.value = (_scaleRates[_currentScale] || _scaleRates.M)[npcId] || 1.0;
    gain.gain.value = (gainVal !== undefined) ? gainVal : 0.3;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);
    source.onended = () => { try { ctx.close(); } catch(e) {} delete _bellSources[npcId]; };
    _bellSources[npcId] = { source, gain, ctx };
  } catch(e) {}
}
function stopNpcBell(npcId) {
  const s = _bellSources[npcId];
  if (!s) return;
  delete _bellSources[npcId];
  try {
    s.gain.gain.setValueAtTime(s.gain.gain.value, s.ctx.currentTime);
    s.gain.gain.linearRampToValueAtTime(0, s.ctx.currentTime + 2);
    s.source.stop(s.ctx.currentTime + 2);
  } catch(e) {}
}

function updateAmbientSound() {
  const forest = document.getElementById('forest-audio');
  const night  = document.getElementById('night-audio');
  if (!forest || !night) return;
  if (gameSoundMuted) {
    forest.pause();
    night.pause();
    return;
  }
  const t = (manualNightLevel || 0) / 100; // 0 = full day, 1 = full night
  const forestVol = (1 - t) * 0.5;
  const nightVol  = t * 0.25;
  forest.volume = forestVol;
  night.volume  = nightVol;
  if (forestVol > 0.01) { if (forest.paused) forest.play().catch(function(e) { console.warn('[forest]', e.message); }); }
  else forest.pause();
  if (nightVol > 0.01)  { if (night.paused) { night.currentTime = 0; night.play().catch(function(e) { console.warn('[night]', e.message); }); } }
  else night.pause();
}
</script>

<div id="top-controls" style="display:none;">
  <button id="tour-btn" title="Village Tour"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></button>
  <div id="night-slider-wrap">
    <span class="ns-icon" id="ns-sun-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></span>
    <input type="range" id="night-slider" min="0" max="100" value="0" title="Day / Night">
    <span class="ns-icon" id="ns-moon-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>
  </div>
  <button id="sound-toggle" title="Sound" onclick="toggleVillageSound()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></button>
  <button id="rehearsal-btn" title="Choir">Choir</button>
  <button id="my-studio-btn" title="My Studio" onclick="if(typeof openStudioQuarter==='function')openStudioQuarter();">My Studio</button>
  <button id="map-pan-btn" title="Drag map to pan"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M6 14a4 4 0 0 0 .44 1.82l1.68 3.36A4 4 0 0 0 11.69 21h4a4 4 0 0 0 4-4v-5a2 2 0 0 0-2-2h-2"/></svg></button>
</div>

<!-- Walkable Area Paint Panel -->
<div id="walkable-paint-panel" style="display:none; position:fixed; top:88px; left:10px; background:rgba(14,11,7,0.9); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); color:rgba(234,229,222,0.95); border:1px solid rgba(255,255,255,0.14); border-radius:12px; padding:12px 14px; z-index:200; font-size:12px; min-width:155px; font-family:inherit;">
  <div style="font-weight:600; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(234,229,222,0.7); margin-bottom:8px;">Paint Areas</div>
  <div style="display:flex; gap:5px; margin-bottom:10px;">
    <button id="wb-color-green" style="flex:1; background:rgba(100,220,130,0.2); border:1px solid rgba(100,220,130,0.55); color:rgba(100,220,130,1); border-radius:6px; padding:5px 0; font-size:11px; cursor:pointer; font-family:inherit; font-weight:600;">● Walk</button>
    <button id="wb-color-red" style="flex:1; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); color:rgba(234,229,222,0.6); border-radius:6px; padding:5px 0; font-size:11px; cursor:pointer; font-family:inherit; font-weight:600;">● Hide</button>
  </div>
  <div id="walkable-stroke-count" style="font-size:11px; color:rgba(234,229,222,0.5); margin-bottom:8px;">0 green · 0 red</div>
  <div style="font-size:10px; color:rgba(234,229,222,0.45); margin-bottom:6px;">Brush size</div>
  <div style="display:flex; gap:5px; margin-bottom:10px;">
    <button class="wb-size-btn" data-r="15" style="flex:1; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15); color:rgba(234,229,222,0.85); border-radius:6px; padding:4px 0; font-size:11px; cursor:pointer; font-family:inherit;">S</button>
    <button class="wb-size-btn active" data-r="28" style="flex:1; background:rgba(100,220,130,0.15); border:1px solid rgba(100,220,130,0.4); color:rgba(100,220,130,0.95); border-radius:6px; padding:4px 0; font-size:11px; cursor:pointer; font-family:inherit;">M</button>
    <button class="wb-size-btn" data-r="50" style="flex:1; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15); color:rgba(234,229,222,0.85); border-radius:6px; padding:4px 0; font-size:11px; cursor:pointer; font-family:inherit;">L</button>
  </div>
  <div id="wb-hint" style="font-size:10px; color:rgba(234,229,222,0.4); line-height:1.6; margin-bottom:10px;">Drag on roads &amp; open areas.</div>
  <div style="display:flex; gap:6px;">
    <button id="walkable-clear-btn" style="flex:1; background:rgba(255,80,80,0.1); border:1px solid rgba(255,80,80,0.25); color:rgba(255,150,150,0.85); border-radius:6px; padding:5px 0; font-size:10px; cursor:pointer; font-family:inherit;">Clear All</button>
    <button id="walkable-done-btn" style="flex:1; background:rgba(100,220,130,0.12); border:1px solid rgba(100,220,130,0.32); color:rgba(100,220,130,0.9); border-radius:6px; padding:5px 0; font-size:10px; cursor:pointer; font-family:inherit;">Done</button>
  </div>
</div>

<!-- Bonfire drone invisible click zone — anchored in world space via updateCamera -->
<div id="bonfire-drone-zone" title="Bonfire drone"></div>

<!-- Choir pitch buttons — floating above choir in world space -->
<script>
// Animal pitch buttons — L / M / H (scale shift)
(function() {
  const btns = document.querySelectorAll('.pitch-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _currentScale = btn.dataset.scale;
    });
  });
})();


// Rehearsal choir mode
let _choirMode = false;
// Choir positions: 4 on bottom row, 2 on top — left of bonfire
// Bonfire world ~(717, 376). Choir centered ~x=520, base y=460
// Choir formation — vertical ellipse in isometric space:
//   Owl (back-left) and Crane (front-right) are diagonally opposite.
//   Animals arranged in an ellipse around the bonfire (~717, 380).
//   Clock positions: Owl front-center (6), Dog front-right (4-5), Fox right (2-3),
//   Crane crown (12), Cat left (9-10), Deer front-left (7-8).
const _CHOIR_POSITIONS = [
  { id: 'owl',   x: 717, y: 468 }, // front-center (6 o'clock) — root
  { id: 'dog',   x: 840, y: 424 }, // front-right  (4–5 o'clock)
  { id: 'fox',   x: 848, y: 336 }, // right        (2–3 o'clock) — fifth
  { id: 'crane', x: 717, y: 292 }, // back/crown   (12 o'clock)  — octave
  { id: 'cat',   x: 586, y: 336 }, // left         (9–10 o'clock)
  { id: 'deer',  x: 594, y: 424 }, // front-left   (7–8 o'clock)
];
// Pitch label anchored above the crown (Crane)
const _CHOIR_LABEL_X = 717;
const _CHOIR_LABEL_Y = 266;

function startChoir() {
  if (_autoChoirTimer) { clearTimeout(_autoChoirTimer); _autoChoirTimer = null; }
  _choirMode = true;
  document.getElementById('rehearsal-btn').classList.add('active');
  if (typeof npcs === 'undefined') return;
  npcs.forEach(npc => {
    const pos = _CHOIR_POSITIONS.find(p => p.id === npc.id);
    if (!pos) return;
    npc._choirTarget = { x: pos.x, y: pos.y };
    npc._choirWalkSpeed = 0; // instant lerp for manual
    npc._origWanderRadius = npc.wanderRadius;
    npc._origSpeed = npc.speed;
    npc.wanderRadius = 0;
    npc.burstTimer = 0; npc.dirX = 0; npc.dirY = 0;
  });
}
function endChoir() {
  _choirMode = false;
  document.getElementById('rehearsal-btn').classList.remove('active');
  if (typeof npcs === 'undefined') return;
  npcs.forEach(npc => {
    npc._choirTarget = null;
    npc._choirWalkSpeed = 0;
    npc.wanderRadius = 9999;
    npc.speed = npc._origSpeed || ({ fox: 0.9, owl: 0.2, crane: 0.35, cat: 0.3, deer: 0.5, dog: 0.8 })[npc.id] || 0.55;
  });
  // Restart auto-choir timer
  _autoChoirTimer = setTimeout(_startAutoChoir, _autoChoirIntervalMin * 60 * 1000);
}
document.getElementById('rehearsal-btn').addEventListener('click', () => {
  if (_autoChoirPhase !== 'idle') { _cancelAutoChoir(); return; }
  if (_choirMode) endChoir(); else startChoir();
});

// ─── Automated Choir Performance ───
let _autoChoirIntervalMin = 60; // default 60 minutes — editable via dev panel
let _autoChoirPhase = 'idle'; // 'idle' | 'gathering' | 'performing' | 'dispersing'
let _autoChoirTimer = null;
let _autoChoirTimeouts = [];

// D major pentatonic only — Owl=D  Dog=E  Deer=F#  Fox=A  Cat=B  Crane=D'
// Notation: ... = long rest (~3.5s)  . = short rest (~2s)
// Owl opens. Crane closes. Root starts, octave ends. Every time.
// gain key: 0.28=quiet entry  0.30=normal  0.40=↑  0.50=↑↑  0.62=↑↑↑  0.20=↓  0.13=↓↓  0.08=↓↓↓
const _CHOIR_SONGS = [

  // ─── Song 1: "The Fire" ──────────────────────────────────────────────────
  // V / PC / C / V2 / C / Bridge / FC
  { name: 'The Fire', duration: 136, notes: [
    // — VERSE — quiet entry, Owl grounds the village —
    { t: 0,    id: 'owl',   g: 0.28 },
    { t: 6,    id: 'owl',   g: 0.28 },
    { t: 12,   id: 'dog',   g: 0.28 },
    { t: 16,   id: 'owl',   g: 0.28 },
    // — PRE-CHORUS — building energy —
    { t: 20,   id: 'dog',   g: 0.30 },
    { t: 22.5, id: 'dog',   g: 0.30 },
    { t: 25,   id: 'deer',  g: 0.30 },
    { t: 27.5, id: 'deer',  g: 0.32 },
    { t: 30,   id: 'fox',   g: 0.40 }, // ↑ tension rising
    // — CHORUS — peak pairs, big space between hits —
    { t: 35,   id: 'owl',   g: 0.62 }, { t: 35,   id: 'crane', g: 0.62 }, // ↑↑↑
    { t: 39.5, id: 'fox',   g: 0.50 },                                     // ↑↑
    { t: 44,   id: 'owl',   g: 0.62 }, { t: 44,   id: 'crane', g: 0.62 }, // ↑↑↑
    { t: 48.5, id: 'cat',   g: 0.40 },                                     // ↑
    // — VERSE 2 — returns to quiet; double silence makes the wait felt —
    { t: 53,   id: 'owl',   g: 0.28 },
    { t: 60,   id: 'dog',   g: 0.28 }, // ... ... (double silence)
    { t: 64.5, id: 'owl',   g: 0.28 },
    { t: 68.5, id: 'owl',   g: 0.28 },
    // — CHORUS (repeat) —
    { t: 73,   id: 'owl',   g: 0.62 }, { t: 73,   id: 'crane', g: 0.62 },
    { t: 77.5, id: 'fox',   g: 0.50 },
    { t: 82,   id: 'owl',   g: 0.62 }, { t: 82,   id: 'crane', g: 0.62 },
    { t: 86.5, id: 'cat',   g: 0.40 },
    // — BRIDGE — Crane and Cat alternate, Crane grows louder each time —
    { t: 91,   id: 'crane', g: 0.50 }, // ↑↑
    { t: 95,   id: 'cat',   g: 0.40 }, // ↑
    { t: 99,   id: 'crane', g: 0.62 }, // ↑↑↑
    { t: 103,  id: 'cat',   g: 0.40 }, // ↑
    { t: 107,  id: 'crane', g: 0.62 }, // ↑↑↑ held long
    // — FINAL CHORUS — three paired peaks, then Owl alone settles to silence —
    { t: 113,  id: 'owl',   g: 0.62 }, { t: 113,  id: 'crane', g: 0.62 }, // ↑↑↑
    { t: 118,  id: 'fox',   g: 0.62 }, { t: 118,  id: 'crane', g: 0.62 }, // ↑↑↑
    { t: 123,  id: 'owl',   g: 0.62 }, { t: 123,  id: 'crane', g: 0.62 }, // ↑↑↑
    { t: 128,  id: 'owl',   g: 0.18 }, // ↓ quiet resolution
  ]},

  // ─── Song 2: "Arrival" ───────────────────────────────────────────────────
  // V / PC / C / V2 / C / Bridge / FC
  { name: 'Arrival', duration: 140, notes: [
    // — VERSE — Crane opens from above, Cat answers —
    { t: 0,    id: 'crane', g: 0.28 },
    { t: 7,    id: 'crane', g: 0.28 }, // ... ... (double silence)
    { t: 12,   id: 'cat',   g: 0.28 },
    // — PRE-CHORUS — Cat leads in, Fox responds, louder each time; Deer bridges —
    { t: 18,   id: 'cat',   g: 0.30 },
    { t: 20.5, id: 'fox',   g: 0.40 }, // ↑
    { t: 25,   id: 'cat',   g: 0.30 },
    { t: 27.5, id: 'fox',   g: 0.50 }, // ↑↑
    { t: 32,   id: 'deer',  g: 0.30 },
    { t: 34.5, id: 'fox',   g: 0.62 }, // ↑↑↑ peak
    // — CHORUS — Fox+Crane dominate; Dog bounces; Owl resolves quietly —
    { t: 39,   id: 'fox',   g: 0.62 }, { t: 39,   id: 'crane', g: 0.62 }, // ↑↑↑
    { t: 43.5, id: 'dog',   g: 0.40 },                                     // ↑
    { t: 48,   id: 'fox',   g: 0.62 }, { t: 48,   id: 'crane', g: 0.62 }, // ↑↑↑
    { t: 52.5, id: 'owl',   g: 0.20 },                                     // ↓ resolution
    // — VERSE 2 — Crane anchors, Cat weaves in —
    { t: 57,   id: 'crane', g: 0.28 },
    { t: 62,   id: 'cat',   g: 0.28 },
    { t: 66.5, id: 'crane', g: 0.28 },
    { t: 73,   id: 'crane', g: 0.28 }, // ... ... (double silence)
    // — CHORUS (repeat) —
    { t: 77,   id: 'fox',   g: 0.62 }, { t: 77,   id: 'crane', g: 0.62 },
    { t: 81.5, id: 'dog',   g: 0.40 },
    { t: 86,   id: 'fox',   g: 0.62 }, { t: 86,   id: 'crane', g: 0.62 },
    { t: 90.5, id: 'owl',   g: 0.20 },
    // — BRIDGE — scale walks UP from Owl to Crane, each step louder —
    { t: 95,   id: 'owl',   g: 0.20 }, // ↓ quiet start
    { t: 99,   id: 'dog',   g: 0.30 },
    { t: 102,  id: 'deer',  g: 0.35 },
    { t: 105,  id: 'fox',   g: 0.45 }, // ↑
    { t: 108,  id: 'cat',   g: 0.55 }, // ↑↑
    { t: 111,  id: 'crane', g: 0.62 }, // ↑↑↑ peak, held long
    // — FINAL CHORUS — three pairs walking through the scale, then quiet landing —
    { t: 117,  id: 'owl',   g: 0.50 }, { t: 117,  id: 'fox',   g: 0.50 }, // ↑↑
    { t: 122,  id: 'dog',   g: 0.62 }, { t: 122,  id: 'cat',   g: 0.62 }, // ↑↑↑
    { t: 127,  id: 'deer',  g: 0.62 }, { t: 127,  id: 'crane', g: 0.62 }, // ↑↑↑
    { t: 132,  id: 'owl',   g: 0.13 }, { t: 132,  id: 'crane', g: 0.13 }, // ↓↓ quiet
  ]},

  // ─── Song 3: "Still Here" ────────────────────────────────────────────────
  // V / PC / C / V2 / C / Bridge / FC
  // Bridge is the most dramatic moment: whole scale walks DOWN, each step quieter.
  { name: 'Still Here', duration: 139, notes: [
    // — VERSE — Owl opens, Dog and Owl in conversation —
    { t: 0,    id: 'owl',   g: 0.28 },
    { t: 7,    id: 'owl',   g: 0.28 }, // ... ... (double silence)
    { t: 11.5, id: 'dog',   g: 0.28 },
    { t: 15,   id: 'owl',   g: 0.28 },
    // — PRE-CHORUS — Deer leads, Fox responds and escalates —
    { t: 19,   id: 'deer',  g: 0.30 },
    { t: 21.5, id: 'deer',  g: 0.40 }, // ↑
    { t: 25.5, id: 'fox',   g: 0.50 }, // ↑↑
    { t: 29.5, id: 'deer',  g: 0.32 },
    { t: 32,   id: 'fox',   g: 0.62 }, // ↑↑↑ peak
    // — CHORUS — Owl+Fox lead; Cat and Crane punctuate —
    { t: 37,   id: 'owl',   g: 0.62 }, { t: 37,   id: 'fox',   g: 0.62 }, // ↑↑↑
    { t: 42,   id: 'cat',   g: 0.50 },                                     // ↑↑
    { t: 47,   id: 'owl',   g: 0.62 }, { t: 47,   id: 'fox',   g: 0.62 }, // ↑↑↑
    { t: 51.5, id: 'crane', g: 0.62 },                                     // ↑↑↑
    // — VERSE 2 — quiet return —
    { t: 56,   id: 'owl',   g: 0.28 },
    { t: 61,   id: 'dog',   g: 0.28 },
    { t: 64.5, id: 'owl',   g: 0.28 },
    { t: 68.5, id: 'owl',   g: 0.28 },
    // — CHORUS (repeat) —
    { t: 73,   id: 'owl',   g: 0.62 }, { t: 73,   id: 'fox',   g: 0.62 },
    { t: 78,   id: 'cat',   g: 0.50 },
    { t: 82.5, id: 'owl',   g: 0.62 }, { t: 82.5, id: 'fox',   g: 0.62 },
    { t: 87,   id: 'crane', g: 0.62 },
    // — BRIDGE — scale walks DOWN from Crane to Owl, each step quieter.
    //   Tension releasing one note at a time. Most dramatic section. —
    { t: 92,   id: 'crane', g: 0.62 }, // ↑↑↑ Crane — top of the scale
    { t: 96,   id: 'cat',   g: 0.50 }, // ↑↑
    { t: 100,  id: 'fox',   g: 0.40 }, // ↑
    { t: 103.5,id: 'deer',  g: 0.30 },
    { t: 107,  id: 'dog',   g: 0.24 },
    { t: 110.5,id: 'owl',   g: 0.13 }, // ↓↓ Owl — arrival, resolution
    // — FINAL CHORUS — hits harder after the bridge's silence.
    //   Three peaks, then Owl+Crane fade to barely audible. —
    { t: 115,  id: 'owl',   g: 0.65 }, { t: 115,  id: 'fox',   g: 0.65 }, // ↑↑↑
    { t: 120,  id: 'owl',   g: 0.65 }, { t: 120,  id: 'fox',   g: 0.65 }, // ↑↑↑
    { t: 125,  id: 'owl',   g: 0.65 }, { t: 125,  id: 'crane', g: 0.65 }, // ↑↑↑
    { t: 131,  id: 'owl',   g: 0.08 }, { t: 131,  id: 'crane', g: 0.08 }, // ↓↓↓ fade to silence
  ]},
];


// Smoothly animate the day/night slider to a target value
let _nightSliderAnim = null;
function _animateNightSlider(targetVal, durationMs) {
  if (_nightSliderAnim) cancelAnimationFrame(_nightSliderAnim);
  const slider = document.getElementById('night-slider');
  if (!slider) return;
  const startVal = parseFloat(slider.value) || 0;
  const startTime = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - startTime) / durationMs);
    const eased = t * t * (3 - 2 * t); // smoothstep
    const val = Math.round(startVal + (targetVal - startVal) * eased);
    slider.value = val;
    slider.dispatchEvent(new Event('input'));
    if (t < 1) _nightSliderAnim = requestAnimationFrame(tick);
    else _nightSliderAnim = null;
  }
  _nightSliderAnim = requestAnimationFrame(tick);
}

// Fire boost: float 0.0→1.0 so the fire grows and dims gradually over ~8 seconds
var _choirFireLevel = 0;
var _choirFireAnimId = null;
function _animateFireLevel(target, durationMs) {
  if (_choirFireAnimId) { cancelAnimationFrame(_choirFireAnimId); _choirFireAnimId = null; }
  const startLevel = _choirFireLevel;
  const startTime = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - startTime) / durationMs);
    const eased = t * t * (3 - 2 * t); // smoothstep
    _choirFireLevel = startLevel + (target - startLevel) * eased;
    if (t < 1) _choirFireAnimId = requestAnimationFrame(tick);
    else { _choirFireAnimId = null; _choirFireLevel = target; }
  }
  _choirFireAnimId = requestAnimationFrame(tick);
}
function _startAutoChoir() {
  if (_choirMode) { _autoChoirTimer = setTimeout(_startAutoChoir, 30000); return; }
  _autoChoirPhase = 'gathering';
  _choirMode = true;
  document.getElementById('rehearsal-btn').classList.add('active');
  _currentScale = 'M';
  // Transition to full night during gathering
  _animateNightSlider(100, 28000);
  // Quiet background drone
  if (!_droneAudio) {
    _droneAudio = new Audio('Cello Drone D.mp3');
    _droneAudio.loop = true;
  }
  _droneAudio.volume = 0.08;
  _droneOn = true;
  if (!gameSoundMuted) _droneAudio.play().catch(() => {});
  const gatherSec = 30;
  if (typeof npcs !== 'undefined') {
    npcs.forEach(npc => {
      const pos = _CHOIR_POSITIONS.find(p => p.id === npc.id);
      if (!pos) return;
      npc._preChoirPos = { x: npc.x, y: npc.y };
      npc._choirTarget = { x: pos.x, y: pos.y };
      const dist = Math.hypot(pos.x - npc.x, pos.y - npc.y);
      npc._choirWalkSpeed = Math.max(0.25, dist / (gatherSec * 60));
      npc._origWanderRadius = npc.wanderRadius;
      npc._origSpeed = npc.speed;
      npc.wanderRadius = 0;
      npc.burstTimer = 0; npc.dirX = 0; npc.dirY = 0;
    });
  }
  _autoChoirTimeouts.push(setTimeout(() => {
    _autoChoirPhase = 'performing';
    _animateFireLevel(1, 8000); // ramp fire up over 8 seconds
    if (typeof npcs !== 'undefined') npcs.forEach(npc => { npc._choirWalkSpeed = 0; });
    _playAutoSong();
  }, gatherSec * 1000));
}

function _playAutoSong() {
  const song = _CHOIR_SONGS[Math.floor(Math.random() * _CHOIR_SONGS.length)];
  // Find the last bell note time
  let lastBellTime = 0;
  song.notes.forEach(note => { if (note.id && note.t > lastBellTime) lastBellTime = note.t; });
  // Stagger simultaneous notes so they don't hit at the exact same ms
  const staggerMap = {};
  song.notes.forEach(note => {
    if (!note.id) return;
    if (!staggerMap[note.t]) staggerMap[note.t] = 0;
    else staggerMap[note.t]++;
  });
  const staggerIndex = {};
  song.notes.forEach(note => {
    if (!note.id) return;
    if (!staggerIndex[note.t]) staggerIndex[note.t] = 0;
    const count = staggerMap[note.t];
    // Spread 30-120ms across simultaneous notes
    note._staggerMs = count > 0 ? Math.round((staggerIndex[note.t] / count) * 90 + Math.random() * 30) : 0;
    staggerIndex[note.t]++;
  });
  song.notes.forEach(note => {
    const delayMs = note.t * 1000 + (note._staggerMs || 0);
    _autoChoirTimeouts.push(setTimeout(() => {
      if (_autoChoirPhase !== 'performing') return;
      if (note.scale) _currentScale = note.scale;
      if (note.id) {
        // Force-play: clear previous bell if still ringing
        if (_bellSources[note.id]) {
          try { _bellSources[note.id].source.stop(); _bellSources[note.id].ctx.close(); } catch(e) {}
          delete _bellSources[note.id];
        }
        playNpcBell(note.id, note.g); // note.g sets gain (↑↓ intensity); undefined → default 0.3
        // Fade out the bell after 1.5 seconds
        const bs = _bellSources[note.id];
        if (bs) {
          try {
            bs.gain.gain.setValueAtTime(bs.gain.gain.value, bs.ctx.currentTime + 1.5);
            bs.gain.gain.linearRampToValueAtTime(0, bs.ctx.currentTime + 3.0);
          } catch(e) {}
        }
        // Gentle dance animation
        if (typeof npcs !== 'undefined') {
          const npc = npcs.find(n => n.id === note.id);
          if (npc) {
            npc._hoverDancing = true;
            clearTimeout(npc._autoDanceTimer);
            npc._autoDanceTimer = setTimeout(() => { npc._hoverDancing = false; }, 3000);
          }
        }
      }
    }, delayMs));
  });
  // After last bell: fade drone, dim fire, return to day
  _autoChoirTimeouts.push(setTimeout(() => {
    _animateFireLevel(0, 8000); // ramp fire down over 8 seconds
    // Fade drone out slowly
    if (_droneAudio && _droneOn) {
      _droneOn = false;
      const a = _droneAudio;
      const startVol = a.volume;
      const fadeSteps = 60;
      let step = 0;
      const fade = setInterval(() => {
        step++;
        a.volume = Math.max(0, startVol * (1 - step / fadeSteps));
        if (step >= fadeSteps) { clearInterval(fade); a.pause(); a.currentTime = 0; }
      }, 50);
    }
    _animateNightSlider(0, 8000);
  }, (lastBellTime + 5) * 1000));
  // Disperse after song duration
  _autoChoirTimeouts.push(setTimeout(_disperseAutoChoir, song.duration * 1000));
}

function _disperseAutoChoir() {
  _autoChoirPhase = 'dispersing';
  _currentScale = 'M';
  const disperseSec = 30;
  if (typeof npcs !== 'undefined') {
    npcs.forEach(npc => {
      // Always walk home — never linger near the bonfire
      const target = { x: npc.homeX, y: npc.homeY };
      if (_walkableBrushData.length > 0 && !_isInWalkablePaint(target.x, target.y)) {
        const p = _nearestWalkablePoint(target.x, target.y);
        target.x = p.x; target.y = p.y;
      }
      npc._choirTarget = { x: target.x, y: target.y };
      const dist = Math.hypot(target.x - npc.x, target.y - npc.y);
      npc._choirWalkSpeed = Math.max(0.25, dist / (disperseSec * 60));
    });
  }
  _autoChoirTimeouts.push(setTimeout(_endAutoChoir, disperseSec * 1000));
}

function _endAutoChoir() {
  _autoChoirPhase = 'idle';
  _choirMode = false;
  if (_choirFireAnimId) { cancelAnimationFrame(_choirFireAnimId); _choirFireAnimId = null; }
  _choirFireLevel = 0;
  // Ensure drone is stopped
  if (_droneAudio && _droneOn) { _droneOn = false; _droneAudio.pause(); _droneAudio.currentTime = 0; }
  document.getElementById('rehearsal-btn').classList.remove('active');
  if (typeof npcs !== 'undefined') {
    npcs.forEach(npc => {
      npc._choirTarget = null;
      npc._choirWalkSpeed = 0;
      npc._preChoirPos = null;
      npc.wanderRadius = 9999;
      npc.speed = npc._origSpeed || ({ fox: 0.9, owl: 0.2, crane: 0.35, cat: 0.3, deer: 0.5, dog: 0.8 })[npc.id] || 0.55;
    });
  }
  // Ensure we're back to day
  _animateNightSlider(0, 3000);
  _autoChoirTimer = setTimeout(_startAutoChoir, _autoChoirIntervalMin * 60 * 1000);
}

function _cancelAutoChoir() {
  _autoChoirTimeouts.forEach(t => clearTimeout(t));
  _autoChoirTimeouts = [];
  _endAutoChoir();
}

// Walkable area paint tool
function _updateWalkableCount() {
  const el = document.getElementById('walkable-stroke-count');
  if (el) el.textContent = _walkableBrushData.length + ' green · ' + _occlusionBrushData.length + ' red';
}
function _setWalkablePaintColor(color) {
  _walkablePaintColor = color;
  const isGreen = color === 'green';
  const gBtn = document.getElementById('wb-color-green');
  const rBtn = document.getElementById('wb-color-red');
  const hint = document.getElementById('wb-hint');
  if (gBtn) {
    gBtn.style.background = isGreen ? 'rgba(100,220,130,0.2)' : 'rgba(255,255,255,0.06)';
    gBtn.style.borderColor = isGreen ? 'rgba(100,220,130,0.55)' : 'rgba(255,255,255,0.14)';
    gBtn.style.color = isGreen ? 'rgba(100,220,130,1)' : 'rgba(234,229,222,0.6)';
  }
  if (rBtn) {
    rBtn.style.background = !isGreen ? 'rgba(255,80,80,0.2)' : 'rgba(255,255,255,0.06)';
    rBtn.style.borderColor = !isGreen ? 'rgba(255,80,80,0.55)' : 'rgba(255,255,255,0.14)';
    rBtn.style.color = !isGreen ? 'rgba(255,120,120,1)' : 'rgba(234,229,222,0.6)';
  }
  if (hint) hint.textContent = isGreen ? 'Drag on roads & open areas.' : 'Drag on trees, rooftops & fire.';
}
document.getElementById('wb-color-green').addEventListener('click', () => _setWalkablePaintColor('green'));
document.getElementById('wb-color-red').addEventListener('click', () => _setWalkablePaintColor('red'));
document.getElementById('walkable-paint-btn').addEventListener('click', () => {
  _walkablePaintMode = !_walkablePaintMode;
  document.getElementById('walkable-paint-panel').style.display = _walkablePaintMode ? 'block' : 'none';
  document.getElementById('walkable-paint-btn').classList.toggle('active', _walkablePaintMode);
  document.body.style.cursor = _walkablePaintMode ? 'crosshair' : '';
  _updateWalkableCount();
});
document.getElementById('walkable-clear-btn').addEventListener('click', () => {
  _walkableBrushData.length = 0;
  _occlusionBrushData.length = 0;
  persistData('clayVillageWalkable', _walkableBrushData);
  persistData('clayVillageOcclusion', _occlusionBrushData);
  _updateWalkableCount();
});
document.getElementById('walkable-done-btn').addEventListener('click', () => {
  _walkablePaintMode = false;
  _walkablePainting = false;
  document.getElementById('walkable-paint-panel').style.display = 'none';
  document.getElementById('walkable-paint-btn').classList.remove('active');
  document.body.style.cursor = '';
  persistData('clayVillageWalkable', _walkableBrushData);
  persistData('clayVillageOcclusion', _occlusionBrushData);
});
document.querySelectorAll('.wb-size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    _walkableBrushSize = parseInt(btn.dataset.r);
    document.querySelectorAll('.wb-size-btn').forEach(b => {
      const active = b === btn;
      b.style.background = active ? 'rgba(100,220,130,0.15)' : 'rgba(255,255,255,0.07)';
      b.style.borderColor = active ? 'rgba(100,220,130,0.4)' : 'rgba(255,255,255,0.15)';
      b.style.color = active ? 'rgba(100,220,130,0.95)' : 'rgba(234,229,222,0.85)';
    });
  });
});
// Paint on drag — window-level so pointer-events:none on canvas doesn't block
function _walkablePaintAt(e) {
  const canvas = document.getElementById('outline-canvas');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
  const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
  if (!world) return;
  const arr = _walkablePaintColor === 'red' ? _occlusionBrushData : _walkableBrushData;
  const last = arr[arr.length - 1];
  if (last && Math.hypot(world.x - last.x, world.y - last.y) < _walkableBrushSize * 0.4) return;
  arr.push({ x: Math.round(world.x), y: Math.round(world.y), r: _walkableBrushSize });
  _updateWalkableCount();
}
window.addEventListener('mousedown', e => {
  if (!_walkablePaintMode) return;
  if (e.target.closest && e.target.closest('#walkable-paint-panel, #top-controls, #admin-sidebar, #tour-card, #chat-window')) return;
  _walkablePainting = true;
  _walkablePaintAt(e);
}, true);
window.addEventListener('mousemove', e => {
  if (!_walkablePaintMode || !_walkablePainting) return;
  _walkablePaintAt(e);
}, true);
window.addEventListener('mouseup', () => {
  if (!_walkablePaintMode || !_walkablePainting) return;
  _walkablePainting = false;
  persistData('clayVillageWalkable', _walkableBrushData);
  persistData('clayVillageOcclusion', _occlusionBrushData);
}, true);

// Bonfire cello drone — invisible click zone over bonfire, floating notes when active
// Bonfire world position: x≈717, y≈376
const _BONFIRE_WORLD = { x: 717, y: 352 }; // slightly above centre (fire tip)
var _droneOn = false;
var _droneAudio = null;
var _droneNoteTimer = null;
const _droneNoteChars = ['♩','♪','♫','♬'];

function _startDrone() {
  _droneOn = true;
  if (!_droneAudio) {
    _droneAudio = new Audio('Cello Drone D.mp3');
    _droneAudio.loop = true;
    _droneAudio.volume = 0.45;
  }
  if (!gameSoundMuted) _droneAudio.play().catch(() => {});
  // Spawn floating notes periodically
  _droneNoteTimer = setInterval(_spawnDroneNote, 900);
}
function _stopDrone() {
  _droneOn = false;
  clearInterval(_droneNoteTimer);
  if (_droneAudio) {
    // Fade out over 3 seconds
    const a = _droneAudio;
    const startVol = a.volume;
    const fadeSteps = 60;
    let step = 0;
    const fade = setInterval(() => {
      step++;
      a.volume = Math.max(0, startVol * (1 - step / fadeSteps));
      if (step >= fadeSteps) {
        clearInterval(fade);
        a.pause(); a.currentTime = 0; a.volume = 0.45;
      }
    }, 50); // 60 steps × 50ms = 3 seconds
  }
}
function _spawnDroneNote() {
  if (!_droneOn) return;
  const zone = document.getElementById('bonfire-drone-zone');
  if (!zone) return;
  const rect = zone.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'drone-note';
  el.textContent = _droneNoteChars[Math.floor(Math.random() * _droneNoteChars.length)];
  const dx = (Math.random() - 0.5) * 30;
  el.style.setProperty('--dx', dx + 'px');
  el.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 24) + 'px';
  el.style.top  = (rect.top  + rect.height / 2) + 'px';
  el.style.color = `hsl(${35 + Math.random() * 20}, 80%, ${65 + Math.random() * 20}%)`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2900);
}
document.getElementById('bonfire-drone-zone').addEventListener('click', () => {
  if (_droneOn) _stopDrone(); else _startDrone();
});

document.getElementById('sound-toggle').innerHTML = soundOnSVG;
document.getElementById('sound-toggle').classList.add('playing');
var _soundFirstUnmute = true;
// Sound is on by default — start playback on first user interaction (browser policy)
document.addEventListener('click', function _firstInteraction() {
  document.removeEventListener('click', _firstInteraction);
  if (!gameSoundMuted && _soundFirstUnmute) {
    _soundFirstUnmute = false;
    var oldF = document.getElementById('forest-audio');
    var oldN = document.getElementById('night-audio');
    if (oldF) {
      var newF = new Audio('Forest Sounds 22.10.40.mp3');
      newF.id = 'forest-audio'; newF.loop = true; newF.volume = 0.5;
      oldF.parentNode.replaceChild(newF, oldF);
      newF.play().catch(function() {});
    }
    if (oldN) {
      var newN = new Audio('Nightsound.mp3');
      newN.id = 'night-audio'; newN.loop = true; newN.volume = 0;
      oldN.parentNode.replaceChild(newN, oldN);
    }
  }
}, { once: true });

function toggleVillageSound() {
  var btn = document.getElementById('sound-toggle');
  gameSoundMuted = !gameSoundMuted;

  if (gameSoundMuted) {
    // MUTE
    var f = document.getElementById('forest-audio');
    var n = document.getElementById('night-audio');
    if (f) f.pause();
    if (n) n.pause();
    if (typeof bonfireCrackleEl !== 'undefined' && bonfireCrackleEl) bonfireCrackleEl.muted = true;
    if (typeof _droneAudio !== 'undefined' && _droneAudio) _droneAudio.pause();
    btn.classList.remove('playing');
    btn.innerHTML = soundOffSVG;
  } else {
    // UNMUTE — recreate audio on first click (browser autoplay policy)
    if (_soundFirstUnmute) {
      _soundFirstUnmute = false;
      var oldF = document.getElementById('forest-audio');
      var oldN = document.getElementById('night-audio');
      if (oldF) {
        var newF = new Audio('Forest Sounds 22.10.40.mp3');
        newF.id = 'forest-audio'; newF.loop = true; newF.volume = 0.5;
        oldF.parentNode.replaceChild(newF, oldF);
        newF.play().catch(function() {});
      }
      if (oldN) {
        var newN = new Audio('Nightsound.mp3');
        newN.id = 'night-audio'; newN.loop = true; newN.volume = 0;
        oldN.parentNode.replaceChild(newN, oldN);
      }
    } else {
      updateAmbientSound();
    }
    if (typeof bonfireCrackleEl !== 'undefined' && bonfireCrackleEl) bonfireCrackleEl.muted = false;
    if (typeof _droneOn !== 'undefined' && _droneOn && _droneAudio) _droneAudio.play().catch(function() {});
    btn.classList.add('playing');
    btn.innerHTML = soundOnSVG;
  }
}
