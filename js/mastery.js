// ===== CLAY MASTERY — Skill Progression + Spaced Repetition =====
(function() {
  var _cmData = {};
  async function fetchMasteryData() {
    if (window._supabase) {
      var res = await window._supabase.from('school_mastery').select('*')
        .eq('village_id', _ACTIVE_VILLAGE_ID).eq('user_id', _presenceProfileId());
      if (!res.error && res.data) {
        _cmData = {};
        res.data.forEach(function(r) {
          _cmData[r.skill_id] = { level: r.level, sessions: r.sessions, lastPractice: r.last_practice };
        });
      }
    }
    renderOverview(); renderTree();
  }
  const INTERVALS = [1, 3, 7, 14, 30, 60]; // days per level 1–6
  const MAX_LEVEL = 6;

  const CM_SKILLS = [
    // Foundations
    { id: 'wedging', name: 'Wedging', icon: 'WD', group: 'Foundations', desc: 'Knead clay to remove air bubbles and align particles.', tips: 'Ram\'s head technique. Push with heel of palm, fold, rotate 45\u00B0, repeat. 100 pushes minimum.' },
    { id: 'centering', name: 'Centering', icon: 'CT', group: 'Foundations', desc: 'Get clay perfectly centered on the wheel head.', tips: 'Brace elbows on thighs. Use body weight, not arm strength. Clay should spin without wobbling.' },
    { id: 'opening', name: 'Opening', icon: 'OP', group: 'Foundations', desc: 'Create the initial hole in centered clay.', tips: 'Press thumbs into center at moderate speed. Leave at least 1cm of floor thickness.' },
    // Forming
    { id: 'pulling', name: 'Pulling Walls', icon: 'PW', group: 'Forming', desc: 'Draw clay upward to create even, thin walls.', tips: 'Inside hand slightly higher than outside. Gentle, steady pressure. 3\u20134 pulls max.' },
    { id: 'shaping', name: 'Shaping', icon: 'SH', group: 'Forming', desc: 'Transform a cylinder into bowls, cups, or vases.', tips: 'Bowls: push from inside outward. Vases: collar inward. Always shape bottom-up.' },
    { id: 'trimming', name: 'Trimming', icon: 'TR', group: 'Forming', desc: 'Carve the foot and refine form when leather-hard.', tips: 'Clay should be leather-hard. Center piece upside down. Create a foot ring.' },
    // Refining
    { id: 'handles', name: 'Handles & Attachments', icon: 'HA', group: 'Refining', desc: 'Pull and attach handles, spouts, lids.', tips: 'Score and slip both surfaces. Pull handles from a thick roll \u2014 don\'t roll them thin.' },
    { id: 'surface', name: 'Surface Decoration', icon: 'SD', group: 'Refining', desc: 'Carving, stamping, slip trailing, sgraffito.', tips: 'Decorate at the right stage \u2014 too wet = marks blur, too dry = clay cracks. Leather-hard is usually best.' },
    // Finishing
    { id: 'glazing', name: 'Glazing', icon: 'GL', group: 'Finishing', desc: 'Apply glaze for color, texture, and food-safety.', tips: 'Three even coats by dipping or brushing. Wax the foot to prevent sticking. Test on tiles first.' },
    { id: 'firing', name: 'Firing & Kiln Knowledge', icon: 'FK', group: 'Finishing', desc: 'Understand bisque, glaze, and raku firing.', tips: 'Bisque fire to cone 06. Glaze fire depends on clay body \u2014 stoneware typically cone 6 or 10.' },
  ];
  const CM_GROUPS = ['Foundations', 'Forming', 'Refining', 'Finishing'];

  // --- Data (backed by Supabase, village-scoped) ---
  function getData() { return _cmData; }
  function saveData(d) {
    _cmData = d;
    if (window._supabase) {
      var uid = _presenceProfileId();
      Object.keys(d).forEach(function(skillId) {
        var s = d[skillId];
        window._supabase.from('school_mastery').upsert({
          village_id: _ACTIVE_VILLAGE_ID, user_id: uid, skill_id: skillId,
          level: s.level || 0, sessions: s.sessions || 0, last_practice: s.lastPractice || null
        }, { onConflict: 'village_id,user_id,skill_id' });
      });
    }
  }

  function migrateOldData() { /* legacy localStorage migration removed — data now in Supabase */ }

  // --- Spaced repetition ---
  function getSkillData(skillId) {
    const d = getData();
    return d[skillId] || { level: 0, sessions: 0, lastPractice: null };
  }
  function nextReviewDate(sd) {
    if (!sd.lastPractice || sd.level === 0) return null;
    const last = new Date(sd.lastPractice);
    const days = INTERVALS[Math.min(sd.level - 1, INTERVALS.length - 1)];
    return new Date(last.getTime() + days * 86400000);
  }
  function isOverdue(sd) {
    const nr = nextReviewDate(sd);
    return nr && nr < new Date();
  }
  function isDueToday(sd) {
    const nr = nextReviewDate(sd);
    if (!nr) return false;
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    return nr >= today && nr < tomorrow;
  }
  function daysUntilReview(sd) {
    const nr = nextReviewDate(sd);
    if (!nr) return null;
    return Math.max(0, Math.ceil((nr - new Date()) / 86400000));
  }

  // --- Render overview stats ---
  function renderOverview() {
    const el = document.getElementById('cm-overview');
    if (!el) return;
    const data = getData();
    let totalLevels = 0, started = 0, dueCount = 0;
    CM_SKILLS.forEach(s => {
      const sd = data[s.id] || { level: 0, sessions: 0, lastPractice: null };
      totalLevels += sd.level;
      if (sd.level > 0) started++;
      if (isOverdue(sd) || isDueToday(sd)) dueCount++;
    });
    const pct = Math.round((totalLevels / (CM_SKILLS.length * MAX_LEVEL)) * 100);
    el.innerHTML = `
      <div class="cm-stats">
        <div class="cm-stat-card">
          <div class="cm-stat-value">${pct}%</div>
          <div class="cm-stat-label">Mastery</div>
          <div class="cm-stat-bar"><div class="cm-stat-bar-fill" style="width:${pct}%;background:#c8a84b;"></div></div>
        </div>
        <div class="cm-stat-card">
          <div class="cm-stat-value">${started}<span style="font-size:14px;color:#a08060;">/${CM_SKILLS.length}</span></div>
          <div class="cm-stat-label">Skills Started</div>
        </div>
        <div class="cm-stat-card">
          <div class="cm-stat-value" style="color:${dueCount > 0 ? '#ef4444' : '#22c55e'};">${dueCount}</div>
          <div class="cm-stat-label">Due for Review</div>
        </div>
      </div>
    `;
  }

  // --- Render skill tree ---
  function renderTree() {
    const el = document.getElementById('cm-tree');
    if (!el) return;
    const data = getData();
    el.innerHTML = '';
    el.style.display = 'block';
    document.getElementById('cm-detail').classList.remove('active');

    CM_GROUPS.forEach(group => {
      const label = document.createElement('div');
      label.className = 'cm-group-label';
      label.textContent = group;
      el.appendChild(label);

      CM_SKILLS.filter(s => s.group === group).forEach(skill => {
        const sd = data[skill.id] || { level: 0, sessions: 0, lastPractice: null };
        const overdue = isOverdue(sd);
        const dueToday = isDueToday(sd);
        const days = daysUntilReview(sd);

        let statusClass = 'not-started', statusText = 'Not started';
        if (sd.level >= MAX_LEVEL) { statusClass = 'upcoming'; statusText = 'Mastered'; }
        else if (overdue) { statusClass = 'overdue'; statusText = 'Overdue'; }
        else if (dueToday) { statusClass = 'due-today'; statusText = 'Due today'; }
        else if (days !== null) { statusClass = 'upcoming'; statusText = `Review in ${days}d`; }

        const card = document.createElement('div');
        card.className = 'cm-skill-card' + (overdue ? ' cm-overdue' : '') + (dueToday ? ' cm-due-today' : '');
        card.innerHTML = `
          <div class="cm-skill-top">
            <div class="cm-skill-icon">${skill.icon}</div>
            <div class="cm-skill-info">
              <div class="cm-skill-name">${skill.name}</div>
              <div class="cm-skill-desc">${skill.desc}</div>
            </div>
          </div>
          <div class="cm-mastery-bar">${Array.from({length: MAX_LEVEL}, (_, i) => `<div class="cm-mastery-seg${i < sd.level ? ' filled' : ''}"></div>`).join('')}</div>
          <div class="cm-review-status ${statusClass}">${statusText}</div>
        `;
        card.addEventListener('click', () => renderDetail(skill.id));
        el.appendChild(card);
      });
    });
  }

  // --- Render detail view ---
  function renderDetail(skillId) {
    const skill = CM_SKILLS.find(s => s.id === skillId);
    if (!skill) return;
    const data = getData();
    const sd = data[skillId] || { level: 0, sessions: 0, lastPractice: null };
    const nr = nextReviewDate(sd);
    const nrStr = nr ? nr.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '\u2014';
    const mastered = sd.level >= MAX_LEVEL;

    document.getElementById('cm-tree').style.display = 'none';
    const el = document.getElementById('cm-detail');
    el.classList.add('active');
    el.innerHTML = `
      <button class="cm-detail-back">\u2190 All skills</button>
      <div class="cm-detail-header">
        <div class="cm-detail-icon">${skill.icon}</div>
        <div class="cm-detail-name">${skill.name}</div>
        <div class="cm-detail-desc">${skill.desc}</div>
      </div>
      <div class="cm-detail-stats">
        <div class="cm-stat-card">
          <div class="cm-stat-value">${sd.level}<span style="font-size:14px;color:#a08060;">/${MAX_LEVEL}</span></div>
          <div class="cm-stat-label">Level</div>
        </div>
        <div class="cm-stat-card">
          <div class="cm-stat-value">${sd.sessions}</div>
          <div class="cm-stat-label">Sessions</div>
        </div>
        <div class="cm-stat-card">
          <div class="cm-stat-value" style="font-size:16px;">${nrStr}</div>
          <div class="cm-stat-label">Next Review</div>
        </div>
      </div>
      <div class="cm-mastery-bar" style="margin-bottom:20px;">${Array.from({length: MAX_LEVEL}, (_, i) => `<div class="cm-mastery-seg${i < sd.level ? ' filled' : ''}"></div>`).join('')}</div>
      <div class="cm-tips-card">
        <div class="cm-tips-title">Practice Tips</div>
        <div class="cm-tips-text">${skill.tips}</div>
      </div>
      <div class="cm-info-card">
        Each practice session increases your level. Higher levels mean longer intervals between reviews \u2014 from 1 day at level 1 to 60 days at level 6. The skill stays sharp through spaced repetition.
      </div>
      <button class="cm-log-btn" id="cm-log-btn" ${mastered ? 'disabled' : ''}>${mastered ? 'Mastered' : 'Log Practice Session'}</button>
    `;
    el.querySelector('.cm-detail-back').addEventListener('click', () => { renderOverview(); renderTree(); });
    const logBtn = el.querySelector('#cm-log-btn');
    if (logBtn && !mastered) {
      logBtn.addEventListener('click', () => {
        logPractice(skillId);
        renderDetail(skillId);
        renderOverview();
      });
    }
  }

  // --- Log practice ---
  function logPractice(skillId) {
    const data = getData();
    const sd = data[skillId] || { level: 0, sessions: 0, lastPractice: null };
    sd.level = Math.min(sd.level + 1, MAX_LEVEL);
    sd.sessions++;
    sd.lastPractice = new Date().toISOString();
    data[skillId] = sd;
    saveData(data);
    const skill = CM_SKILLS.find(s => s.id === skillId);
    showToast(`${skill.icon} ${skill.name} \u2192 Level ${sd.level}`);
  }

  // --- Toast ---
  function showToast(msg) {
    const el = document.getElementById('cm-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
  }

  // --- Init ---
  migrateOldData();

  window.openSchoolPaths = function() {
    var ov = document.getElementById('school-overlay');
    if (!ov) return;
    ov.style.display = 'flex';
    schoolTab('workshops');
    fetchMasteryData();
  };

  window.schoolTab = function(tab) {
    const ws  = document.getElementById('school-workshops-listings');
    const mst = document.getElementById('school-mastery');
    const cog = document.getElementById('school-cog-agency');
    const twsBtn  = document.getElementById('stab-workshops');
    const tmstBtn = document.getElementById('stab-mastery');
    const tmoBtn  = document.getElementById('stab-mondo');
    const tcogBtn = document.getElementById('stab-cog-agency');

    // Deactivate all tabs and panels
    twsBtn?.classList.remove('active');
    tmstBtn?.classList.remove('active');
    tmoBtn?.classList.remove('active');
    tcogBtn?.classList.remove('active');
    if (ws) ws.style.display  = 'none';
    if (mst) mst.style.display = 'none';
    if (cog) cog.style.display = 'none';

    if (tab === 'workshops') {
      if (ws) ws.style.display  = 'block';
      twsBtn?.classList.add('active');
    } else if (tab === 'mondo') {
      // mondo opens its own full-screen overlay, not a panel
      tmoBtn?.classList.add('active');
      if (window._villageRole === 'guest') return; // guests cannot use mondo
      openMondo();
    } else if (tab === 'cog-agency') {
      // Cognitive Agency opens its own full-screen overlay
      tcogBtn?.classList.add('active');
      if (cog) cog.style.display = 'block';
    } else {
      mst.style.display = 'block';
      tmstBtn?.classList.add('active');
      renderOverview();
      renderTree();
    }
  };

  document.getElementById('school-close').addEventListener('click', () => {
    document.getElementById('school-overlay').style.display = 'none';
    if (typeof placeAvatarAtBuilding === 'function') placeAvatarAtBuilding('School');
  });

  // ===== MONDO ENGINE =====
  var _mondoHistory = [];
  var _mondoEnteredAt = null;
  var _mondoSessionEnded = false;
  var _mondoTimer19 = null;
  var _mondoTimer20 = null;
  var _mondoTickInterval = null;
  var _mondoUrl = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3001/mondo'
    : 'https://fokujzwgqtifpbmmhdot.supabase.co/functions/v1/mondo';

  // Preload gong — ritual sound, always plays (not gated by gameSoundMuted)
  var _mondoGongEl = document.createElement('audio');
  _mondoGongEl.src = 'Gong.mp3';
  _mondoGongEl.preload = 'auto';

  function _playGong(rate, vol) {
    try {
      var g = _mondoGongEl.cloneNode();
      g.playbackRate = rate || 1.0;
      g.volume = vol || 0.4;
      g.play();
    } catch(_) {}
  }

  // Timer display: 18分43秒 format
  function _updateMondoTimer() {
    var el = document.getElementById('mondo-timer');
    if (!el || !_mondoEnteredAt || _mondoSessionEnded) {
      if (el) { el.classList.remove('visible'); }
      return;
    }
    var elapsed = Math.floor((Date.now() - _mondoEnteredAt) / 1000);
    var remaining = Math.max(0, 1200 - elapsed);
    var min = Math.floor(remaining / 60);
    var sec = remaining % 60;
    el.textContent = min + '\u5206' + (sec < 10 ? '0' : '') + sec + '\u79D2';
    // Amber at 1 minute remaining
    if (remaining <= 60) el.classList.add('warning');
    else el.classList.remove('warning');
    if (remaining <= 0) {
      el.classList.remove('visible');
      clearInterval(_mondoTickInterval);
      _mondoTickInterval = null;
    }
  }

  function _mondoEndSession() {
    _mondoSessionEnded = true;
    if (_mondoTickInterval) { clearInterval(_mondoTickInterval); _mondoTickInterval = null; }
    var timerEl = document.getElementById('mondo-timer');
    if (timerEl) timerEl.classList.remove('visible');
    var inp = document.getElementById('mondo-input');
    var sendBtn = document.getElementById('mondo-send');
    var inputArea = document.querySelector('.mondo-input-area');
    if (inp) inp.style.display = 'none';
    if (sendBtn) sendBtn.style.display = 'none';
    if (inputArea) {
      var endLine = document.createElement('div');
      endLine.style.cssText = 'text-align:center;font-size:11px;color:rgba(204,34,34,0.3);font-style:italic;letter-spacing:0.06em;padding:12px 0;';
      endLine.innerHTML = 'This session has ended. <span class="mondo-tip-wrap">mond\u014D<span class="mondo-tip"><span class="tip-title">mond\u014D \u2014 <span class="tip-jp">\u554F\u7B54</span></span>Question and answer. A practice of breaking through assumption.<br><br>The room is sealed. Mura cannot see what happens here.</span></span> forgets. You do not have to.';
      inputArea.innerHTML = '';
      inputArea.appendChild(endLine);
    }
    if (window._supabase && window._sbAuthUid) {
      window._supabase.from('mondo_visits').insert({
        user_id: window._sbAuthUid,
        village_id: typeof _ACTIVE_VILLAGE_ID !== 'undefined' ? _ACTIVE_VILLAGE_ID : null,
        duration_seconds: 1200
      }).then(function(r) {
        if (r.error) console.warn('[mondo_visits]', r.error.message);
      });
    }
  }

  function _clearMondoTimers() {
    if (_mondoTimer19) { clearTimeout(_mondoTimer19); _mondoTimer19 = null; }
    if (_mondoTimer20) { clearTimeout(_mondoTimer20); _mondoTimer20 = null; }
    if (_mondoTickInterval) { clearInterval(_mondoTickInterval); _mondoTickInterval = null; }
    var timerEl = document.getElementById('mondo-timer');
    if (timerEl) { timerEl.classList.remove('visible', 'warning'); timerEl.textContent = ''; }
  }

  function openMondo() {
    var ov = document.getElementById('mondo-overlay');
    if (!ov) return;
    _mondoHistory = [];
    _mondoEnteredAt = Date.now();
    _mondoSessionEnded = false;
    _clearMondoTimers();
    // Reset conversation area — empty, opening sequence will fill it
    var convo = document.getElementById('mondo-convo');
    if (convo) convo.innerHTML = '';
    // Reset input area
    var inputArea = document.querySelector('.mondo-input-area');
    if (inputArea) {
      inputArea.innerHTML =
        '<div class="mondo-input-row">' +
          '<textarea id="mondo-input" rows="1" placeholder="Say what you actually think."></textarea>' +
          '<button id="mondo-send" disabled>\u554F</button>' +
        '</div>' +
        '<div class="mondo-input-note">This conversation is not saved. <span class="mondo-tip-wrap">mond\u014D<span class="mondo-tip"><span class="tip-title">mond\u014D \u2014 <span class="tip-jp">\u554F\u7B54</span></span>Question and answer. A practice of breaking through assumption.<br><br>You have 20 minutes. mond\u014D never validates. Never comforts. mond\u014D will not remember this conversation. You will.<br><br>The room is sealed. Mura cannot see what happens here.</span></span> forgets. You do not have to.</div>';
      _rewireMondoInput();
      // Hide input area until gong
      inputArea.classList.add('mondo-input-fade');
    }
    ov.classList.add('open');

    // === Opening sequence: silence, gong, question emerges slowly ===
    // 2s: gong plays, input area fades in
    setTimeout(function() {
      _playGong(0.5, 0.4);
      var ia = document.querySelector('.mondo-input-area');
      if (ia) ia.classList.remove('mondo-input-fade');
    }, 2000);
    // 3s: the question fades slowly from void (2.5s animation)
    setTimeout(function() {
      if (convo) {
        convo.innerHTML = '<div class="mondo-msg mondo-msg-mondo mondo-fade-in">What are you trying to figure out?</div>';
        convo.scrollTop = convo.scrollHeight;
      }
      // Show timer
      var timerEl = document.getElementById('mondo-timer');
      if (timerEl) timerEl.classList.add('visible');
      _mondoTickInterval = setInterval(_updateMondoTimer, 1000);
      _updateMondoTimer();
      // Focus input after the text has appeared
      setTimeout(function() {
        var inp = document.getElementById('mondo-input');
        if (inp) inp.focus();
      }, 2500);
    }, 3000);

    // 19-minute warning gong (lower pitch, quieter)
    _mondoTimer19 = setTimeout(function() {
      if (_mondoSessionEnded) return;
      _playGong(0.425, 0.3);
      var c = document.getElementById('mondo-convo');
      if (c) {
        c.innerHTML += '<div class="mondo-sep">\u554F</div><div class="mondo-msg mondo-msg-mondo">Our time comes to an end.</div>';
        c.scrollTop = c.scrollHeight;
      }
    }, 19 * 60 * 1000);
    // 20-minute closing gong (lowest pitch, louder)
    _mondoTimer20 = setTimeout(function() {
      if (_mondoSessionEnded) return;
      _playGong(0.35, 0.5);
      var c = document.getElementById('mondo-convo');
      if (c) {
        c.innerHTML += '<hr class="mondo-hr"><div class="mondo-msg mondo-msg-mondo">The time we had is complete.</div>';
        c.scrollTop = c.scrollHeight;
      }
      _mondoEndSession();
    }, 20 * 60 * 1000);
  }

  async function closeMondo() {
    var ov = document.getElementById('mondo-overlay');
    if (ov) ov.classList.remove('open');
    _clearMondoTimers();
    if (!_mondoSessionEnded && _mondoEnteredAt && window._supabase && window._sbAuthUid) {
      var duration = Math.floor((Date.now() - _mondoEnteredAt) / 1000);
      window._supabase.from('mondo_visits').insert({
        user_id: window._sbAuthUid,
        village_id: typeof _ACTIVE_VILLAGE_ID !== 'undefined' ? _ACTIVE_VILLAGE_ID : null,
        duration_seconds: duration
      }).then(function(r) {
        if (r.error) console.warn('[mondo_visits]', r.error.message);
      });
    }
    _mondoEnteredAt = null;
    _mondoHistory = [];
    _mondoSessionEnded = false;
    schoolTab('workshops');
  }

  async function sendToMondo(text) {
    if (!text.trim() || _mondoSessionEnded) return;
    var convo = document.getElementById('mondo-convo');
    var inp = document.getElementById('mondo-input');
    var sendBtn = document.getElementById('mondo-send');

    // Add user message to UI — red kanji separator before user messages
    convo.innerHTML += '<div class="mondo-sep">問</div><div class="mondo-msg mondo-msg-user">' + _escHtml(text) + '</div>';

    // Add loading dot
    convo.innerHTML += '<hr class="mondo-hr"><div class="mondo-msg mondo-msg-mondo" id="mondo-loading"><span class="mondo-loading"></span></div>';
    convo.scrollTop = convo.scrollHeight;

    // Clear input
    inp.value = '';
    inp.style.height = 'auto';
    sendBtn.disabled = true;

    // Add to history
    _mondoHistory.push({ role: 'user', content: text });

    try {
      var resp = await fetch(_mondoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ messages: _mondoHistory })
      });
      var data = await resp.json();
      if (!resp.ok || (data && data.error)) {
        var loadEl2 = document.getElementById('mondo-loading');
        if (loadEl2) loadEl2.remove();
        convo.innerHTML += '<div class="mondo-msg mondo-msg-mondo" style="color:#c88;">Something went wrong. Try again.</div>';
        console.warn('[mondo error]', data && data.error);
        return;
      }
      var reply = (data && data.text) || 'I have nothing to ask right now.';
      _mondoHistory.push({ role: 'assistant', content: reply });

      // Remove loading dot
      var loadEl = document.getElementById('mondo-loading');
      if (loadEl) loadEl.remove();

      // Check if this is the 間 response (breakthrough)
      if (reply.indexOf('\u300C\u9593\u300D') !== -1 || reply.trim().startsWith('\u300C\u9593\u300D') || reply.trim() === '\u9593') {
        convo.innerHTML += '<div class="mondo-ma"><div class="mondo-ma-kanji">\u300C\u9593\u300D</div><div class="mondo-ma-sub">(ma \u2014 the pause that means something)</div></div>';
        convo.scrollTop = convo.scrollHeight;
      } else {
        // Typewriter effect — letters appear one by one
        var msgEl = document.createElement('div');
        msgEl.className = 'mondo-msg mondo-msg-mondo';
        convo.appendChild(msgEl);
        var chars = reply.split('');
        var ci = 0;
        var twInterval = setInterval(function() {
          if (ci < chars.length) {
            msgEl.textContent += chars[ci];
            ci++;
            convo.scrollTop = convo.scrollHeight;
          } else {
            clearInterval(twInterval);
            // Apply styled formatting after typing completes
            msgEl.innerHTML = _styledMondoReply(reply);
          }
        }, 18);
      }
    } catch (err) {
      var loadEl = document.getElementById('mondo-loading');
      if (loadEl) loadEl.remove();
      convo.innerHTML += '<div class="mondo-msg mondo-msg-mondo" style="color:#c88;">Something went wrong. Try again.</div>';
      console.warn('[mondo]', err);
    }
  }

  function _styledMondoReply(text) {
    // Escape HTML first, then wrap Japanese character runs in styled spans
    var safe = _escHtml(text);
    // Match runs of CJK characters, punctuation, and brackets (Japanese text blocks)
    safe = safe.replace(/([\u3000-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u300C\u300D\u3001\u3002]+)/g,
      '<span class="mondo-jp">$1</span>');
    // Convert newlines to <br> for line breaks
    safe = safe.replace(/\n/g, '<br>');
    return safe;
  }

  function _escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // Wire up mondo UI — called on init and after input area rebuild
  function _rewireMondoInput() {
    var inp = document.getElementById('mondo-input');
    var send = document.getElementById('mondo-send');
    if (inp) {
      inp.addEventListener('input', function() {
        send.disabled = !inp.value.trim();
        inp.style.height = 'auto';
        inp.style.height = Math.min(inp.scrollHeight, 120) + 'px';
      });
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (inp.value.trim()) sendToMondo(inp.value.trim());
        }
      });
    }
    if (send) send.addEventListener('click', function() {
      var inp2 = document.getElementById('mondo-input');
      if (inp2 && inp2.value.trim()) sendToMondo(inp2.value.trim());
    });
  }
  _rewireMondoInput();

  window.openMondo = openMondo; // expose globally for map icon + nav

  var _mondoClose = document.getElementById('mondo-close');
  if (_mondoClose) _mondoClose.addEventListener('click', closeMondo);

  // Position fixed tooltips above the hovered word
  document.addEventListener('mouseover', function(e) {
    var wrap = e.target.closest('.mondo-tip-wrap');
    if (!wrap) return;
    var tip = wrap.querySelector('.mondo-tip');
    if (!tip) return;
    var rect = wrap.getBoundingClientRect();
    tip.style.left = Math.max(8, rect.left + rect.width / 2 - 120) + 'px';
    tip.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
  });

  // Escape key closes mondo (not the school behind it)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var ov = document.getElementById('mondo-overlay');
      if (ov && ov.classList.contains('open')) {
        e.stopPropagation();
        closeMondo();
      }
    }
  });
})();

