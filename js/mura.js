// ===== SUPABASE — MURA'S MEMORY =====
const _sb = supabase.createClient(
  'https://fokujzwgqtifpbmmhdot.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZva3VqendncXRpZnBibW1oZG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzM0OTIsImV4cCI6MjA5MDcwOTQ5Mn0.Tk8Y4lH0T4EUA7U4Lb22xeFyJAt4ha2CEHG_Idibux8'
);

// Map internal profile IDs to Mura member IDs
function getMuraId() {
  const p = window.playerProfile || (window.profiles || []).find(pr => pr.id === 'admin');
  if (!p) return 'profile-unknown';
  const map = { 'user1':'profile-maya','user2':'profile-james','user-ben':'profile-ben','admin':'profile-ben' };
  return map[p.id] || 'profile-' + (p.name || p.id).toLowerCase().replace(/\s+/g,'-');
}

// Silent fire-and-forget log — Mura's memory
function logToMura(entry) {
  const content = entry.content || '';
  const record = {
    member_id:       entry.member_id || getMuraId(),
    building:        entry.building,
    entry_type:      entry.entry_type,
    content:         content,
    timestamp:       entry.timestamp || new Date().toISOString(),
    word_count:      entry.word_count != null ? entry.word_count : content.trim().split(/\s+/).filter(Boolean).length,
    tags:            entry.tags || [],
    mura_triggered:  entry.mura_triggered  || false,
    mura_response:   entry.mura_response   || null,
    member_responded:entry.member_responded|| false,
    member_response: entry.member_response || null,
  };
  _sb.from('member_language').insert(record).then(({ error }) => {
    if (error) console.warn('[Mura]', error.message);
  });
}

