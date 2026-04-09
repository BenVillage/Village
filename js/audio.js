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