// ===== COGNITIVE AGENCY — Learning Path =====
(function() {
  const CA_KEY = 'cognitiveAgencyProgress';

  const CA_CHAPTERS = [
    { id: 'ch1', title: 'The Fork', coreIdea: 'The future class divide won\u2019t be wealth-based. It will be between a focus class and a slop class.',
      content: 'If AGI pans out, cognitive agency becomes the defining human asset. The ability to choose what to focus on, tolerate boredom, sit with hard problems, and follow a thread to completion \u2014 these skills get rarer as AI gets better at managing reward loops. Every product in this space either helps people maintain agency or profits from eroding it.',
      reflection: 'Think about your last 24 hours. How many of your actions were initiated by you versus triggered by a notification, recommendation, or feed?' },
    { id: 'ch2', title: 'The Reward Loop Problem', coreIdea: 'AI systems are increasingly optimized to manage your attention through reward loops.',
      content: 'Engagement metrics reward capture, not growth. When an app\u2019s revenue depends on time-on-screen, every design choice optimizes for dependency. The scroll is the slot machine. The notification is the nudge. The recommendation is the corridor. You\u2019re not the customer \u2014 you\u2019re the product being shaped.',
      reflection: 'Name one app you use where the business model would still work if you used it less.' },
    { id: 'ch3', title: 'Friction as a Feature', coreIdea: 'The instinct to remove friction is the instinct to remove thinking.',
      content: 'Every meaningful skill was built through friction \u2014 centering clay, learning an instrument, writing a first draft without autocomplete. The modern tech stack treats friction as a bug. But friction is how you build the muscle of choosing. Clay Village is designed around this principle: no likes, no feed, no algorithm. The map is physical. The spaces are bounded. You walk to where you want to go.',
      reflection: 'What\u2019s one thing you\u2019ve gotten worse at because a tool made it too easy?' },
    { id: 'ch4', title: 'The Slop Machine', coreIdea: 'The creator of this village built a tool that optimized engagement \u2014 and chose to kill it.',
      content: 'The X Reply App worked. It analyzed viral posts, generated optimized replies, and gamed the algorithm for attention. It was a slop machine \u2014 effective, profitable, and corrosive. Killing it wasn\u2019t about ethics as an abstract principle. It was about noticing what it was doing to the person building it. The moral decision is the brand. This village exists because that product was destroyed.',
      reflection: 'Have you ever built, used, or promoted something that worked but felt wrong? What did you do about it?' },
    { id: 'ch5', title: 'Making as Agency', coreIdea: 'Working with your hands is cognitive agency in physical form.',
      content: 'When you center clay on a wheel, you can\u2019t autocomplete the movement. Your hands have to learn. When a wall collapses, no AI can fix it \u2014 you wedge the clay and start again. Making is the purest friction practice because the material gives you immediate, honest feedback. This is why the village started with potters \u2014 not because pottery is trendy, but because it\u2019s the clearest example of agency-building through sustained, embodied attention.',
      reflection: 'When was the last time you made something with your hands where the result couldn\u2019t be faked?' },
    { id: 'ch6', title: 'The Seven Principles', coreIdea: 'The rules that govern this village \u2014 and any community that takes cognitive agency seriously.',
      content: null, // rendered as numbered list
      principles: [
        'The village is a place, not a platform.',
        'Friction is a feature.',
        'No engagement optimization. If a metric incentivizes addiction, remove the metric.',
        'Taste over speed.',
        'The moral decision is the brand.',
        'Potters first, makers second, everyone later.',
        'Revenue from choice, not capture.'
      ],
      reflection: 'Which principle feels most uncomfortable to you? That\u2019s probably the one worth sitting with.' },
    { id: 'ch7', title: 'Your Role', coreIdea: 'You\u2019re not a user. You\u2019re a resident.',
      content: 'The village doesn\u2019t have followers or subscribers. It has residents who make things, show up to events, sit at the bonfire, and contribute to the culture. A \u201Cproof of making\u201D is worth more here than any follower count. Your credential is your work \u2014 kiln hours, completed projects, real objects that exist in the world. The question isn\u2019t \u201Cwhat can this place do for me?\u201D It\u2019s \u201Cwhat will I make here?\u201D',
      reflection: 'What would you want your proof-of-making to be? Not what\u2019s impressive \u2014 what\u2019s honest.' },
  ];

  function getData() {
    const d = JSON.parse(localStorage.getItem(CA_KEY) || '{}');
    if (!d.completed) d.completed = [];
    if (!d.reflections) d.reflections = {};
    return d;
  }
  function saveData(d) { localStorage.setItem(CA_KEY, JSON.stringify(d)); }

  function isUnlocked(chId) {
    const idx = CA_CHAPTERS.findIndex(c => c.id === chId);
    if (idx === 0) return true;
    const data = getData();
    return data.completed.includes(CA_CHAPTERS[idx - 1].id);
  }
  function isCompleted(chId) { return getData().completed.includes(chId); }
  function allDone() { return getData().completed.length >= CA_CHAPTERS.length; }

  function renderOverview() {
    const el = document.getElementById('ca-overview');
    if (!el) return;
    const data = getData();
    const pct = Math.round((data.completed.length / CA_CHAPTERS.length) * 100);
    el.innerHTML = `<div class="ca-progress-label">${data.completed.length} of ${CA_CHAPTERS.length} chapters</div><div class="ca-progress"><div class="ca-progress-fill" style="width:${pct}%;"></div></div>`;
  }

  function renderChapters() {
    const el = document.getElementById('ca-chapters');
    if (!el) return;
    el.innerHTML = '';
    el.style.display = 'block';
    document.getElementById('ca-detail').classList.remove('active');

    if (allDone()) {
      el.innerHTML = `<div class="ca-complete-card"><div class="ca-complete-check">\u2713</div><div class="ca-complete-title">You\u2019ve walked the path</div><div class="ca-complete-text">This isn\u2019t the end \u2014 it\u2019s the lens. Everything in the village makes more sense now.</div><button class="ca-return-btn" onclick="document.getElementById('cognitive-agency-overlay').style.display='none';">Return to village</button></div>`;
      return;
    }

    CA_CHAPTERS.forEach((ch, i) => {
      const unlocked = isUnlocked(ch.id);
      const completed = isCompleted(ch.id);
      const card = document.createElement('div');
      card.className = 'ca-chapter' + (!unlocked ? ' ca-locked' : '') + (completed ? ' ca-completed' : '');
      let badgeClass = 'ca-badge';
      let badgeText = 'Ch ' + (i + 1);
      if (completed) badgeClass += ' ca-badge-done';
      else if (!unlocked) badgeClass += ' ca-badge-locked';

      card.innerHTML = `<div class="ca-chapter-top"><span class="${badgeClass}">${badgeText}</span><div><div class="ca-chapter-title">${ch.title}</div><div class="ca-chapter-idea">${ch.coreIdea}</div></div>${completed ? '<span class="ca-check">\u2713</span>' : (!unlocked ? '<span class="ca-lock">Locked</span>' : '')}</div>`;
      if (unlocked) card.addEventListener('click', () => renderDetail(ch.id));
      el.appendChild(card);
    });
  }

  function renderDetail(chId) {
    const ch = CA_CHAPTERS.find(c => c.id === chId);
    if (!ch) return;
    const data = getData();
    const completed = data.completed.includes(chId);
    const idx = CA_CHAPTERS.indexOf(ch);
    const savedReflection = data.reflections[chId] || '';

    document.getElementById('ca-chapters').style.display = 'none';
    const el = document.getElementById('ca-detail');
    el.classList.add('active');

    let contentHTML = '';
    if (ch.principles) {
      contentHTML = '<ol>' + ch.principles.map(p => '<li>' + p + '</li>').join('') + '</ol>';
    } else {
      contentHTML = '<p>' + ch.content + '</p>';
    }

    el.innerHTML = `
      <button class="ca-detail-back">\u2190 All chapters</button>
      <div style="margin-bottom:20px;"><span class="ca-badge">Ch ${idx + 1}</span></div>
      <div style="font-size:20px;font-weight:800;color:#e0f0ec;margin-bottom:6px;">${ch.title}</div>
      <div style="font-size:12px;color:rgba(42,138,116,0.5);margin-bottom:20px;">${ch.coreIdea}</div>
      <div class="ca-prose">${contentHTML}</div>
      <div class="ca-callout">${ch.reflection}</div>
      <textarea class="ca-textarea" id="ca-reflection-input" placeholder="Your reflection (optional)...">${savedReflection}</textarea>
      ${completed ? '<div style="text-align:center;color:#22c55e;font-weight:700;font-size:13px;padding:12px 0;">Understood</div>' : '<button class="ca-understood-btn" id="ca-understood-btn">I\u2019ve sat with this</button>'}
    `;

    el.querySelector('.ca-detail-back').addEventListener('click', () => {
      // Save reflection before going back
      const inp = document.getElementById('ca-reflection-input');
      if (inp) { const d = getData(); d.reflections[chId] = inp.value; saveData(d); }
      renderOverview();
      renderChapters();
    });

    const btn = el.querySelector('#ca-understood-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const d = getData();
        if (!d.completed.includes(chId)) d.completed.push(chId);
        const inp = document.getElementById('ca-reflection-input');
        if (inp) d.reflections[chId] = inp.value;
        if (d.completed.length >= CA_CHAPTERS.length) d.completedAt = new Date().toISOString();
        saveData(d);
        renderOverview();
        renderDetail(chId); // re-render to show "Understood" state
      });
    }

    // Auto-save reflection on input
    const reflInput = el.querySelector('#ca-reflection-input');
    if (reflInput) {
      reflInput.addEventListener('input', () => {
        const d = getData(); d.reflections[chId] = reflInput.value; saveData(d);
      });
    }
  }

  window.openCognitiveAgency = function() {
    const ov = document.getElementById('cognitive-agency-overlay');
    if (!ov) return;
    ov.style.display = 'flex';
    renderOverview();
    renderChapters();
    var _tc = document.getElementById('top-controls');
    var _vn = document.getElementById('village-name-label');
    if (_tc) _tc.style.display = 'none';
    if (_vn) _vn.style.display = 'none';
  };

  document.getElementById('ca-close').addEventListener('click', () => {
    document.getElementById('cognitive-agency-overlay').style.display = 'none';
    var _tc = document.getElementById('top-controls');
    var _vn = document.getElementById('village-name-label');
    if (_tc) _tc.style.display = '';
    if (_vn) _vn.style.display = '';
  });

  // Cognitive Agency is now opened from inside the School building
})();