// One-time migration of 44 seeded entries with original timestamps
function migrateMuraDatabase() {
  if (localStorage.getItem('mura_migration_v1_done')) return;
  const entries = [
    // ── Maya ──────────────────────────────────────────────────────────
    { member_id:'profile-maya', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-01-03T09:14:00Z', word_count:34,  tags:['identity','platform','relief'],        content:'First day. This feels different from everywhere else I\'ve tried. No follower count visible. I didn\'t realise how much that number was affecting me until it wasn\'t there.' },
    { member_id:'profile-maya', building:'library',  entry_type:'process_note', timestamp:'2026-01-05T14:32:00Z', word_count:54,  tags:['hands','material','uncertainty','time','repetition'], content:'Been throwing mugs for six years. Still can\'t get the handle attachment right every time. The clay remembers stress in ways I don\'t fully understand. I score, I slip, I press — and sometimes it holds and sometimes it doesn\'t. Eight years in and it still feels like asking permission.' },
    { member_id:'profile-maya', building:'studio',   entry_type:'process_note', timestamp:'2026-01-09T11:20:00Z', word_count:33,  tags:['selling','identity','loss','production'], content:'Made thirty mugs today. Sold twelve before they were even fired. That used to feel good. Today it just felt like work. I don\'t know when that changed.' },
    { member_id:'profile-maya', building:'gallery',  entry_type:'gallery_post', timestamp:'2026-01-12T16:45:00Z', word_count:18,  tags:['hand_building','vulnerability','asymmetry'], mura_triggered:true, mura_response:'ようこそ。\nWelcome.\n\nYou found your way here. That already means something.\n\nTake your time.', member_responded:false, content:'First piece posted here. A hand-built bowl. Asymmetric. I usually don\'t post the asymmetric ones.' },
    { member_id:'profile-maya', building:'library',  entry_type:'process_note', timestamp:'2026-01-15T10:08:00Z', word_count:65,  tags:['hands','body','control','surrender','humility','material'], content:'Hand building and wheel throwing use completely different muscles. Not just physically — mentally. Wheel throwing is about control, about centering, about negotiating with centrifugal force. Hand building is about surrender. You push and the clay pushes back and you have to decide how much to fight it. I\'ve been throwing for eight years and I still find hand building humbling.' },
    { member_id:'profile-maya', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-01-18T20:33:00Z', word_count:18,  tags:['teaching','james','imperfection'], content:'James — your coil pot from yesterday. The unevenness at the top is not a mistake. Don\'t fix it.' },
    { member_id:'profile-maya', building:'studio',   entry_type:'failure',      timestamp:'2026-01-22T15:17:00Z', word_count:50,  tags:['failure','kiln','time','rushing','loss','repetition'], content:'Lost a whole batch today. Twelve pieces. The kiln ran too hot and I didn\'t catch it. Eight years and I still make this mistake. The worst part isn\'t the pieces — it\'s the three weeks of work. You can\'t rush the drying. I always rush the drying.' },
    { member_id:'profile-maya', building:'library',  entry_type:'journal',      timestamp:'2026-01-28T21:45:00Z', word_count:55,  tags:['identity','fear','commercial','purpose','change'], content:'Why did I come here? I have a studio. I have buyers. I have — by every measure — a successful practice. But I\'ve been making the same mugs for three years because mugs sell. I used to make things that scared me a little. I want to make things that scare me again.' },
    { member_id:'profile-maya', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-02-02T09:55:00Z', word_count:36,  tags:['community','james','memory','beginnings'], content:'Month two. The village feels real now. James posted his first complete sculptural piece yesterday. I remember feeling that way about my first piece. You don\'t get that feeling back.' },
    { member_id:'profile-maya', building:'studio',   entry_type:'process_note', timestamp:'2026-02-06T13:22:00Z', word_count:33,  tags:['hand_building','new_work','uncertainty','freedom','change'], content:'Started a new series. Not mugs. Large hand-built forms. No function. I don\'t know what they are yet. That\'s the point. I haven\'t worked this way in four years.' },
    { member_id:'profile-maya', building:'library',  entry_type:'process_note', timestamp:'2026-02-10T11:40:00Z', word_count:62,  tags:['scale','hands','control','time','drying','material','repetition'], content:'The large forms are teaching me something about scale. When you work small — mugs, bowls — your hands are in control. When you work at body scale, the clay starts to have opinions. It wants to slump. It wants to crack. You have to work with its timeline not yours. I\'ve been fighting the drying again. Same mistake, different scale.' },
    { member_id:'profile-maya', building:'mentor',   entry_type:'process_note', timestamp:'2026-02-14T16:30:00Z', word_count:50,  tags:['teaching','james','over_explaining','fear','identity'], mura_triggered:true, mura_response:'You said you over-explain because you\'re afraid of being misunderstood.\n\nWhat would it feel like to be misunderstood and be okay with it?', member_responded:true, member_response:'Probably freeing. I\'ve been performing competence for so long I\'ve forgotten what it\'s like to just not know.', content:'James asked me about firing temperatures today. I spent an hour explaining oxidation vs reduction. I don\'t think he needed all of that. I think he needed me to say: just fire it and see what happens. I over-explain because I\'m afraid of being misunderstood. Old habit.' },
    { member_id:'profile-maya', building:'gallery',  entry_type:'gallery_post', timestamp:'2026-02-18T14:15:00Z', word_count:36,  tags:['hand_building','large_form','crack','imperfection','wabi_sabi'], content:'First large form. I don\'t know what to call it. I\'ve just called it Form 01. It cracked during drying and I fired it anyway. The crack is now the best thing about it.' },
    { member_id:'profile-maya', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-02-22T19:44:00Z', word_count:36,  tags:['intention','craft','honesty','evolution','imperfection'], content:'Someone asked me today if the crack in Form 01 was intentional. I said yes. That was a lie. But maybe by the time I make Form 02 it will be true.' },
    { member_id:'profile-maya', building:'library',  entry_type:'journal',      timestamp:'2026-02-26T22:10:00Z', word_count:43,  tags:['mugs','selling','change','identity','freedom','buyers'], content:'I haven\'t made a mug in six weeks. My buyers are asking. I don\'t know how to explain that I\'m making something I can\'t sell yet and I don\'t care. That\'s new. I used to care very much.' },
    { member_id:'profile-maya', building:'studio',   entry_type:'process_note', timestamp:'2026-03-03T10:15:00Z', word_count:48,  tags:['failure','collapse','time','adaptation','emergence'], content:'Form 03 collapsed this morning. I\'d been building it for two weeks. I sat with the collapsed clay for a long time before I did anything. Then I built something smaller from the wreckage. That smaller thing is better than the form would have been.' },
    { member_id:'profile-maya', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-03-07T09:30:00Z', word_count:12,  tags:['james','teaching','readiness'], content:'James is ready to teach someone. He doesn\'t know it yet.' },
    { member_id:'profile-maya', building:'library',  entry_type:'process_note', timestamp:'2026-03-11T14:55:00Z', word_count:59,  tags:['drying','rushing','control','uncertainty','patience','self_knowledge'], mura_triggered:true, mura_response:'余白。\nThe space that holds everything else.\n\nYou wrote in January that you always rush the drying. You\'ve just told yourself why.\n\nWhat changes now that you know?', member_responded:true, member_response:'Maybe nothing changes. Knowing why you do something doesn\'t always stop you doing it. But at least now I\'m not pretending it\'s the clay\'s fault.', content:'I\'ve been thinking about why I rush the drying stage. I think it\'s because drying is waiting. And waiting means not knowing. The piece is finished but not finished. It could crack. It could warp. And I can\'t do anything about it. I rush it because I can\'t stand not being able to do anything.' },
    { member_id:'profile-maya', building:'gallery',  entry_type:'gallery_post', timestamp:'2026-03-15T16:20:00Z', word_count:38,  tags:['large_form','progress','cost','process','milestone'], content:'Form 05. The first one I\'m not embarrassed by. Five forms to get here. That\'s the real price of the work — not the materials, not the kiln costs. The five that came before.' },
    { member_id:'profile-maya', building:'library',  entry_type:'journal',      timestamp:'2026-03-20T21:30:00Z', word_count:55,  tags:['reflection','identity','three_months','platform','authenticity','selling'], content:'Three months here. I\'ve made five large forms, posted four of them, sold none of them, and I feel more like a maker than I have in four years. Something about this place makes the work feel real again. I think it\'s because nobody here cares how many followers I have.' },
    { member_id:'profile-maya', building:'mentor',   entry_type:'process_note', timestamp:'2026-03-25T15:40:00Z', word_count:40,  tags:['james','teaching','kiln','knowledge','letting_go'], content:'Spent the afternoon with James. He\'s ready for the kiln. I didn\'t tell him what to expect. I want him to have his own experience of the first firing. Some knowledge you have to earn yourself.' },
    { member_id:'profile-maya', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-03-29T20:15:00Z', word_count:30,  tags:['mugs','choice','identity','change','return'], mura_triggered:true, mura_response:'Same mug. Different maker.\n\nWhat is the difference between choosing something and defaulting to it?', member_responded:false, content:'Made a mug today. First one in two months. It felt completely different. Like I was choosing it instead of defaulting to it. Same mug. Different maker.' },
    // ── James ─────────────────────────────────────────────────────────
    { member_id:'profile-james', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-01-04T11:22:00Z', word_count:34,  tags:['identity','hiding','uncertainty','beginnings'], mura_triggered:true, mura_response:'ようこそ。\nWelcome.\n\nYou found your way here. That already means something.\n\nTake your time.', member_responded:false, content:'I\'ve been making things for about a year. Mostly I make them and then hide them. I\'m not sure why I\'m here but it felt like the right place to figure that out.' },
    { member_id:'profile-james', building:'library',  entry_type:'process_note', timestamp:'2026-01-07T16:45:00Z', word_count:43,  tags:['coil_building','honesty','process','visibility','material'], content:'I\'ve been building with coils. The technique feels honest to me — you can see exactly how the thing was made. Every coil is visible in the finished piece if you look. I like that. I\'m not interested in hiding the process.' },
    { member_id:'profile-james', building:'studio',   entry_type:'process_note', timestamp:'2026-01-10T14:30:00Z', word_count:33,  tags:['learning','embarrassment','pride','beginner','identity'], content:'Everything I make looks like it was made by someone learning. Which it was. I don\'t know if that\'s something to be embarrassed about or proud of. Both, maybe.' },
    { member_id:'profile-james', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-01-13T19:55:00Z', word_count:42,  tags:['maya','imperfection','belief','learning','unevenness'], content:'Maya said something to me today about my coil pot — that the unevenness at the top is not a mistake. I\'ve been thinking about that for two days. I think she\'s right but I don\'t fully believe it yet.' },
    { member_id:'profile-james', building:'library',  entry_type:'journal',      timestamp:'2026-01-17T22:10:00Z', word_count:67,  tags:['screens','hands','permanence','fear','mistake','identity','digital'], content:'I came to clay because I needed something that couldn\'t be done on a screen. My whole life is screens. I write on screens, I think on screens, I communicate on screens. Clay is the only thing I do where the mistake is permanent and the success is also permanent. Everything else is editable. Clay isn\'t. I think that\'s why it terrifies me.' },
    { member_id:'profile-james', building:'studio',   entry_type:'failure',      timestamp:'2026-01-21T15:20:00Z', word_count:62,  tags:['collapse','failure','figure','scale','photography','meaning'], content:'Built a form for three days. A figure. Human scale — well, half human scale. It collapsed this morning. I came back to the studio and it had just fallen. I stood there for a long time. Then I took a photo of the collapsed form. It looks better collapsed than it did standing. I\'m not sure what that means.' },
    { member_id:'profile-james', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-01-25T09:40:00Z', word_count:33,  tags:['kiln','fear','readiness','avoidance','identity'], mura_triggered:true, mura_response:'Ten months of making. Nothing fired yet.\n\nWhat are you protecting?', member_responded:true, member_response:'The possibility that it might be good. Once it\'s fired it\'s real. And real things can be disappointing.', content:'I haven\'t fired anything yet. Ten months of making and nothing has been through a kiln. I keep saying it\'s not ready. I think I\'m the one who\'s not ready.' },
    { member_id:'profile-james', building:'library',  entry_type:'process_note', timestamp:'2026-01-29T13:55:00Z', word_count:45,  tags:['coil_building','patience','waiting','time','surprise'], content:'The coil technique means building slowly. You can only add so many coils before the weight becomes too much and the form starts to move. So you build, and wait, and build again. I\'ve started to enjoy the waiting. I didn\'t expect that.' },
    { member_id:'profile-james', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-02-03T10:15:00Z', word_count:37,  tags:['maya','crack','courage','comparison','avoidance'], content:'Maya posted her first large form today. There\'s a crack in it and she fired it anyway. I\'ve been thinking about that all day. I wouldn\'t have fired it. I would have started again.' },
    { member_id:'profile-james', building:'library',  entry_type:'process_note', timestamp:'2026-02-08T14:40:00Z', word_count:44,  tags:['faces','series','showing','hands','intuition','sculpture'], content:'I\'ve been building a series of small heads. Faces, really. Not portraits of anyone. Just faces that might exist. They\'re the first things I\'ve made that I actually want to show people. I don\'t know why faces. Hands felt too obvious.' },
    { member_id:'profile-james', building:'studio',   entry_type:'process_note', timestamp:'2026-02-12T11:30:00Z', word_count:55,  tags:['maya','kiln','fire','control','letting_go','learning'], content:'Maya spent an hour explaining oxidation and reduction firing to me. I understood about a third of it. What I took from it: the fire does things you can\'t predict. You load the kiln and then you let it go. That\'s the part she didn\'t say in words but that\'s what I heard.' },
    { member_id:'profile-james', building:'gallery',  entry_type:'gallery_post', timestamp:'2026-02-16T16:55:00Z', word_count:22,  tags:['first_post','faces','courage','speed','vulnerability'], mura_triggered:true, mura_response:'一期一会。\nThis moment. Only once.\n\nYou posted it before you could stop yourself.\n\nWhat made thirty seconds feel safer than thinking about it?', member_responded:true, member_response:'Thinking about it gives the fear time to organise. Thirty seconds doesn\'t.', content:'First piece posted. One of the faces. I almost didn\'t. Posted it in under thirty seconds before I could change my mind.' },
    { member_id:'profile-james', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-02-20T20:30:00Z', word_count:43,  tags:['faces','emotion','intuition','unconscious','meaning','sculpture'], content:'Someone said my face looked sad. It does. I didn\'t make it sad on purpose. It just came out that way. I think that\'s the most interesting thing that\'s happened to me making things — when the thing knows something you don\'t.' },
    { member_id:'profile-james', building:'library',  entry_type:'journal',      timestamp:'2026-02-24T22:45:00Z', word_count:65,  tags:['kiln','fear','faces','knowing','maya','avoidance','crack'], content:'Still haven\'t fired anything. The faces are bisque hard and sitting on my shelf. They\'ve been there for three weeks. I pick them up and put them down. I know the kiln is the next step. I know Maya will help me. I know the worst that can happen is they crack. And I know that knowing all of this doesn\'t make it easier.' },
    { member_id:'profile-james', building:'studio',   entry_type:'process_note', timestamp:'2026-02-28T13:20:00Z', word_count:45,  tags:['figure','large_scale','loneliness','comfort','ambiguity','sculpture'], content:'Built my first large piece. Not as large as Maya\'s forms but larger than anything I\'ve done. A figure, seated. Arms around its own knees. I don\'t know if it\'s about loneliness or comfort. Maybe it\'s about both at the same time.' },
    { member_id:'profile-james', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-03-04T09:45:00Z', word_count:44,  tags:['kiln','first_firing','faces','survival','crack','maya','transformation'], mura_triggered:true, mura_response:'守破離。\nLearn. Break. Become.\n\nYou said in January you were protecting the possibility that they might be good.\n\nWhat are you protecting now?', member_responded:true, member_response:'Nothing, I think. Something changed in that kiln. I don\'t know what. But I\'m not as careful as I was.', content:'I fired the faces. Yesterday. Maya was there. Three of the five survived. One cracked completely. One cracked partially and is somehow better for it. I held the survivors for a long time. They felt different. Like they\'d been through something.' },
    { member_id:'profile-james', building:'library',  entry_type:'process_note', timestamp:'2026-03-08T14:10:00Z', word_count:30,  tags:['crack','fire','intention','letting_go','honesty','faces'], content:'The cracked face is the one people ask about most. I\'ve stopped explaining that it wasn\'t intentional. I just say: the fire decided. Which is true.' },
    { member_id:'profile-james', building:'studio',   entry_type:'process_note', timestamp:'2026-03-12T11:55:00Z', word_count:38,  tags:['drying','patience','maya','figure','care','alive'], content:'The seated figure is drying. I\'m not rushing it. I keep thinking about what Maya said — that you can\'t rush the drying. I\'ve been checking on it twice a day. Gently. Like it\'s something alive.' },
    { member_id:'profile-james', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-03-16T19:20:00Z', word_count:36,  tags:['faces','series','vision','intuition','room','scale'], content:'I\'ve started making more faces. Eight now. I want to make enough for a room. I don\'t know whose room. I don\'t know why a room. But that\'s where the work wants to go.' },
    { member_id:'profile-james', building:'library',  entry_type:'journal',      timestamp:'2026-03-20T23:00:00Z', word_count:70,  tags:['three_months','reflection','identity','maker','transformation','milestone'], content:'Three months. I\'ve fired work for the first time. I\'ve posted work for the first time. I\'ve shown work to people I don\'t know for the first time. None of it killed me. All of it changed me. I came here because I needed somewhere to figure out if I was actually a maker or just someone who played at making. I think I know the answer now.' },
    { member_id:'profile-james', building:'mentor',   entry_type:'process_note', timestamp:'2026-03-24T15:30:00Z', word_count:37,  tags:['teaching','maya','beginner','knowledge','readiness','laughter'], mura_triggered:true, mura_response:'You remember what it\'s like to not know.\n\nMaya said that about you three weeks before she said it to you.\n\nWhat do you think she saw?', member_responded:false, content:'Maya suggested I might think about teaching a hand-building session for beginners. I laughed. I\'m a beginner. She said: you remember what it\'s like to not know. That\'s more useful than you think.' },
    { member_id:'profile-james', building:'bonfire',  entry_type:'bonfire',      timestamp:'2026-03-28T20:40:00Z', word_count:28,  tags:['kiln','figure','survival','crack','perfection','learning'], content:'Fired the seated figure today. It survived. No cracks. I\'m almost disappointed. The cracks teach you something. The perfect ones just sit there looking finished.' },
  ];
  // Guard against race (two tabs open simultaneously) — check Supabase first
  _sb.from('member_language').select('id', { count:'exact', head:true }).then(({ count, error }) => {
    if (error) { console.warn('[Mura migration]', error.message); return; }
    if (count > 0) { localStorage.setItem('mura_migration_v1_done', '1'); return; }
    _sb.from('member_language').insert(entries).then(({ error: e2 }) => {
      if (e2) { console.warn('[Mura migration]', e2.message); return; }
      localStorage.setItem('mura_migration_v1_done', '1');
      console.log('[Mura] 44 entries migrated to Supabase');
    });
  });
}
migrateMuraDatabase();

// ===== PRESENCE TRACKING =====
const _BLDG_SLUG = {
  'Commons / Café':       'commons',
  'Library / Archive':    'library',
  'School':               'school',
  'Mentor Cluster':       'mentor',
  'Bonfire Plaza':        'bonfire',
  'Studio Quarter':       'studio',
  'Residency / Exchange': 'residency',
  'Observatory / World':  'observatory',
  'Gallery / Market':     'gallery',
};
const _ACTIVE_VILLAGE_ID = localStorage.getItem('cvCurrentVillageId') || '02dc2b86-eb71-4fa8-bd11-5e0c397d25ae';
let _presenceLocation = 'map';

function _presenceProfileId() {
  // Prefer Supabase auth.uid() if signed in
  if (window._supabase && window._sbAuthUid) return window._sbAuthUid;
  // Fallback to localStorage UUID for localhost dev
  const sess = sessionStorage.getItem('cvSession') || localStorage.getItem('cvSession') || 'admin';
  const key  = 'cvPUUID_' + sess;
  let uid    = localStorage.getItem(key);
  if (!uid) { uid = crypto.randomUUID(); localStorage.setItem(key, uid); }
  return uid;
}

let _buildingPresence = [];

function logPresence(location) {
  _presenceLocation = location || 'map';
  if (!window._supabase) return;
  const _pData = {
    profile_id:   _presenceProfileId(),
    village_id:   _ACTIVE_VILLAGE_ID,
    location:     _presenceLocation,
    last_seen_at: new Date().toISOString(),
  };
  // Enrich with display name + avatar if profile system is ready
  if (typeof getSessionProfile === 'function') {
    const _sp = getSessionProfile();
    if (_sp) {
      _pData.display_name = _sp.villageName || _sp.name || '';
      _pData.avatar_url = _sp.photo || '';
    }
  }
  window._supabase.from('presence').upsert(_pData, { onConflict: 'profile_id,village_id' }).then(({ error }) => {
    if (error) console.warn('[Presence]', error.message);
  });
}

async function fetchBuildingPresence() {
  if (!window._supabase) return;
  const cutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const { data, error } = await window._supabase
    .from('presence')
    .select('profile_id, location, display_name, avatar_url')
    .eq('village_id', _ACTIVE_VILLAGE_ID)
    .gte('last_seen_at', cutoff);
  if (!error && data) {
    _buildingPresence = data;
    if (typeof updatePresenceBadges === 'function') updatePresenceBadges();
    // Refresh bonfire ghost dots if chat is open
    if (typeof bonfireChatOpen !== 'undefined' && bonfireChatOpen && typeof renderGhostDots === 'function') renderGhostDots();
  }
}

// Log on arrival + heartbeat every 30s (presence write + read)
document.addEventListener('DOMContentLoaded', () => { logPresence('map'); fetchBuildingPresence(); });
setInterval(() => { logPresence(_presenceLocation); fetchBuildingPresence(); }, 30000);

// ───────────────────────────────────────────────────────────

// ===== MURA v2 — The Presence That Cannot Be Summoned =====
document.addEventListener('DOMContentLoaded', function() {
(function() {

  const _MURA_BUILDING_OVERLAYS = [
    'cafe-room-overlay','observatory-overlay','mentor-overlay',
    'studio-quarter-overlay','library-overlay','gallery-overlay',
    'bonfire-manifesto-overlay','exchange-overlay','school-overlay',
    'roundtable-overlay','cognitive-agency-overlay'
  ];

  const JP_RE = /[\u3000-\u9fff\uff00-\uffef]+/g;
  const msg = document.getElementById('mura-message');

  // ── Create ambient glow dot ───────────────────────────────────
  const _glowDot = document.createElement('div');
  _glowDot.id = 'mura-glow-dot';
  _glowDot.className = 'mura-building-glow';
  _glowDot.innerHTML = '<div class="mura-building-glow-dot"></div>';
  document.body.appendChild(_glowDot);

  // ── renderMessage — wraps Japanese in speakable spans ─────────
  function renderMessage(text) {
    const safe = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const withSpans = safe.replace(JP_RE, match =>
      `<span class="mura-jp" data-jp="${match}">${match}</span>`
    );
    msg.innerHTML = withSpans
      .replace(/(<\/span>)\n+/g, '$1\n')
      .replace(/\n/g, '<br>');
    msg.querySelectorAll('.mura-jp').forEach(span => {
      let _ttsPlaying = false;
      span.addEventListener('mouseenter', async () => {
        if (_ttsPlaying) return;
        _ttsPlaying = true;
        try {
          const _ttsUrl = _IS_LOCAL ? 'http://localhost:3001/tts' : 'https://fokujzwgqtifpbmmhdot.supabase.co/functions/v1/tts';
          const res = await fetch(_ttsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: span.dataset.jp })
          });
          if (!res.ok) throw new Error('tts ' + res.status);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.onended = () => { URL.revokeObjectURL(url); _ttsPlaying = false; };
          audio.onerror = () => { URL.revokeObjectURL(url); _ttsPlaying = false; };
          audio.play();
        } catch (err) {
          console.warn('[Mura TTS]', err.message);
          _ttsPlaying = false;
        }
      });
    });
  }

  // ── shouldMuraSpeak — trigger logic ──────────────────────────
  function shouldMuraSpeak(entries) {
    if (!entries || entries.length === 0) return { should: false, reason: null };

    function tokenize(text) {
      return (text || '').toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 3);
    }

    // Trigger 1: Milestone
    if ([10, 25, 50].includes(entries.length)) {
      return { should: true, reason: 'milestone' };
    }

    // Trigger 2: First entry in a new building
    const buildingCounts = {};
    entries.forEach(e => { buildingCounts[e.building] = (buildingCounts[e.building] || 0) + 1; });
    if (Object.values(buildingCounts).some(c => c === 1)) {
      return { should: true, reason: 'first_entry' };
    }

    // Trigger 3: Return after 5+ day absence
    const sorted = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (sorted.length >= 2) {
      const daysBetween = (new Date(sorted[0].timestamp) - new Date(sorted[1].timestamp)) / (1000 * 60 * 60 * 24);
      if (daysBetween >= 5) return { should: true, reason: 'return_after_absence' };
    }

    // Trigger 4: Pattern — same word in 3+ entries
    const wordMap = {};
    entries.forEach(e => {
      [...new Set(tokenize(e.content))].forEach(w => { wordMap[w] = (wordMap[w] || 0) + 1; });
    });
    if (Object.values(wordMap).some(c => c >= 3)) {
      return { should: true, reason: 'pattern_detection' };
    }

    // Trigger 5: Cross-building resonance — library + studio share vocabulary
    const libWords  = new Set(entries.filter(e => e.building === 'library').flatMap(e => tokenize(e.content)));
    const studWords = new Set(entries.filter(e => e.building === 'studio').flatMap(e => tokenize(e.content)));
    if (libWords.size > 0 && studWords.size > 0) {
      const overlap = [...libWords].filter(w => studWords.has(w));
      if (overlap.length >= 3) return { should: true, reason: 'cross_building' };
    }

    // Trigger 6: Silence — a building has entries but none in last 30 days
    const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentBuildings = new Set(entries.filter(e => new Date(e.timestamp).getTime() > cutoff).map(e => e.building));
    const allBuildings    = new Set(entries.map(e => e.building));
    if ([...allBuildings].some(b => !recentBuildings.has(b))) {
      return { should: true, reason: 'silence' };
    }

    return { should: false, reason: null };
  }

  // ── Glow show / hide ──────────────────────────────────────────
  function _muraShowGlow() {
    _glowDot.classList.add('active');
    _MURA_BUILDING_OVERLAYS.forEach(id => {
      const el = document.getElementById(id);
      if (el && (el.classList.contains('open') || el.style.display === 'flex')) {
        el.classList.add('mura-edge-glow', 'active');
      }
    });
  }

  function _muraHideGlow() {
    _glowDot.classList.remove('active');
    _MURA_BUILDING_OVERLAYS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('mura-edge-glow', 'active');
    });
  }

  // ── Reveal — show the observation when glow is clicked ───────
  async function _muraReveal() {
    try {
      const memberId = (typeof getMuraId === 'function') ? getMuraId() : 'profile-unknown';
      const now = new Date().toISOString();
      const { data: obs } = await _sb
        .from('mura_observations')
        .select('id, text')
        .eq('member_id', memberId)
        .is('seen_at', null)
        .gt('expires_at', now)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!obs) { _muraHideGlow(); return; }

      renderMessage(obs.text);
      const dialog = document.getElementById('mura-dialog');
      dialog.style.display = 'flex';
      dialog.style.opacity = '';
      dialog.classList.remove('mura-dialog-fade');

      // Mark seen
      _sb.from('mura_observations')
        .update({ seen_at: new Date().toISOString() })
        .eq('id', obs.id)
        .then(({ error }) => { if (error) console.warn('[Mura]', error.message); });

      _muraHideGlow();
    } catch (err) {
      console.warn('[Mura reveal]', err.message);
    }
  }

  // ── Close dialog ──────────────────────────────────────────────
  function _muraCloseDialog() {
    const dialog = document.getElementById('mura-dialog');
    dialog.style.display = 'none';
    dialog.classList.remove('mura-dialog-fade');
    dialog.style.opacity = '';
  }

  // ── Check for existing pending observation ───────────────────
  async function _checkMuraPending() {
    try {
      const memberId = (typeof getMuraId === 'function') ? getMuraId() : 'profile-unknown';
      const now = new Date().toISOString();
      const { data } = await _sb
        .from('mura_observations')
        .select('id')
        .eq('member_id', memberId)
        .is('seen_at', null)
        .gt('expires_at', now)
        .limit(1)
        .maybeSingle();
      if (data) _muraShowGlow();
    } catch (_) {}
  }

  // ── Check if Mura should speak (triggered on building open) ──
  async function _checkMuraForBuilding(buildingName) {
    try {
      const memberId = (typeof getMuraId === 'function') ? getMuraId() : 'profile-unknown';
      const villageId = (typeof _ACTIVE_VILLAGE_ID !== 'undefined') ? _ACTIVE_VILLAGE_ID : '';

      // 1. Check 48h cooldown
      const { data: lastObs } = await _sb
        .from('mura_observations')
        .select('created_at')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastObs) {
        const hoursSince = (Date.now() - new Date(lastObs.created_at).getTime()) / (1000 * 60 * 60);
        if (hoursSince < 48) return;
      }

      // 2. Fetch last 50 entries
      const { data: entries, error: sbErr } = await _sb
        .from('member_language')
        .select('building, entry_type, content, timestamp')
        .eq('member_id', memberId)
        .neq('entry_type', 'response_to_mura')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (sbErr || !entries || entries.length === 0) return;

      // 3. Trigger logic
      const { should, reason } = shouldMuraSpeak(entries);
      if (!should) return;

      // 4. Call Mura API
      const _muraUrl = _IS_LOCAL
        ? 'http://localhost:3001/mura'
        : 'https://fokujzwgqtifpbmmhdot.supabase.co/functions/v1/mura';

      const resp = await fetch(_muraUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY },
        body: JSON.stringify({ entries: [...entries].reverse(), last_messages: [], triggered_by: reason })
      });
      if (!resp.ok) return;
      const { text, error: apiErr } = await resp.json();
      if (apiErr || !text) return;

      // 5. Store observation with 24h expiry
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const { error: insertErr } = await _sb.from('mura_observations').insert({
        member_id:    memberId,
        village_id:   villageId,
        text:         text,
        triggered_by: reason,
        expires_at:   expiresAt,
      });
      if (insertErr) { console.warn('[Mura]', insertErr.message); return; }

      // 6. Show glow
      _muraShowGlow();

    } catch (err) {
      console.warn('[Mura check]', err.message);
    }
  }

  // ── Expose hook for openBuildingPage ─────────────────────────
  window._muraOnBuildingOpen = function(buildingName) {
    _checkMuraPending();
    _checkMuraForBuilding(buildingName);
  };

  // ── Event wiring ──────────────────────────────────────────────
  _glowDot.addEventListener('click', _muraReveal);

  var _closeBtn = document.getElementById('mura-close-btn');
  if (_closeBtn) _closeBtn.addEventListener('click', _muraCloseDialog);

  var _muraNavBtn = document.getElementById('nav-mura');
  if (_muraNavBtn) _muraNavBtn.addEventListener('click', function() {
    var modal = document.getElementById('mura-lore-modal');
    if (modal) modal.style.display = 'flex';
  });

  var _loreClose = document.getElementById('mura-lore-close');
  if (_loreClose) _loreClose.addEventListener('click', function() {
    document.getElementById('mura-lore-modal').style.display = 'none';
  });

  // ── Hide glow when leaving a building ────────────────────────
  _MURA_BUILDING_OVERLAYS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    new MutationObserver(() => {
      const open = el.classList.contains('open') || el.style.display === 'flex';
      if (!open) {
        _glowDot.classList.remove('active');
        el.classList.remove('mura-edge-glow', 'active');
      }
    }).observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
  });

})();
}); // end DOMContentLoaded — Mura v2
// ===== END MURA v2 =====

