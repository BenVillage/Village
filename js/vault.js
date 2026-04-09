// ===== VAULT =====
(function() {
  /* ---------- helpers ---------- */
  function _isStudioOwner() {
    var role = typeof _deriveRole === 'function' ? _deriveRole() : 'guest';
    return role === 'founder' || role === 'citizen';
  }

  function _escV(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  function _fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
  }

  function _statCell(num, label) {
    return '<div class="vlt-stat"><div class="vlt-stat-num">' + num + '</div><div class="vlt-stat-label">' + label + '</div></div>';
  }

  function _pf(label, value, cls) {
    return '<div class="vlt-pf"><div class="vlt-pf-label">' + label + '</div><div class="vlt-pf-value' + (cls ? ' ' + cls : '') + '">' + _escV(value || '\u2014') + '</div></div>';
  }

  /* ---------- vault door visibility ---------- */
  var _origOpenSQ = window.openStudioQuarter;
  window.openStudioQuarter = function() {
    if (_origOpenSQ) _origOpenSQ();
    var door = document.getElementById('vault-door');
    if (door) door.style.display = _isStudioOwner() ? 'block' : 'none';
  };

  // Also hide when Studio Quarter closes
  var sqOv = document.getElementById('studio-quarter-overlay');
  if (sqOv) {
    var obs = new MutationObserver(function(muts) {
      muts.forEach(function(m) {
        if (m.attributeName === 'style' && sqOv.style.display === 'none') {
          var door = document.getElementById('vault-door');
          if (door) door.style.display = 'none';
        }
      });
    });
    obs.observe(sqOv, { attributes: true, attributeFilter: ['style'] });
  }

  /* ---------- data fetching ---------- */
  function fetchVaultData() {
    return new Promise(function(resolve) {
      var sp = typeof getSessionProfile === 'function' ? getSessionProfile() : null;
      var uid = typeof _presenceProfileId === 'function' ? _presenceProfileId() : null;
      var data = {
        profile: sp || {},
        practiceLog: [],
        processBoard: [],
        failureWall: [],
        memberSince: null,
        friends: 0,
        studioVisits: 0,
        messages: 0
      };

      if (!window._supabase || !uid) { resolve(data); return; }

      var vid = typeof _ACTIVE_VILLAGE_ID !== 'undefined' ? _ACTIVE_VILLAGE_ID : '02dc2b86-eb71-4fa8-bd11-5e0c397d25ae';
      var promises = [];

      // Practice log count
      promises.push(
        window._supabase.from('studio_practice_log').select('id,date,mood,text', { count: 'exact' })
          .eq('village_id', vid).eq('user_id', uid).order('created_at', { ascending: false }).limit(20)
          .then(function(r) { if (!r.error && r.data) { data.practiceLog = r.data; data.practiceCount = r.count || r.data.length; } })
      );

      // Process board posts
      promises.push(
        window._supabase.from('studio_process_board').select('id,text,created_at', { count: 'exact' })
          .eq('village_id', vid).eq('author_id', uid).order('created_at', { ascending: false }).limit(10)
          .then(function(r) { if (!r.error && r.data) { data.processBoard = r.data; data.processBoardCount = r.count || r.data.length; } })
      );

      // Failure wall entries
      promises.push(
        window._supabase.from('studio_failure_wall').select('id,failure_note,lesson_note,created_at', { count: 'exact' })
          .eq('village_id', vid).eq('author_id', uid).order('created_at', { ascending: false }).limit(10)
          .then(function(r) { if (!r.error && r.data) { data.failureWall = r.data; data.failureWallCount = r.count || r.data.length; } })
      );

      // Member since date
      promises.push(
        window._supabase.from('village_members').select('created_at')
          .eq('auth_id', uid).eq('village_id', vid).limit(1).single()
          .then(function(r) { if (!r.error && r.data) data.memberSince = r.data.created_at; })
      );

      // Friends count
      promises.push(
        window._supabase.from('friends').select('id', { count: 'exact' })
          .eq('village_id', vid).or('user_id.eq.' + uid + ',friend_id.eq.' + uid)
          .then(function(r) { data.friends = (r.count || (r.data ? r.data.length : 0)); })
          .catch(function() { data.friends = window._friendsSet ? window._friendsSet.size : 0; })
      );

      // Message thread count
      promises.push(
        window._supabase.from('dm_messages').select('id', { count: 'exact' })
          .eq('village_id', vid).eq('sender_id', uid)
          .then(function(r) { data.messages = r.count || (r.data ? r.data.length : 0); })
          .catch(function() { data.messages = 0; })
      );

      // Gallery pieces count (for token milestone)
      promises.push(
        window._supabase.from('gallery_pieces').select('id', { count: 'exact' })
          .eq('village_id', vid).eq('user_id', uid)
          .then(function(r) { data.galleryCount = r.count || (r.data ? r.data.length : 0); })
          .catch(function() { data.galleryCount = 0; })
      );

      // Library journals count (for token milestone)
      promises.push(
        window._supabase.from('library_journals').select('id', { count: 'exact' })
          .eq('village_id', vid).eq('user_id', uid)
          .then(function(r) { data.journalCount = r.count || (r.data ? r.data.length : 0); })
          .catch(function() { data.journalCount = 0; })
      );

      // Bonfire messages count (for token milestone)
      promises.push(
        window._supabase.from('bonfire_messages').select('id', { count: 'exact' })
          .eq('village_id', vid).eq('user_id', uid)
          .then(function(r) { data.bonfireCount = r.count || (r.data ? r.data.length : 0); })
          .catch(function() { data.bonfireCount = 0; })
      );

      // Token status
      promises.push(
        window._supabase.from('village_tokens').select('*')
          .eq('village_id', vid).eq('user_id', uid).limit(1).single()
          .then(function(r) { data.token = r.error ? null : r.data; })
          .catch(function() { data.token = null; })
      );

      Promise.all(promises).then(function() { resolve(data); }).catch(function() { resolve(data); });
    });
  }

  /* ---------- render ---------- */
  function renderVault(data) {
    var el = document.getElementById('vault-content');
    if (!el) return;
    var p = data.profile || {};
    var name = p.villageName || p.name || 'Unnamed';
    var practice = p.mainPractice || 'clay';
    var level = p.level || 'beginner';
    var years = p.yearsPracticing || 0;
    var city = p.city || '';
    var country = p.country || '';
    var location = [city, country].filter(Boolean).join(', ');
    var memberDate = _fmtDate(data.memberSince);
    var logCount = data.practiceCount || data.practiceLog.length;
    var pbCount = data.processBoardCount || data.processBoard.length;
    var fwCount = data.failureWallCount || data.failureWall.length;
    var friendCount = data.friends || 0;

    var html = '';

    // Hero section with rotating circles
    html += '<div class="vlt-hero">';
    html += '<div class="vlt-hero-circles">';
    for (var ci = 1; ci <= 5; ci++) {
      var sz = 80 + ci * 80;
      html += '<div class="c" style="width:' + sz + 'px;height:' + sz + 'px;animation-duration:' + (40 + ci * 15) + 's;animation-direction:' + (ci % 2 === 0 ? 'reverse' : 'normal') + ';"></div>';
    }
    html += '</div>';
    html += '<div class="vlt-hero-label">VILLAGE VAULT</div>';
    html += '<div class="vlt-hero-name">' + _escV(name) + '</div>';
    html += '<div class="vlt-hero-sub">' + _escV(practice) + ' \u00B7 ' + _escV(level) + (years > 0 ? ' \u00B7 ' + years + ' years' : '') + '</div>';
    var _cardSlug = encodeURIComponent((p.villageName || p.name || '').toLowerCase().trim());
    if (_cardSlug) {
      html += '<a href="/member/' + _cardSlug + '" target="_blank" style="display:inline-block;margin-top:16px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(200,168,75,0.6);text-decoration:none;border:1px solid rgba(200,168,75,0.2);border-radius:20px;padding:5px 14px;transition:all 0.2s;" onmouseover="this.style.color=\'#c8a84b\';this.style.borderColor=\'rgba(200,168,75,0.5)\'" onmouseout="this.style.color=\'rgba(200,168,75,0.6)\';this.style.borderColor=\'rgba(200,168,75,0.2)\'">View identity card \u2197</a>';
    }
    html += '</div>';

    // Stats row
    html += '<div class="vlt-stats">';
    html += _statCell(logCount, 'Practice logs');
    html += _statCell(pbCount, 'Process posts');
    html += _statCell(fwCount, 'Failures shared');
    html += _statCell(friendCount, 'Connections');
    html += '</div>';

    // Token / Passport section — layout depends on token status
    var tokenStatus = (data.token && data.token.status) || 'locked';
    if (tokenStatus === 'granted') {
      // Full passport view — coin flip (token ↔ profile photo)
      var _photoUrl = p.photo || p.avatar_url || p.imageUrl || '';
      var _initial = (name || '?').charAt(0).toUpperCase();
      html += '<div class="vtj-granted">';
      html += '<div class="vtj-granted-token" id="vault-token-trigger">';
      html += '<div class="vtj-coin" id="vtj-coin">';
      html += '<div class="vtj-coin-face vtj-coin-front"><video id="vault-token-video" autoplay loop muted playsinline preload="auto"><source src="Token.mp4" type="video/mp4"><source src="Token.mov" type="video/quicktime"></video></div>';
      html += '<div class="vtj-coin-face vtj-coin-back">';
      if (_photoUrl) {
        html += '<div class="vtj-coin-back-photo" style="background-image:url(\'' + _escV(_photoUrl) + '\')"></div>';
      } else {
        html += '<div class="vtj-coin-back-letter">' + _escV(_initial) + '</div>';
      }
      html += '</div></div>';
      html += '<div class="vtj-key-wrap">';
      html += '<div class="vlt-token-hint" style="font-size:11px;color:#4a3008;letter-spacing:0.04em;">tap to flip</div>';
      html += '</div>';
      html += '<div class="vtj-key-wrap" style="margin-top:8px;">';
      html += '<div class="vtj-key" id="vtj-key" draggable="true">\uD83D\uDD11 drag to inspect</div>';
      html += '</div>';
      html += '</div>';
      html += '<div>';
      html += _pf('Village name', name, 'big');
      html += _pf('Location', location || 'Undisclosed');
      html += _pf('Practice', practice);
      html += _pf('Level', level, 'active');
      html += _pf('Member since', memberDate || 'Today');
      if (data.token.granted_message || data.token.granted_by_name) {
        html += '<div class="vtj-granted-message">';
        if (data.token.granted_message) html += '<div class="vtj-granted-quote">\u201C' + _escV(data.token.granted_message) + '\u201D</div>';
        if (data.token.granted_by_name) html += '<div class="vtj-granted-by">Confirmed by ' + _escV(data.token.granted_by_name) + (data.token.granted_at ? ' \u00B7 ' + _fmtDate(data.token.granted_at) : '') + '</div>';
        html += '</div>';
      }
      html += '<div class="vtj-travel-badge">\u25C6 Travel pass active</div>';
      // Founder-only: reset for ceremony testing
      if (window._villageRole === 'founder' || window._IS_LOCAL) {
        html += '<div style="margin-top:24px;"><button id="vtj-reset-test-btn" style="background:none;border:1px solid rgba(200,168,75,0.25);color:#4a3008;font-size:11px;padding:5px 10px;border-radius:6px;cursor:pointer;font-family:inherit;letter-spacing:0.04em;">↺ Reset for testing</button></div>';
      }
      html += '</div>';
      html += '</div>';
    } else {
      // Token journey — milestone checklist
      html += _tokenJourneyHTML(data, tokenStatus);
    }

    // Manifesto
    html += '<div class="vlt-manifesto">';

    // Section 1
    html += '<div class="vlt-man-section">';
    html += '<div class="vlt-man-heading">You have proof now.</div>';
    html += '<div class="vlt-man-body">For the first time in human history, a master potter and an AI-generated ceramic are indistinguishable in a photograph. The market cannot tell the difference. The algorithm cannot tell the difference. Soon, most people will not be able to tell the difference.</div>';
    html += '<div class="vlt-man-body" style="margin-top:16px;">And then something worse happens: people stop believing humans can be that good. When someone shows extraordinary skill, the assumption becomes "they used AI." Fandom dies. Mastery becomes suspect. The very concept of human excellence erodes.</div>';
    html += '<div class="vlt-man-quote">The problem is not that AI is better. The problem is that AI produces so much that real skill becomes invisible.</div>';
    html += '<div class="vlt-man-body">This token is your answer. Not an argument. Not a watermark. A three-year record of someone becoming. Every day you showed up is in here. Every piece you made. Every conversation at the bonfire. Every time you sat in mond\u014D and broke through something. The proof of work is not a certificate. It is a life being lived, documented, and permanently yours.</div>';
    html += '</div>';

    html += '<hr class="vlt-man-sep">';

    // Section 2
    html += '<div class="vlt-man-section">';
    html += '<div class="vlt-man-heading">What an NFT actually is.</div>';
    html += '<div class="vlt-man-body">Forget everything you have heard. An NFT is a record that cannot be edited, deleted, or faked. It sits on a public network that no company controls. It proves that something is real.</div>';
    html += '<div class="vlt-man-body" style="margin-top:16px;">Your village passport is an NFT. It records: who you are, where you belong, how long you have been here, what you have made, and how you have grown. It is soulbound, which means it cannot be sold or transferred. It is yours and only yours. If the platform disappears tomorrow, the record survives. That is the entire point.</div>';
    html += '<div class="vlt-man-quote">Your presence here accumulates real value that travels with you forever.</div>';
    html += '</div>';

    html += '<hr class="vlt-man-sep">';

    // Section 3
    html += '<div class="vlt-man-section">';
    html += '<div class="vlt-man-heading">Why this matters now, specifically.</div>';
    html += '<div class="vlt-man-body">Millions of people are about to lose their jobs to AI. Many will turn to the arts. The market will be flooded. And then something worse will happen: when someone shows extraordinary skill, the assumption will become "they used AI." Mastery will become suspect. The very concept of human excellence will erode.</div>';
    html += '<div class="vlt-man-body" style="margin-top:16px;">Japan has a concept called Living National Treasure. A person whose skill is so rare and so human that the nation itself protects it. The village is building the digital version of this. Not through government decree, but through cryptographic proof. Your passport says: this person was here. They made these things. They did the work. No machine did it for them. The record is permanent and the record is true.</div>';
    html += '<div class="vlt-man-quote">When culture dreams of a destination, engineering finds the path.</div>';
    html += '</div>';

    html += '<div class="vlt-man-kanji">\u4E00\u671F\u4E00\u4F1A</div>';
    html += '<div class="vlt-man-kanji-sub">ichi-go ichi-e \u2014 this moment, only once</div>';
    html += '</div>';

    // Activity record
    html += _buildRecordList('PRACTICE LOG', data.practiceLog, function(item) {
      return (item.mood ? item.mood + ' ' : '') + (item.text || 'Session logged');
    }, function(item) { return _fmtDate(item.date); });

    html += _buildRecordList('PROCESS BOARD', data.processBoard, function(item) {
      return item.text || 'Post shared';
    }, function(item) { return _fmtDate(item.created_at); });

    html += _buildRecordList('FAILURE WALL', data.failureWall, function(item) {
      return (item.failure_note || 'Failure noted') + (item.lesson_note ? ' \u2014 ' + item.lesson_note : '');
    }, function(item) { return _fmtDate(item.created_at); });

    // Download
    html += '<div class="vlt-download"><button class="vlt-download-btn" id="vault-download-btn">DOWNLOAD RECORD</button></div>';

    // Footer
    html += '<div class="vlt-footer">Clay Village \u00B7 ' + new Date().getFullYear() + ' \u00B7 Your record is yours alone</div>';

    el.innerHTML = html;

    // Start token video + wire coin flip click
    var tokenVid = document.getElementById('vault-token-video');
    if (tokenVid) tokenVid.play().catch(function() {});
    var vtjCoin = document.getElementById('vtj-coin');
    if (vtjCoin) {
      vtjCoin.addEventListener('click', function(e) {
        e.stopPropagation();
        vtjCoin.classList.toggle('vtj-coin-flipped');
      });
    }
    // Key drag → drop on coin → open token modal
    var vtjKey = document.getElementById('vtj-key');
    if (vtjKey && vtjCoin) {
      // HTML5 drag events
      vtjKey.addEventListener('dragstart', function(e) {
        vtjKey.classList.add('vtj-key-dragging');
        e.dataTransfer.setData('text/plain', 'key');
        e.dataTransfer.effectAllowed = 'move';
      });
      vtjKey.addEventListener('dragend', function() { vtjKey.classList.remove('vtj-key-dragging'); vtjCoin.classList.remove('vtj-coin-drop-target'); });
      vtjCoin.addEventListener('dragover', function(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; vtjCoin.classList.add('vtj-coin-drop-target'); });
      vtjCoin.addEventListener('dragleave', function() { vtjCoin.classList.remove('vtj-coin-drop-target'); });
      vtjCoin.addEventListener('drop', function(e) {
        e.preventDefault();
        vtjCoin.classList.remove('vtj-coin-drop-target');
        vtjKey.classList.remove('vtj-key-dragging');
        // Unlock animation then open modal
        vtjCoin.classList.add('vtj-coin-unlocking');
        setTimeout(function() { vtjCoin.classList.remove('vtj-coin-unlocking'); openTokenModal(data); }, 600);
      });
      // Touch fallback — tap key to open modal directly (drag is hard on mobile)
      vtjKey.addEventListener('click', function(e) {
        e.stopPropagation();
        vtjCoin.classList.add('vtj-coin-unlocking');
        setTimeout(function() { vtjCoin.classList.remove('vtj-coin-unlocking'); openTokenModal(data); }, 400);
      });
    }

    // Wire request button (exists in journey view)
    var reqBtn = document.getElementById('vtj-request-btn');
    if (reqBtn) reqBtn.addEventListener('click', function() { _requestToken(data); });

    // Wire test-reset button (founder only — for ceremony testing)
    var resetBtn = document.getElementById('vtj-reset-test-btn');
    if (resetBtn) resetBtn.addEventListener('click', async function() {
      resetBtn.disabled = true; resetBtn.textContent = 'Resetting\u2026';
      var vid = typeof _ACTIVE_VILLAGE_ID !== 'undefined' ? _ACTIVE_VILLAGE_ID : '';
      await window._supabase.from('village_tokens').update({
        status: 'requested',
        requested_at: new Date().toISOString(),
        granted_by: null, granted_by_name: null,
        granted_at: null, granted_message: null
      }).eq('village_id', vid).eq('user_id', window._sbAuthUid);
      window._myTokenStatus = 'requested';
      // Clear celebration flag so next grant triggers ceremony
      localStorage.removeItem(vKey('tokenCelebrated'));
      fetchVaultData().then(function(d) { renderVault(d); });
    });

    // Wire download
    var dlBtn = document.getElementById('vault-download-btn');
    if (dlBtn) dlBtn.addEventListener('click', function() { downloadVaultRecord(data); });
  }

  function _buildRecordList(label, items, textFn, dateFn) {
    if (!items || items.length === 0) return '';
    var html = '<div class="vlt-record">';
    html += '<div class="vlt-record-label">' + label + '</div>';
    items.forEach(function(item) {
      var text = textFn(item);
      if (text.length > 120) text = text.substring(0, 117) + '\u2026';
      html += '<div class="vlt-record-item">';
      html += '<div class="vlt-record-dot"></div>';
      html += '<div class="vlt-record-text">' + _escV(text) + '</div>';
      html += '<div class="vlt-record-date">' + _escV(dateFn(item)) + '</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  /* ---------- token animation ---------- */
  var _tokenRAF = null;

  function startTokenAnimation(canvasId, data) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var cx = w / 2, cy = h / 2;
    var p = data.profile || {};
    var name = p.villageName || p.name || '?';
    var level = p.level || 'beginner';
    var practice = p.mainPractice || 'clay';

    // Hash name for unique angles
    var hash = 0;
    for (var i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;

    var startTime = Date.now();
    function draw() {
      var t = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cx, cy) - 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200,168,75,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Rotating inner ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.3 + (hash % 100) * 0.01);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(cx, cy) - 16, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200,168,75,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tick marks
      for (var ti = 0; ti < 12; ti++) {
        var angle = (ti / 12) * Math.PI * 2;
        var r1 = Math.min(cx, cy) - 16;
        var r2 = r1 - 6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
        ctx.strokeStyle = 'rgba(200,168,75,' + (0.1 + 0.1 * Math.sin(t + ti)) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Center kanji
      ctx.save();
      ctx.translate(cx, cy);
      ctx.font = 'bold ' + (w > 150 ? '36' : '24') + 'px "Noto Sans JP", Georgia, serif';
      ctx.fillStyle = '#f0d060';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.8 + 0.2 * Math.sin(t * 0.5);
      ctx.fillText('\u571F', 0, -4);
      ctx.restore();

      // Practice text at bottom
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(200,168,75,0.3)';
      ctx.textAlign = 'center';
      ctx.fillText(practice.toUpperCase(), cx, h - 10);

      _tokenRAF = requestAnimationFrame(draw);
    }
    draw();
  }

  function stopTokenAnimation() {
    if (_tokenRAF) { cancelAnimationFrame(_tokenRAF); _tokenRAF = null; }
  }

  /* ---------- token modal ---------- */
  function openTokenModal(data) {
    var modal = document.getElementById('vault-token-modal');
    if (!modal) return;
    modal.classList.add('open');

    // Force video play (autoplay may not fire after display:none toggle)
    var vtmVid = document.getElementById('vtm-token-sm');
    if (vtmVid) { vtmVid.load(); vtmVid.play().catch(function(){}); }

    // Terminal typing effect
    var terminal = document.getElementById('vtm-terminal');
    var finalEl = document.getElementById('vtm-final');
    if (terminal) terminal.textContent = '';
    if (finalEl) finalEl.classList.remove('visible');

    var p = data.profile || {};
    var name = p.villageName || p.name || 'Unknown';
    var lines = [
      '> VAULT TOKEN INSPECTION',
      '> ========================',
      '',
      '> holder:    ' + name,
      '> practice:  ' + (p.mainPractice || 'clay'),
      '> level:     ' + (p.level || 'beginner'),
      '> years:     ' + (p.yearsPracticing || 0),
      '> location:  ' + ([p.city, p.country].filter(Boolean).join(', ') || 'undisclosed'),
      '',
      '> issued:    ' + _fmtDate(data.memberSince) || 'today',
      '> logs:      ' + (data.practiceCount || data.practiceLog.length),
      '> posts:     ' + (data.processBoardCount || data.processBoard.length),
      '> failures:  ' + (data.failureWallCount || data.failureWall.length),
      '> bonds:     ' + (data.friends || 0),
      '',
      '> status:    AUTHENTIC',
      '> this token cannot be traded or transferred.',
      '> it exists because you showed up.'
    ];

    var lineIdx = 0, charIdx = 0;
    var currentText = '';
    function typeChar() {
      if (lineIdx >= lines.length) {
        if (finalEl) setTimeout(function() { finalEl.classList.add('visible'); }, 600);
        return;
      }
      var line = lines[lineIdx];
      if (charIdx >= line.length) {
        currentText += '\n';
        lineIdx++;
        charIdx = 0;
        if (terminal) terminal.textContent = currentText;
        setTimeout(typeChar, line === '' ? 100 : 40);
        return;
      }
      currentText += line[charIdx];
      charIdx++;
      if (terminal) terminal.textContent = currentText;
      setTimeout(typeChar, 18 + Math.random() * 12);
    }
    setTimeout(typeChar, 400);
  }

  function closeTokenModal() {
    var modal = document.getElementById('vault-token-modal');
    if (modal) modal.classList.remove('open');
  }

  /* ---------- download ---------- */
  function downloadVaultRecord(data) {
    var p = data.profile || {};
    var name = p.villageName || p.name || 'Unknown';
    var lines = [];
    lines.push('CLAY VILLAGE \u2014 VAULT RECORD');
    lines.push('================================');
    lines.push('');
    lines.push('Holder:        ' + name);
    lines.push('Practice:      ' + (p.mainPractice || 'clay'));
    lines.push('Level:         ' + (p.level || 'beginner'));
    lines.push('Years:         ' + (p.yearsPracticing || 0));
    lines.push('Location:      ' + ([p.city, p.country].filter(Boolean).join(', ') || 'Undisclosed'));
    lines.push('Member since:  ' + (_fmtDate(data.memberSince) || 'Today'));
    lines.push('');
    lines.push('--- PRACTICE LOG ---');
    (data.practiceLog || []).forEach(function(item) {
      lines.push(_fmtDate(item.date) + '  ' + (item.mood || '') + '  ' + (item.text || 'Session'));
    });
    lines.push('');
    lines.push('--- PROCESS BOARD ---');
    (data.processBoard || []).forEach(function(item) {
      lines.push(_fmtDate(item.created_at) + '  ' + (item.text || 'Post'));
    });
    lines.push('');
    lines.push('--- FAILURE WALL ---');
    (data.failureWall || []).forEach(function(item) {
      lines.push(_fmtDate(item.created_at) + '  ' + (item.failure_note || '') + (item.lesson_note ? ' \u2014 ' + item.lesson_note : ''));
    });
    lines.push('');
    lines.push('================================');
    lines.push('Downloaded ' + new Date().toISOString().split('T')[0]);
    lines.push('Your record is yours alone.');

    var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'clay-village-vault-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ---------- token journey helpers ---------- */

  var _TOKEN_MILESTONES = [
    { key: 'profile',  label: 'Complete your maker profile',   hint: 'Photo, bio, and main practice filled in' },
    { key: 'log',      label: 'Write your first practice log', hint: 'Record a session in the studio' },
    { key: 'process',  label: 'Post to the Process Board',     hint: 'Share what you are currently making' },
    { key: 'piece',    label: 'Add a piece to the Gallery',    hint: 'Show your work to the village' },
    { key: 'journal',  label: 'Write in the Library',          hint: 'Contribute a journal entry or process note' },
    { key: 'bonfire',  label: 'Speak at the Bonfire',          hint: 'Post five messages in the communal fire' }
  ];

  function _checkAchievements(data) {
    var p = data.profile || {};
    return {
      profile:  !!(p.photo && p.bio && p.mainPractice),
      log:      (data.practiceCount  || 0) >= 1,
      process:  (data.processBoardCount || 0) >= 1,
      piece:    (data.galleryCount   || 0) >= 1,
      journal:  (data.journalCount   || 0) >= 1,
      bonfire:  (data.bonfireCount   || 0) >= 5
    };
  }

  function _tokenJourneyHTML(data, status) {
    var achievements = _checkAchievements(data);
    var doneCount = Object.values(achievements).filter(Boolean).length;
    var total = _TOKEN_MILESTONES.length;
    var allDone = doneCount === total;
    var html = '<div class="vtj-section">';

    if (status === 'requested') {
      html += '<div style="text-align:center;margin-bottom:32px;">';
      html += '<video autoplay loop muted playsinline preload="auto" width="140" height="140" style="border-radius:50%;object-fit:cover;opacity:0.45;border:2px solid rgba(200,168,75,0.3);box-shadow:0 0 40px rgba(200,168,75,0.15);"><source src="Token.mp4" type="video/mp4"><source src="Token.mov" type="video/quicktime"></video>';
      html += '</div>';
      html += '<div class="vtj-heading" style="text-align:center;">Awaiting confirmation</div>';
      html += '<div class="vtj-sub" style="text-align:center;">All milestones complete. The founders have been notified and are reviewing your work. This cannot be rushed — they need to know you are real.</div>';
      html += '<div class="vtj-waiting" style="text-align:center;margin-top:24px;"><div class="vtj-waiting-dot"></div><div class="vtj-waiting-label" style="margin-top:10px;">Confirmation pending</div></div>';
    } else {
      html += '<div class="vtj-heading">Earn your token</div>';
      if (allDone) {
        html += '<div class="vtj-sub">You have completed every milestone. Request confirmation from the founders. They will review your work and — when satisfied — grant your token.</div>';
      } else {
        html += '<div class="vtj-sub">The token is not given. It is earned. Complete these milestones, then the founders of Clay Village will confirm your work and grant your pass.</div>';
      }
    }

    // Progress bar
    html += '<div class="vtj-progress-bar"><div class="vtj-progress-fill" style="width:' + Math.round(doneCount / total * 100) + '%;"></div></div>';

    // Milestone list
    html += '<div class="vtj-milestones">';
    _TOKEN_MILESTONES.forEach(function(m) {
      var done = achievements[m.key];
      html += '<div class="vtj-milestone' + (done ? ' done' : '') + '">';
      html += '<div class="vtj-milestone-check"></div>';
      html += '<div class="vtj-milestone-info">';
      html += '<div class="vtj-milestone-label">' + m.label + '</div>';
      if (!done) html += '<div class="vtj-milestone-hint">' + m.hint + '</div>';
      html += '</div></div>';
    });
    html += '</div>';

    if (status !== 'requested') {
      if (allDone) {
        html += '<button class="vtj-request-btn" id="vtj-request-btn">Request token confirmation \u2192</button>';
      } else {
        html += '<button class="vtj-request-btn" id="vtj-request-btn" disabled>' + doneCount + ' of ' + total + ' milestones complete</button>';
      }
    }

    html += '</div>';
    return html;
  }

  async function _requestToken(data) {
    if (!window._supabase || !window._sbAuthUid) return;
    var btn = document.getElementById('vtj-request-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Requesting\u2026'; }
    var vid = typeof _ACTIVE_VILLAGE_ID !== 'undefined' ? _ACTIVE_VILLAGE_ID : '';
    var sp = typeof getSessionProfile === 'function' ? getSessionProfile() : {};
    var name = sp.villageName || sp.name || 'A maker';
    var achievements = _checkAchievements(data);
    try {
      await window._supabase.from('village_tokens').upsert({
        village_id: vid, user_id: window._sbAuthUid,
        display_name: name, status: 'requested',
        achievements: achievements,
        requested_at: new Date().toISOString()
      }, { onConflict: 'village_id,user_id' });
      // DM the founder — someone is requesting their token
      try {
        var { data: founders } = await window._supabase
          .from('village_members').select('auth_id')
          .eq('village_id', vid).eq('role', 'founder');
        if (founders && founders.length) {
          founders.forEach(function(f) {
            window._supabase.from('direct_messages').insert({
              village_id: vid, sender_id: window._sbAuthUid,
              recipient_id: f.auth_id,
              message: name + ' has completed all milestones and is requesting their village token. Review in the Observatory \u2192 Token Requests.'
            }).then(function(){}).catch(function(){});
          });
        }
      } catch(_fe) {}
      // Re-render vault to show waiting state
      fetchVaultData().then(function(d) { renderVault(d); });
    } catch(err) {
      if (btn) { btn.disabled = false; btn.textContent = 'Request token confirmation \u2192'; }
    }
  }

  /* ---------- celebration ---------- */
  var _tcParticleTimer = null;
  function _spawnParticles(container) {
    if (_tcParticleTimer) clearInterval(_tcParticleTimer);
    container.innerHTML = '';
    var count = 0;
    _tcParticleTimer = setInterval(function() {
      if (count > 40) { clearInterval(_tcParticleTimer); _tcParticleTimer = null; return; }
      var p = document.createElement('div');
      p.className = 'tc-particle';
      var sz = 4 + Math.random() * 10;
      p.style.width = sz + 'px'; p.style.height = sz + 'px';
      p.style.left = (10 + Math.random() * 80) + '%';
      p.style.bottom = '-20px';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      container.appendChild(p);
      setTimeout(function() { if (p.parentNode) p.remove(); }, 7000);
      count++;
    }, 150);
  }

  function _openTokenCelebration(tokenRow, memberName) {
    var el = document.getElementById('token-celebration');
    if (!el) return;
    // Reset staged classes
    el.classList.remove('tc-stage-1');
    document.getElementById('tc-name').textContent = memberName || 'Maker';
    var msg = tokenRow.granted_message || 'You have shown up, made things, and contributed to this village. That is real. Your token is real.';
    document.getElementById('tc-message').textContent = '\u201C' + msg + '\u201D';
    document.getElementById('tc-from').textContent = 'Confirmed by ' + (tokenRow.granted_by_name || 'the founders') + ' of Clay Village';
    var vid = document.getElementById('tc-video');
    if (vid) { vid.load(); vid.play().catch(function(){}); }
    // Spawn particles
    var particles = document.getElementById('tc-particles');
    if (particles) _spawnParticles(particles);
    el.classList.add('open');
    // Staged entrance — token pops first, text cascades after
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { el.classList.add('tc-stage-1'); });
    });
    // Close handler — vault is already open underneath
    var closeBtn = document.getElementById('tc-close');
    if (closeBtn) closeBtn.onclick = function() {
      el.classList.remove('open', 'tc-stage-1');
      if (_tcParticleTimer) { clearInterval(_tcParticleTimer); _tcParticleTimer = null; }
      if (particles) particles.innerHTML = '';
      // Vault is already rendered underneath — just scroll to top
      var vc = document.getElementById('vault-content');
      if (vc) vc.scrollTop = 0;
    };
  }
  window._openTokenCelebration = _openTokenCelebration;

  /* ---------- open / close vault ---------- */
  window.openVault = function openVault() {
    var ov = document.getElementById('vault-overlay');
    if (!ov) return;
    ov.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Show loading, fetch data, render
    var content = document.getElementById('vault-content');
    if (content) content.innerHTML = '<div style="text-align:center;padding:200px 0;"><span class="vlt-loading"></span></div>';
    fetchVaultData().then(function(data) {
      // Cache token status for position broadcast
      window._myTokenStatus = (data.token && data.token.status) || 'locked';
      // Update map avatar coin flip if token just became granted
      if (window._myTokenStatus === 'granted' && typeof window._setupAvatarCoinFlip === 'function') {
        window._setupAvatarCoinFlip();
      }
      // First-time seeing granted? → fire celebration BEFORE showing vault
      var tokenStatus = (data.token && data.token.status) || 'locked';
      var celebKey = vKey('tokenCelebrated');
      if (tokenStatus === 'granted' && !localStorage.getItem(celebKey)) {
        localStorage.setItem(celebKey, '1');
        var sp = typeof getSessionProfile === 'function' ? getSessionProfile() : {};
        var celebName = sp.villageName || sp.name || 'Maker';
        _openTokenCelebration(data.token, celebName);
        // Render vault underneath — it'll be visible after celebration closes
        renderVault(data);
        return;
      }
      renderVault(data);
    });
  }

  function closeVault() {
    var ov = document.getElementById('vault-overlay');
    if (ov) ov.classList.remove('open');
    document.body.style.overflow = '';
    stopTokenAnimation();
  }

  /* ---------- wire events ---------- */
  var doorEl = document.getElementById('vault-door');
  if (doorEl) doorEl.addEventListener('click', openVault);

  var closeBtn = document.getElementById('vault-close');
  if (closeBtn) closeBtn.addEventListener('click', closeVault);

  var vtmClose = document.getElementById('vtm-close');
  if (vtmClose) vtmClose.addEventListener('click', closeTokenModal);

  // Escape key closes vault or token modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var tokenModal = document.getElementById('vault-token-modal');
      if (tokenModal && tokenModal.classList.contains('open')) { closeTokenModal(); return; }
      var vaultOv = document.getElementById('vault-overlay');
      if (vaultOv && vaultOv.classList.contains('open')) { closeVault(); }
    }
  });

  // Expose for external access
  window.openVault = openVault;
  window.closeVault = closeVault;
})();