// ───────────────────────────────────────────────────────────

// ===== MURA v2 — openBuildingPage hook =====
document.addEventListener('DOMContentLoaded', function() {
(function() {
  var _origOpen = window.openBuildingPage || function() {};
  window.openBuildingPage = function(buildingName) {
    _origOpen(buildingName);
    if (typeof window._muraOnBuildingOpen === 'function') {
      window._muraOnBuildingOpen(buildingName);
    }
  };
  // Also hook direct bonfire open
  var _origBF = window.openBonfireManifesto;
  if (_origBF) {
    window.openBonfireManifesto = function() {
      _origBF();
      if (typeof window._muraOnBuildingOpen === 'function') {
        window._muraOnBuildingOpen('Bonfire Plaza');
      }
    };
  }
})();
}); // end DOMContentLoaded — openBuildingPage hook

// ───────────────────────────────────────────────────────────

// ===== MURA MEMBER LANGUAGE SEED =====
function seedMemberLanguage() {
  if (localStorage.getItem('mura_language_seeded') === '1') return;

  function ts(str) { return new Date(str).getTime(); }

  // ── BONFIRE MESSAGES ──────────────────────────────────────────────
  const BONFIRE_KEY = 'clayVillageBonfireChat';
  const bonfireMsgs = JSON.parse(localStorage.getItem(BONFIRE_KEY) || '[]');
  const bonfireSeed = [
    { name:'Maya', text:'First day. This feels different from everywhere else I\'ve tried. No follower count visible. I didn\'t realise how much that number was affecting me until it wasn\'t there.', photo:'', isPlayer:false, ts:ts('2026-01-03T09:14:00'), seed:true },
    { name:'Maya', text:'James — your coil pot from yesterday. The unevenness at the top is not a mistake. Don\'t fix it.', photo:'', isPlayer:false, ts:ts('2026-01-18T20:33:00'), seed:true },
    { name:'Maya', text:'Month two. The village feels real now. James posted his first complete sculptural piece yesterday. I remember feeling that way about my first piece. You don\'t get that feeling back.', photo:'', isPlayer:false, ts:ts('2026-02-02T09:55:00'), seed:true },
    { name:'Maya', text:'Someone asked me today if the crack in Form 01 was intentional. I said yes. That was a lie. But maybe by the time I make Form 02 it will be true.', photo:'', isPlayer:false, ts:ts('2026-02-22T19:44:00'), seed:true },
    { name:'Maya', text:'James is ready to teach someone. He doesn\'t know it yet.', photo:'', isPlayer:false, ts:ts('2026-03-07T09:30:00'), seed:true },
    { name:'Maya', text:'Made a mug today. First one in two months. It felt completely different. Like I was choosing it instead of defaulting to it. Same mug. Different maker.', photo:'', isPlayer:false, ts:ts('2026-03-29T20:15:00'), seed:true },
    { name:'James', text:'I\'ve been making things for about a year. Mostly I make them and then hide them. I\'m not sure why I\'m here but it felt like the right place to figure that out.', photo:'', isPlayer:false, ts:ts('2026-01-04T11:22:00'), seed:true },
    { name:'James', text:'Maya said something to me today about my coil pot — that the unevenness at the top is not a mistake. I\'ve been thinking about that for two days. I think she\'s right but I don\'t fully believe it yet.', photo:'', isPlayer:false, ts:ts('2026-01-13T19:55:00'), seed:true },
    { name:'James', text:'I haven\'t fired anything yet. Ten months of making and nothing has been through a kiln. I keep saying it\'s not ready. I think I\'m the one who\'s not ready.', photo:'', isPlayer:false, ts:ts('2026-01-25T09:40:00'), seed:true },
    { name:'James', text:'Maya posted her first large form today. There\'s a crack in it and she fired it anyway. I\'ve been thinking about that all day. I wouldn\'t have fired it. I would have started again.', photo:'', isPlayer:false, ts:ts('2026-02-03T10:15:00'), seed:true },
    { name:'James', text:'Someone said my face looked sad. It does. I didn\'t make it sad on purpose. It just came out that way. I think that\'s the most interesting thing that\'s happened to me making things — when the thing knows something you don\'t.', photo:'', isPlayer:false, ts:ts('2026-02-20T20:30:00'), seed:true },
    { name:'James', text:'I fired the faces. Yesterday. Maya was there. Three of the five survived. One cracked completely. One cracked partially and is somehow better for it. I held the survivors for a long time. They felt different. Like they\'d been through something.', photo:'', isPlayer:false, ts:ts('2026-03-04T09:45:00'), seed:true },
    { name:'James', text:'I\'ve started making more faces. Eight now. I want to make enough for a room. I don\'t know whose room. I don\'t know why a room. But that\'s where the work wants to go.', photo:'', isPlayer:false, ts:ts('2026-03-16T19:20:00'), seed:true },
    { name:'James', text:'Fired the seated figure today. It survived. No cracks. I\'m almost disappointed. The cracks teach you something. The perfect ones just sit there looking finished.', photo:'', isPlayer:false, ts:ts('2026-03-28T20:40:00'), seed:true },
  ];
  const existingTimes = new Set(bonfireMsgs.filter(m => m.seed).map(m => m.ts));
  bonfireSeed.forEach(m => { if (!existingTimes.has(m.ts)) bonfireMsgs.push(m); });
  bonfireMsgs.sort((a,b) => (a.ts||0) - (b.ts||0));
  localStorage.setItem(BONFIRE_KEY, JSON.stringify(bonfireMsgs));

  // ── PROCESS NOTES (Library) ───────────────────────────────────────
  const PN_KEY = 'clayVillageProcessNotes';
  const pnStored = JSON.parse(localStorage.getItem(PN_KEY) || '[]');
  const pnIds = new Set(pnStored.map(p => p.id));
  const pnSeed = [
    { id:'ml-M002', title:'Handle attachment', body:'Been throwing mugs for six years. Still can\'t get the handle attachment right every time. The clay remembers stress in ways I don\'t fully understand. I score, I slip, I press — and sometimes it holds and sometimes it doesn\'t. Eight years in and it still feels like asking permission.', author:'Maya', tag:'Technique', date:'Jan 2026' },
    { id:'ml-M003', title:'Thirty mugs today', body:'Made thirty mugs today. Sold twelve before they were even fired. That used to feel good. Today it just felt like work. I don\'t know when that changed.', author:'Maya', tag:'Practice', date:'Jan 2026' },
    { id:'ml-M005', title:'Two different muscles', body:'Hand building and wheel throwing use completely different muscles. Not just physically — mentally. Wheel throwing is about control, about centering, about negotiating with centrifugal force. Hand building is about surrender. You push and the clay pushes back and you have to decide how much to fight it. I\'ve been throwing for eight years and I still find hand building humbling.', author:'Maya', tag:'Reflection', date:'Jan 2026' },
    { id:'ml-M010', title:'New series — large forms', body:'Started a new series. Not mugs. Large hand-built forms. No function. I don\'t know what they are yet. That\'s the point. I haven\'t worked this way in four years.', author:'Maya', tag:'New Work', date:'Feb 2026' },
    { id:'ml-M011', title:'Scale changes everything', body:'The large forms are teaching me something about scale. When you work small — mugs, bowls — your hands are in control. When you work at body scale, the clay starts to have opinions. It wants to slump. It wants to crack. You have to work with its timeline not yours. I\'ve been fighting the drying again. Same mistake, different scale.', author:'Maya', tag:'Scale', date:'Feb 2026' },
    { id:'ml-M012', title:'I over-explain', body:'James asked me about firing temperatures today. I spent an hour explaining oxidation vs reduction. I don\'t think he needed all of that. I think he needed me to say: just fire it and see what happens. I over-explain because I\'m afraid of being misunderstood. Old habit.', author:'Maya', tag:'Teaching', date:'Feb 2026' },
    { id:'ml-M016', title:'Form 03 collapsed', body:'Form 03 collapsed this morning. I\'d been building it for two weeks. I sat with the collapsed clay for a long time before I did anything. Then I built something smaller from the wreckage. That smaller thing is better than the form would have been.', author:'Maya', tag:'Failure', date:'Mar 2026' },
    { id:'ml-M018', title:'Why I rush the drying', body:'I\'ve been thinking about why I rush the drying stage. I think it\'s because drying is waiting. And waiting means not knowing. The piece is finished but not finished. It could crack. It could warp. And I can\'t do anything about it. I rush it because I can\'t stand not being able to do anything.', author:'Maya', tag:'Reflection', date:'Mar 2026' },
    { id:'ml-M021', title:'Ready for the kiln', body:'Spent the afternoon with James. He\'s ready for the kiln. I didn\'t tell him what to expect. I want him to have his own experience of the first firing. Some knowledge you have to earn yourself.', author:'Maya', tag:'Teaching', date:'Mar 2026' },
    { id:'ml-J002', title:'Building with coils', body:'I\'ve been building with coils. The technique feels honest to me — you can see exactly how the thing was made. Every coil is visible in the finished piece if you look. I like that. I\'m not interested in hiding the process.', author:'James', tag:'Technique', date:'Jan 2026' },
    { id:'ml-J003', title:'Everything looks like learning', body:'Everything I make looks like it was made by someone learning. Which it was. I don\'t know if that\'s something to be embarrassed about or proud of. Both, maybe.', author:'James', tag:'Reflection', date:'Jan 2026' },
    { id:'ml-J008', title:'Enjoying the waiting', body:'The coil technique means building slowly. You can only add so many coils before the weight becomes too much and the form starts to move. So you build, and wait, and build again. I\'ve started to enjoy the waiting. I didn\'t expect that.', author:'James', tag:'Process', date:'Jan 2026' },
    { id:'ml-J010', title:'A series of faces', body:'I\'ve been building a series of small heads. Faces, really. Not portraits of anyone. Just faces that might exist. They\'re the first things I\'ve made that I actually want to show people. I don\'t know why faces. Hands felt too obvious.', author:'James', tag:'Sculpture', date:'Feb 2026' },
    { id:'ml-J011', title:'The fire does things', body:'Maya spent an hour explaining oxidation and reduction firing to me. I understood about a third of it. What I took from it: the fire does things you can\'t predict. You load the kiln and then you let it go. That\'s the part she didn\'t say in words but that\'s what I heard.', author:'James', tag:'Kiln', date:'Feb 2026' },
    { id:'ml-J015', title:'First large piece', body:'Built my first large piece. Not as large as Maya\'s forms but larger than anything I\'ve done. A figure, seated. Arms around its own knees. I don\'t know if it\'s about loneliness or comfort. Maybe it\'s about both at the same time.', author:'James', tag:'Sculpture', date:'Feb 2026' },
    { id:'ml-J017', title:'The fire decided', body:'The cracked face is the one people ask about most. I\'ve stopped explaining that it wasn\'t intentional. I just say: the fire decided. Which is true.', author:'James', tag:'Kiln', date:'Mar 2026' },
    { id:'ml-J018', title:'Not rushing the drying', body:'The seated figure is drying. I\'m not rushing it. I keep thinking about what Maya said — that you can\'t rush the drying. I\'ve been checking on it twice a day. Gently. Like it\'s something alive.', author:'James', tag:'Process', date:'Mar 2026' },
    { id:'ml-J021', title:'Maybe think about teaching', body:'Maya suggested I might think about teaching a hand-building session for beginners. I laughed. I\'m a beginner. She said: you remember what it\'s like to not know. That\'s more useful than you think.', author:'James', tag:'Teaching', date:'Mar 2026' },
  ];
  pnSeed.forEach(p => { if (!pnIds.has(p.id)) pnStored.push(p); });
  localStorage.setItem(PN_KEY, JSON.stringify(pnStored));

  // ── JOURNALS (Library) ────────────────────────────────────────────
  const JN_KEY = 'clayVillageJournals';
  const jnStored = JSON.parse(localStorage.getItem(JN_KEY) || '[]');
  const jnIds = new Set(jnStored.map(j => j.id));
  const jnSeed = [
    { id:'ml-M008', title:'I want to make things that scare me', body:'Why did I come here? I have a studio. I have buyers. I have — by every measure — a successful practice. But I\'ve been making the same mugs for three years because mugs sell. I used to make things that scared me a little. I want to make things that scare me again.', author:'Maya', date:'Jan 2026' },
    { id:'ml-M015', title:'I don\'t care', body:'I haven\'t made a mug in six weeks. My buyers are asking. I don\'t know how to explain that I\'m making something I can\'t sell yet and I don\'t care. That\'s new. I used to care very much.', author:'Maya', date:'Feb 2026' },
    { id:'ml-M020', title:'Three months here', body:'Three months here. I\'ve made five large forms, posted four of them, sold none of them, and I feel more like a maker than I have in four years. Something about this place makes the work feel real again. I think it\'s because nobody here cares how many followers I have.', author:'Maya', date:'Mar 2026' },
    { id:'ml-J005', title:'Clay isn\'t editable', body:'I came to clay because I needed something that couldn\'t be done on a screen. My whole life is screens. I write on screens, I think on screens, I communicate on screens. Clay is the only thing I do where the mistake is permanent and the success is also permanent. Everything else is editable. Clay isn\'t. I think that\'s why it terrifies me.', author:'James', date:'Jan 2026' },
    { id:'ml-J014', title:'Knowing doesn\'t make it easier', body:'Still haven\'t fired anything. The faces are bisque hard and sitting on my shelf. They\'ve been there for three weeks. I pick them up and put them down. I know the kiln is the next step. I know Maya will help me. I know the worst that can happen is they crack. And I know that knowing all of this doesn\'t make it easier.', author:'James', date:'Feb 2026' },
    { id:'ml-J020', title:'I think I know the answer now', body:'Three months. I\'ve fired work for the first time. I\'ve posted work for the first time. I\'ve shown work to people I don\'t know for the first time. None of it killed me. All of it changed me. I came here because I needed somewhere to figure out if I was actually a maker or just someone who played at making. I think I know the answer now.', author:'James', date:'Mar 2026' },
  ];
  jnSeed.forEach(j => { if (!jnIds.has(j.id)) jnStored.push(j); });
  localStorage.setItem(JN_KEY, JSON.stringify(jnStored));

  // ── GALLERY POSTS ─────────────────────────────────────────────────
  const GAL_KEY = 'clayVillageGallery';
  const galStored = JSON.parse(localStorage.getItem(GAL_KEY) || '[]');
  const galIds = new Set(galStored.map(p => p.id));
  const galSeed = [
    { id:'ml-M004', title:'Hand-built bowl', maker:'Maya', clay:'Stoneware', firing:'Electric', craft_age:8, desc:'First piece posted here. A hand-built bowl. Asymmetric. I usually don\'t post the asymmetric ones.', price:'', available:true, emoji:'🏺', seed:true, img:null, shopUrl:null, ts:ts('2026-01-12T16:45:00') },
    { id:'ml-M013', title:'Form 01', maker:'Maya', clay:'Stoneware', firing:'Electric', craft_age:8, desc:'First large form. I don\'t know what to call it. I\'ve just called it Form 01. It cracked during drying and I fired it anyway. The crack is now the best thing about it.', price:'', available:true, emoji:'🏺', seed:true, img:null, shopUrl:null, ts:ts('2026-02-18T14:15:00') },
    { id:'ml-M019', title:'Form 05', maker:'Maya', clay:'Stoneware', firing:'Electric', craft_age:8, desc:'The first one I\'m not embarrassed by. Five forms to get here. That\'s the real price of the work — not the materials, not the kiln costs. The five that came before.', price:'', available:true, emoji:'🏺', seed:true, img:null, shopUrl:null, ts:ts('2026-03-15T16:20:00') },
    { id:'ml-J012', title:'Face No. 1', maker:'James', clay:'Stoneware', firing:'Electric', craft_age:1, desc:'First piece posted. One of the faces. I almost didn\'t. Posted it in under thirty seconds before I could change my mind.', price:'', available:true, emoji:'🗿', seed:true, img:null, shopUrl:null, ts:ts('2026-02-16T16:55:00') },
  ];
  galSeed.forEach(p => { if (!galIds.has(p.id)) galStored.push(p); });
  localStorage.setItem(GAL_KEY, JSON.stringify(galStored));

  // ── FAILURE WALL (Studio Quarter) ────────────────────────────────
  const FW_KEY = 'clayVillageFailureWall';
  const fwRaw = localStorage.getItem(FW_KEY);
  // If failure wall has only the default seeds, overwrite; otherwise merge
  const fwStored = fwRaw ? JSON.parse(fwRaw) : [];
  const fwIds = new Set(fwStored.map(f => f.id));
  const fwSeed = [
    { id:'ml-M007', authorId:'user1', failureNote:'Lost a whole batch today. Twelve pieces. The kiln ran too hot and I didn\'t catch it. Eight years and I still make this mistake.', lessonNote:'You can\'t rush the drying. The worst part isn\'t the pieces — it\'s the three weeks of work. I always rush the drying.', imageData:null, shared:true, ts:ts('2026-01-22T15:17:00'), archived:false },
    { id:'ml-J006', authorId:'user2', failureNote:'Built a form for three days. A figure. Half human scale. It collapsed this morning. I came back to the studio and it had just fallen.', lessonNote:'I stood there for a long time. Then I took a photo of the collapsed form. It looks better collapsed than it did standing. I\'m not sure what that means yet.', imageData:null, shared:true, ts:ts('2026-01-21T15:20:00'), archived:false },
  ];
  fwSeed.forEach(f => { if (!fwIds.has(f.id)) fwStored.push(f); });
  localStorage.setItem(FW_KEY, JSON.stringify(fwStored));

  // ── MURA PENDING MESSAGES ─────────────────────────────────────────
  // Two ready messages — shown in sequence to whoever opens Mura next
  const pending = JSON.parse(localStorage.getItem('mura_pending') || '[]');
  const pendingProfileIds = new Set(pending.map(p => p.profileId));
  if (!pendingProfileIds.has('user1')) {
    pending.push({
      profileId: 'user1',
      message: '物の哀れ。\nThe ache of passing things.\n\nFour days ago you wrote: same mug, different maker.\n\nWhat is the difference between choosing something and defaulting to it?'
    });
  }
  if (!pendingProfileIds.has('user2')) {
    pending.push({
      profileId: 'user2',
      message: '間 — the space between.\n\nYou said perfect things just sit there looking finished. In January you said you were protecting the possibility that they might be good.\n\nWhat happened to that fear?'
    });
  }
  localStorage.setItem('mura_pending', JSON.stringify(pending));

  localStorage.setItem('mura_language_seeded', '1');
}
seedMemberLanguage();
