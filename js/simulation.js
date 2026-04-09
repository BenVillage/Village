// ===== VILLAGE SIMULATION ENGINE ===========================================
// Pre-generated content bank with timed release. No external API.
// Bonfire: 3x per day (every 8h). Tables: 1x per day. Process notes: 1x per day.
// Replace SIM_BANK entries with real content when ready — the timer system stays.
// ===========================================================================
(function() {
  const BANK_KEY     = 'clayVillageSimBank';
  const SCHEDULE_KEY = 'clayVillageSimSchedule';

  const INTERVALS = {
    bonfire : 8  * 60 * 60 * 1000,   // 8h  → 3x per day
    table   : 24 * 60 * 60 * 1000,   // 24h → 1x per day
    process : 24 * 60 * 60 * 1000,   // 24h → 1x per day
  };

  // ── Content bank — Roundtable personas, authentic voice ─────────
  const DEFAULT_BANK = {

    bonfire: [
      { persona: 'Kenji',  text: 'Opened the kiln this morning. One piece survived that I did not expect to survive. The other three I expected to keep — gone. The kiln always knows something I do not.' },
      { persona: 'Sofia',  text: 'Third session today. I centred without stopping for the first time. Kept going all the way through opening. I do not know if the piece is good but I did not stop. That feels like something.' },
      { persona: 'Tomás',  text: 'Did not post for six months. Made more in those six months than in the year before. Sharing was taking something from the making. Still not sure what to do with that.' },
      { persona: 'Elena',  text: 'Three students booked this week. None from Instagram. Two from the village, one from a recommendation. First time that has happened.' },
      { persona: 'Kofi',   text: 'My grandfather fired without a pyrometer. He knew the colour of the flame. I am trying to learn what he knew. It takes longer than I thought.' },
      { persona: 'Alix',   text: 'Someone in the Library wrote about the crackle glaze coming from cooling too fast. I tried it. It worked. I did not know you could learn something that specific from reading.' },
      { persona: 'Jess',   text: 'Posted my failure wall piece today. The one that broke in the bisque. Felt strange. Nobody commented. That is probably correct.' },
      { persona: 'Amara',  text: 'Sold my first piece through the gallery. Sixty euros. Took me four hours to make. I know the math does not work yet. But it was sixty euros I did not have yesterday.' },
      { persona: 'Kenji',  text: 'A student asked me today why I leave the outside unglazed. I said because the clay already has something to say. She wrote it down. I had never said it out loud before.' },
      { persona: 'Noor',   text: 'Workshop tomorrow. Six students. I have been teaching from my kitchen for three years. First time I have had six in one session. Nervous in a way that feels correct.' },
      { persona: 'Mei',    text: 'Calculated what I made last year against what I spent on materials and kiln time. The gap is smaller than last year. Still a gap. But smaller.' },
      { persona: 'Carl',   text: 'Made a bowl today with no intention of selling it. Gave it to my neighbour. She uses it for keys. That is enough.' },
      { persona: 'Sofia',  text: 'Kenji answered my question about the foot ring. Four sentences. I read them five times. I think I understand the third sentence now.' },
      { persona: 'Tomás',  text: 'The piece I thought was the worst one from the last firing — I keep picking it up. Something happened in the kiln that I did not plan. I am trying to understand what.' },
      { persona: 'Diane',  text: 'I am not a maker. I am a collector. I came here because I wanted to understand what I was buying. I think I am starting to understand. It is more than I thought.' },
      { persona: 'James',  text: 'Turned off the algorithm notifications six weeks ago. Sales are the same. I am less tired. I do not know what to do with that information yet.' },
      { persona: 'Kofi',   text: 'There is a word in Twi for the sound clay makes when it is ready. No translation exists. Some knowledge only travels in the hands.' },
      { persona: 'Lena',   text: 'I bought a piece here last week. From someone I had talked to at the Bonfire. I knew what they were thinking when they made it. That changed what it means to own it.' },
      { persona: 'Elena',  text: 'A student told me today that my studio feels like a community. I said it is a business. She said yes but also a community. I have been thinking about that since.' },
      { persona: 'Ren',    text: 'Used AI to generate the form. Threw it by hand. The AI part took ten minutes. The throwing took three hours. The throwing is the part I care about. Still working out what that means.' },
      { persona: 'Mira',   text: 'I built a platform once. It failed because we took money before we knew what we were. Watching this village carefully. So far it knows what it is.' },
      { persona: 'Peter',  text: 'I spent twenty years building systems that optimised for engagement. I knew what I was doing. That is the part I find hardest to sit with.' },
      { persona: 'Alix',   text: 'Someone here described a broken bowl repaired with gold. Said there is a word for it. Kintsugi. I looked it up. I think I have been doing kintsugi with other things my whole life without knowing the word.' },
      { persona: 'Kenji',  text: 'Forty three years. I still do not know what clay is. I know what it does. What it is — that is still a question.' },
      { persona: 'Jess',   text: 'The platform I built everything on shut down eighteen months ago. Lost twelve thousand followers overnight. Came here because I needed somewhere that could not do that.' },
      { persona: 'Noor',   text: 'Student asked me why I teach from my kitchen. I said because that is where I make. She said she thought that was the most honest thing about the class.' },
      { persona: 'Carl',   text: 'No likes here. No follower count. I have been making for nineteen years and this is the first time I have posted somewhere that did not make me feel like I was performing.' },
      { persona: 'Sofia',  text: 'Ten sessions now. I counted. The first five I thought about stopping. The last five I thought about what comes next. Something shifted between five and six and I do not know what it was.' },
      { persona: 'Tomás',  text: 'Made something ugly today. On purpose. To see if I could let it exist without fixing it. It was harder than I expected.' },
      { persona: 'Mei',    text: 'The work matters. The money needs to follow. Those two things are not in conflict. I am still learning how to hold both at the same time.' },
    ],

    table: [
      {
        persona: 'Tomás', topic: 'Does glazing feel like cheating to anyone else?',
        messages: [
          { fromName: 'Tomás', text: 'I keep coming back to the unglazed pieces. The glaze feels like I am hiding something. Anyone else have this?' },
          { fromName: 'Kenji', text: 'The outside does not need decoration. It holds its form without asking for attention. The glaze is for the inside. A quiet surprise.' },
          { fromName: 'Alix',  text: 'I am new so maybe I cannot say this but — I actually love glaze. It feels like the piece gets to become something.' },
          { fromName: 'Jess',  text: 'I went through a phase of only raw work. Then I realised I was performing rawness the same way I used to perform polish. Both can be hiding.' },
          { fromName: 'Kofi',  text: 'In my tradition the surface is never separate from the form. They are decided together from the beginning. The question of hiding does not arise.' },
        ]
      },
      {
        persona: 'Amara', topic: 'How do you price your work honestly?',
        messages: [
          { fromName: 'Amara', text: 'I cannot figure out pricing. If I charge what it actually costs to make I sell nothing. If I charge what sells I feel like I am lying about the work.' },
          { fromName: 'James', text: 'I spent years pricing to sell. I sold a lot. I also optimised the craft out of my process. Faster, simpler, more sellable. I do not recommend it.' },
          { fromName: 'Mei',   text: 'I price for what I need to make the next piece. Not what the market will bear. Not what it cost. What do I need to keep going.' },
          { fromName: 'Elena', text: 'Price is not a statement about the work. It is an invitation to a specific person. Different prices invite different collectors. Both are correct.' },
          { fromName: 'Diane', text: 'As a collector — I do not buy cheap pieces. Not because I want to spend money. Because cheap pieces tell me the maker does not believe in the work.' },
        ]
      },
      {
        persona: 'Sofia', topic: 'When did you know you were a maker?',
        messages: [
          { fromName: 'Sofia', text: 'I am asking because I do not know yet if I am one. How did you know?' },
          { fromName: 'Carl',  text: 'When I kept going after the first bad firing. Anyone can start. Making is what you do after the first time it goes wrong.' },
          { fromName: 'Kenji', text: 'I do not think I decided. I think the clay decided and I agreed.' },
          { fromName: 'Tomás', text: 'When I stopped posting about it and just kept making. The making did not need the audience to be real.' },
          { fromName: 'Jess',  text: 'Honestly? I am still asking that question. Five years in. Maybe that is the point.' },
        ]
      },
      {
        persona: 'Ren', topic: 'AI in the studio — tool or threat?',
        messages: [
          { fromName: 'Ren',   text: 'I use AI to generate forms. Then I throw them by hand. The AI part is fast. The throwing is where the work is. Is that cheating?' },
          { fromName: 'Kenji', text: 'The hand knows things the screen does not. If the hand is still doing the work then the work is real. What the hand does not know — no tool can give it.' },
          { fromName: 'Alix',  text: 'I tried using AI to design a piece. The form was perfect. It felt like nothing when I held it. Maybe that is the test.' },
          { fromName: 'Dana',  text: 'I work on algorithms for a living. I know exactly how these tools are built. The output is pattern recognition. What the maker brings is the thing the pattern cannot find.' },
          { fromName: 'Mira',  text: 'The question is not AI or no AI. The question is — when you finish the piece, does it carry something of you. That is the only test that matters.' },
        ]
      },
      {
        persona: 'Lena', topic: 'Has anyone actually done a residency? What happened?',
        messages: [
          { fromName: 'Lena',  text: 'Thinking about applying to one. Terrified. What is it actually like?' },
          { fromName: 'Kofi',  text: 'I did one in Portugal three years ago. The clay was completely different. Everything I knew stopped working. I made the best pieces of my life.' },
          { fromName: 'Mei',   text: 'The loneliness is real. So is the focus. You do not have your routines. That is uncomfortable and also the whole point.' },
          { fromName: 'James', text: 'I did one in Japan. I did not speak the language. I could not explain what I was trying to do. I had to show it. My work changed permanently.' },
          { fromName: 'Noor',  text: 'Apply. The worst that happens is you learn what does not work in a different place. That is still learning.' },
        ]
      },
      {
        persona: 'Sofia', topic: 'What do you do when you cannot centre?',
        messages: [
          { fromName: 'Sofia', text: 'Some days the clay just will not go. I spend an hour and nothing centres. What do you do?' },
          { fromName: 'Elena', text: 'Stop. Make tea. Come back. The resistance is information. Something in your body is not ready. Forcing it costs more than the hour.' },
          { fromName: 'Kenji', text: 'I have had days like this for forty three years. They do not mean anything. Come back tomorrow.' },
          { fromName: 'Carl',  text: 'Hand building. When the wheel is not working I go back to pinching. Reminds me why I started.' },
          { fromName: 'Tomás', text: 'I reclaim the clay and call it a session. The reclaiming is part of the practice.' },
        ]
      },
      {
        persona: 'Raj', topic: 'Should this village have follower counts? Honest answers only.',
        messages: [
          { fromName: 'Raj',   text: 'I will say what I think nobody wants to say here. Without some measure of reach, how do makers grow? Craft age is great but it does not tell me who has an audience.' },
          { fromName: 'Kenji', text: 'I have three hundred and forty followers on Instagram. I have forty three years of practice. One of those numbers means something.' },
          { fromName: 'Zoe',   text: 'I have a million followers. I am being honest — I check the number every day. I know what that says about me. I am trying to change it.' },
          { fromName: 'Peter', text: 'I built engagement systems for twenty years. The number always wins. If you put it there people will optimise for it. Always. No exceptions.' },
          { fromName: 'Jess',  text: 'No. We had this conversation before we got here. The answer was no. That is why we are here.' },
        ]
      },
      {
        persona: 'Noor', topic: 'What is the hardest thing to teach?',
        messages: [
          { fromName: 'Noor',  text: 'I can teach technique. I cannot teach patience. Anyone else find this?' },
          { fromName: 'Kenji', text: 'I cannot teach what the hands know before the mind does. I can only create conditions where the student discovers it themselves.' },
          { fromName: 'Elena', text: 'Slowness. Everyone wants to move faster. The work always needs more time than the student thinks.' },
          { fromName: 'Carl',  text: 'Letting a bad piece exist. Everyone wants to fix everything. The bad pieces teach more. Students do not believe this until they have been making for years.' },
          { fromName: 'Mei',   text: 'The difference between a bad day and a bad maker. Every student has bad days and thinks they are a bad maker. Separating those two things is most of what teaching is.' },
        ]
      },
      {
        persona: 'Amara', topic: 'Selling vs keeping — how do you decide?',
        messages: [
          { fromName: 'Amara', text: 'I made something last week I do not want to sell. But I need the money. How do you decide?' },
          { fromName: 'Kenji', text: 'I keep nothing. I have kept one piece in forty three years. The pieces are not mine to keep. They are made to be held by someone who needs them.' },
          { fromName: 'Tomás', text: 'I kept everything for two years. Then I sold everything in one week. Neither felt right. I am still working out where the line is.' },
          { fromName: 'Carl',  text: 'Keep the one that taught you something you could not have learned any other way. Sell the rest.' },
          { fromName: 'Jess',  text: 'I take a photo before I sell anything. The piece goes. The memory stays. That works for me.' },
        ]
      },
      {
        persona: 'Tomás', topic: 'What made you stop posting on Instagram?',
        messages: [
          { fromName: 'Tomás', text: 'For me it was noticing the work got better when I stopped. What about you?' },
          { fromName: 'Jess',  text: 'The platform I was on shut down. Lost everything. Rebuilt on Instagram. Realised I was just waiting for that to happen again.' },
          { fromName: 'Kofi',  text: 'I never started. My tradition does not need it. My students find me through other students. That has worked for thirty years.' },
          { fromName: 'Mira',  text: 'I posted consistently for three years. The algorithm changed. Reach dropped eighty percent overnight. I had built everything on someone else\'s land.' },
          { fromName: 'Carl',  text: 'I realised I was making things that photographed well instead of things that felt right in the hands. The camera was shaping the work. I stopped.' },
        ]
      },
      {
        persona: 'Raj', topic: 'Does craft age matter if the work is bad?',
        messages: [
          { fromName: 'Raj',   text: 'Devil\'s advocate. Someone with thirty years of bad practice is still ranked above someone with three years of extraordinary work. Is that right?' },
          { fromName: 'Diane', text: 'As a collector — thirty years of bad practice does not produce thirty years of bad work. It produces someone who has been wrong thirty years and knows exactly what right looks like.' },
          { fromName: 'Kenji', text: 'There is no such thing as thirty years of bad practice. There is thirty years of practice and thirty years of understanding failure. That is not nothing.' },
          { fromName: 'Alix',  text: 'I am new so maybe this is naive but — can you practise something for thirty years and never get better at it? That seems impossible.' },
          { fromName: 'James', text: 'I have met makers with twenty years of practice who stopped learning at year three. And makers with two years who are extraordinary. Craft age is a signal not a guarantee.' },
        ]
      },
      {
        persona: 'Mira', topic: 'What does the village need that it does not have yet?',
        messages: [
          { fromName: 'Mira',  text: 'I have seen platforms fail. I am watching carefully. What is missing here that matters?' },
          { fromName: 'Elena', text: 'Real booking. I want to list a workshop and have someone pay. Not a notify me button. A book and pay button.' },
          { fromName: 'Amara', text: 'More makers who are not ceramicists. I make things too. I just do not have a kiln.' },
          { fromName: 'Sofia', text: 'More beginners like me. I am scared I am the only one who does not know what I am doing.' },
          { fromName: 'Peter', text: 'More real people. The village is beautiful. But beauty without community is a museum. Get the second resident in here.' },
        ]
      },
      {
        persona: 'Carl', topic: 'What is the best piece you ever made?',
        messages: [
          { fromName: 'Carl',  text: 'Not the most technically perfect. The one that meant the most. What is yours?' },
          { fromName: 'Kenji', text: 'A tea bowl I made in my second year. It was wrong in every technical sense. Something happened in the firing I have never been able to repeat. I kept it. It is the only piece I have kept.' },
          { fromName: 'Mei',   text: 'A bowl I made the week my mother died. I do not remember making it. I found it on the shelf after. I kept it for a year then gave it to someone who needed it.' },
          { fromName: 'Tomás', text: 'A vase I made after I stopped posting. First piece where I was not thinking about the photograph while I was throwing. You can feel the difference in the clay.' },
          { fromName: 'Amara', text: 'The first one I sold. Not because it was good. Because someone else decided it was worth something. That changed what making meant.' },
        ]
      },
      {
        persona: 'Lena', topic: 'Is the village for serious makers only?',
        messages: [
          { fromName: 'Lena',  text: 'I am not sure I am serious. I make things because I love it. I do not sell. I do not teach. Am I supposed to be here?' },
          { fromName: 'Carl',  text: 'I made for fifteen years before I sold anything. Making for joy is the most serious thing there is. You are exactly supposed to be here.' },
          { fromName: 'Kenji', text: 'The village is for people who make. What you do with what you make is your own matter.' },
          { fromName: 'Diane', text: 'I do not make at all. I am a collector. I am here. The village seems to think that is fine.' },
          { fromName: 'Tomás', text: 'The makers who make only for themselves are the ones nobody can manipulate. That is the most valuable kind of maker in the room.' },
        ]
      },
    ],

    process: [
      { persona: 'Kenji', personaId: 'sim-kenji', visibility: 'village', text: 'Third firing this month with the new clay body from Shigaraki. The colour is different from what I expected. Warmer. I am not sure if I prefer it. Continuing.' },
      { persona: 'Sofia', personaId: 'sim-sofia', visibility: 'village', text: 'Centred a full kilogram today without stopping. First time. Left it as a cylinder. Did not try to make it into anything. Just wanted to feel what it felt like at full height.' },
      { persona: 'Tomás', personaId: 'sim-tomas', visibility: 'village', text: 'Working on a series of tall forms with no foot ring. Sitting directly on the table. This feels wrong technically and right aesthetically. Continuing to see where it goes.' },
      { persona: 'Elena', personaId: 'sim-elena', visibility: 'village', text: 'New student joined the Thursday class. Twelve years of painting. Her hands understand pressure in a completely different way. Interesting to teach someone who already knows how to see.' },
      { persona: 'James', personaId: 'sim-james', visibility: 'village', text: 'Trying to make pieces that do not photograph well. That are better in the hand than in the image. This is harder than I expected. My instincts keep pulling toward the photogenic.' },
      { persona: 'Kofi',  personaId: 'sim-kofi',  visibility: 'village', text: 'Firing tomorrow. Sixty pieces. The preparation took four days. The firing will take one. The waiting will take three. The kiln always makes you wait.' },
      { persona: 'Mei',   personaId: 'sim-mei',   visibility: 'village', text: 'Calculated studio costs for the month. Clay, glaze, kiln electricity, packaging. Then calculated sales. The gap is narrowing. Still a gap. But narrowing.' },
      { persona: 'Noor',  personaId: 'sim-noor',  visibility: 'village', text: 'Workshop went well. Six students. One had thrown before and was unlearning bad habits. Harder to teach than a complete beginner. The old habits live in the muscles.' },
      { persona: 'Alix',  personaId: 'sim-alix',  visibility: 'village', text: 'Made my first bowl that holds water without leaking. This seems like a low bar. It took me four months. I am keeping this one.' },
      { persona: 'Carl',  personaId: 'sim-carl',  visibility: 'village', text: 'Made twelve small cups this week. Gave ten away. Kept two. No plan. Just making. This is the best week I have had in the studio in months.' },
      { persona: 'Kenji', personaId: 'sim-kenji', visibility: 'village', text: 'A student asked me to explain the foot ring. I talked for twenty minutes. I have been trimming foot rings for forty years and this is the first time I have had to say why out loud. The words were harder than the trimming.' },
      { persona: 'Jess',  personaId: 'sim-jess',  visibility: 'village', text: 'Back in the studio after two weeks away. Everything feels slightly wrong. The clay is the same. My hands are the same. Something in between has changed. This always happens after a break.' },
      { persona: 'Tomás', personaId: 'sim-tomas', visibility: 'village', text: 'Opened the kiln from last week. Two pieces I thought were ruined — the glaze moved in a direction I did not expect and produced something I could not have planned. Keeping both.' },
      { persona: 'Amara', personaId: 'sim-amara', visibility: 'village', text: 'Listed three pieces in the gallery today. Priced them honestly. Higher than I usually go. Scared. We will see.' },
      { persona: 'Lena',  personaId: 'sim-lena',  visibility: 'village', text: 'Went to a market on Saturday. Watched people pick up pieces and put them down. Watched what made them stop and look longer. Taking notes. Not selling yet. Just watching.' },
      { persona: 'Sofia', personaId: 'sim-sofia', visibility: 'village', text: 'Tried trimming for the first time. The leather hard stage is shorter than I thought. By the time I set up the wheel the clay was too dry. Reclaimed it. Next time I will be faster.' },
      { persona: 'Elena', personaId: 'sim-elena', visibility: 'village', text: 'Closed the studio to new students for the month. Need to make. Teaching and making pull in different directions for me. Some makers can do both at the same time. I cannot.' },
      { persona: 'Kofi',  personaId: 'sim-kofi',  visibility: 'village', text: 'My daughter watched me work today. She is seven. She asked why I do not use a mould. I said because the hand is smarter than the mould. She said how. I am still thinking about the answer.' },
      { persona: 'Mei',   personaId: 'sim-mei',   visibility: 'village', text: 'First commission from someone who found me through the village. They described what they wanted. I said I can make something in that direction but I cannot guarantee exactly that. They said that is fine. That is the right answer.' },
      { persona: 'Jess',  personaId: 'sim-jess',  visibility: 'village', text: 'Made the same form twenty times this week. A small bottle. Each one slightly different. By the twentieth I understood something about the form that I could not have understood from the first one.' },
    ],
  };

  // ── Helpers ───────────────────────────────────────────────────────
  function getBank() {
    const stored = localStorage.getItem(BANK_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch(e) {}
    }
    return DEFAULT_BANK;
  }

  function getSchedule() {
    const stored = localStorage.getItem(SCHEDULE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch(e) {}
    }
    return {
      bonfire : { lastTs: 0, nextIndex: 0 },
      table   : { lastTs: 0, nextIndex: 0 },
      process : { lastTs: 0, nextIndex: 0 },
    };
  }

  function saveSchedule(s) {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(s));
  }

  // ── Release functions ─────────────────────────────────────────────
  function releaseBonfire(item) {
    if (typeof addBonfireMessage === 'function') {
      addBonfireMessage(item.persona, item.text, '', false);
    }
  }

  function releaseTable(item) {
    // Build a table object compatible with cafeTables structure
    const now = Date.now();
    const tableId = 'sim_table_' + now;

    // Stagger message timestamps over the past few hours so the table looks organic
    const msgs = (item.messages || []).map((m, i) => ({
      from     : m.personaId || item.personaId || 'sim-' + (m.fromName || item.persona || 'unknown').toLowerCase().replace(/\s+/g,'-'),
      fromName : m.fromName,
      text     : m.text,
      ts       : now - (item.messages.length - 1 - i) * 45 * 60 * 1000, // 45-min gaps
    }));

    const table = {
      id          : tableId,
      topic       : item.topic,
      createdBy   : item.personaId || 'sim',
      createdAt   : now - msgs.length * 45 * 60 * 1000,
      lastActivity: now,
      messages    : msgs,
      sim         : true, // flag so we can identify sim-created tables
    };

    // cafeTables is a global var — push and persist
    if (typeof cafeTables !== 'undefined') {
      cafeTables.push(table);
      localStorage.setItem('clayVillageCommonsTables', JSON.stringify(cafeTables));
    }
  }

  function releaseProcess(item) {
    const PB_KEY = 'clayVillageProcessBoard';
    const entries = JSON.parse(localStorage.getItem(PB_KEY) || '[]');
    entries.push({
      id        : 'sim-pb-' + Date.now(),
      authorId  : item.personaId || 'sim-' + item.persona.toLowerCase(),
      text      : item.text,
      visibility: item.visibility || 'village',
      imageData : null,
      ts        : Date.now(),
      sim       : true,
    });
    localStorage.setItem(PB_KEY, JSON.stringify(entries));
  }

  const RELEASE_FNS = { bonfire: releaseBonfire, table: releaseTable, process: releaseProcess };

  // ── Core check — called on load and every 5 minutes ───────────────
  function checkAndRelease() {
    const bank     = getBank();
    const schedule = getSchedule();
    const now      = Date.now();
    let changed    = false;

    ['bonfire', 'table', 'process'].forEach(type => {
      const items = bank[type];
      if (!items || !items.length) return;

      const s        = schedule[type];
      const elapsed  = now - (s.lastTs || 0);
      const interval = INTERVALS[type];

      if (elapsed >= interval) {
        const idx  = (s.nextIndex || 0) % items.length;
        const item = items[idx];
        RELEASE_FNS[type](item);
        s.lastTs    = now;
        s.nextIndex = idx + 1;
        changed     = true;
      }
    });

    if (changed) saveSchedule(schedule);
  }

  // ── Public API ────────────────────────────────────────────────────
  // window.simRelease('bonfire') — force-release next item of a type (testing)
  // window.simStatus()           — return schedule snapshot
  // window.simResetSchedule()    — reset all lastTs to 0 (triggers immediate release)

  window.simRelease = function(type) {
    const bank     = getBank();
    const schedule = getSchedule();
    const items    = bank[type];
    if (!items || !items.length) { console.warn('Sim: no bank entries for', type); return; }
    const idx  = (schedule[type].nextIndex || 0) % items.length;
    RELEASE_FNS[type](items[idx]);
    schedule[type].lastTs    = Date.now();
    schedule[type].nextIndex = idx + 1;
    saveSchedule(schedule);
    console.log('Sim: released', type, idx, '→', items[idx].persona || items[idx].topic);
  };

  window.simStatus = function() {
    const s = getSchedule();
    const now = Date.now();
    ['bonfire','table','process'].forEach(type => {
      const due = Math.max(0, INTERVALS[type] - (now - s[type].lastTs));
      const mins = Math.round(due / 60000);
      console.log(type + ': next in ' + (mins > 60 ? Math.round(mins/60) + 'h' : mins + 'm') + ' · index ' + s[type].nextIndex);
    });
    return s;
  };

  window.simResetSchedule = function() {
    localStorage.removeItem(SCHEDULE_KEY);
    console.log('Sim: schedule reset — will release on next check');
  };

  // ── Replace bank content ──────────────────────────────────────────
  // Call window.simSetBank({ bonfire:[...], table:[...], process:[...] })
  // to swap in the real content bank without touching code.
  window.simSetBank = function(newBank) {
    localStorage.setItem(BANK_KEY, JSON.stringify(newBank));
    console.log('Sim: bank updated — bonfire:', newBank.bonfire?.length, 'table:', newBank.table?.length, 'process:', newBank.process?.length);
  };

  // ── Immediate seed — content that appears on first load, no timer ──
  function seedImmediateContent() {
    if (localStorage.getItem('_simContentSeeded')) return;

    // ── 1. Mentor Cluster — Wall (completed apprenticeships) ─────────
    const mcKey = 'clayVillageMentorCluster';
    const mcData = JSON.parse(localStorage.getItem(mcKey) || '{"requests":[],"agreements":[],"wall":[]}');

    const wallEntries = [
      {
        id: 'sim-wall-1', mentorId: 'sim-kenji', apprenticeId: 'sim-alix',
        mentorName: 'Kenji', apprenticeName: 'Alix',
        craft: 'Ceramics — centering and reading the clay', duration: '3 months',
        mentorPara: 'Alix asked questions I had not been asked in forty years. Not because the questions were new — because she had not yet learned which questions she was not supposed to ask. That freshness showed me things I had stopped seeing. I taught her how to centre. She taught me how to explain why centering matters. Both of those things were worth something.',
        apprenticePara: 'Kenji sent me one message a week. Sometimes two sentences. Sometimes one. I read each one many times. The most important thing he taught me was not a technique. It was that the clay knows before you do. I am still learning what that means but I think about it every session.',
        completedAt: Date.now() - 30 * 86400000, sim: true
      },
      {
        id: 'sim-wall-2', mentorId: 'sim-elena', apprenticeId: 'sim-sofia',
        mentorName: 'Elena', apprenticeName: 'Sofia',
        craft: 'Ceramics — first forms and studio practice', duration: '6 weeks',
        mentorPara: 'Sofia came in wanting to make vases. I made her throw cylinders for three weeks. She was frustrated. Then she made her first vase and understood why. The cylinder is not a step toward the vase. The cylinder is the whole lesson. She got that faster than most students I have worked with. That is rare.',
        apprenticePara: 'Elena told me to stop apologising for my pieces. I apologised for every piece I showed her — this one is a bit uneven, this one the rim is off. She said the piece does not need your apology. It needs your attention. I think about that every time I want to explain away something I made.',
        completedAt: Date.now() - 14 * 86400000, sim: true
      }
    ];
    mcData.wall = wallEntries.concat(mcData.wall || []);

    // ── 2. Mentor Cluster — Active apprenticeship ────────────────────
    const activeApp = {
      id: 'sim-agree-1', mentorId: 'sim-kofi', apprenticeId: 'sim-lena',
      mentorName: 'Kofi', apprenticeName: 'Lena',
      craft: 'Ceramics — surface and tradition',
      startDate: '2026-03-01', duration: 'Open ended',
      goal: 'Understanding how traditional surface techniques apply to contemporary forms',
      howWeKnow: 'Lena makes one piece influenced by something from Kofi\'s tradition. They discuss it. Repeat.',
      status: 'active', sim: true
    };
    if (!(mcData.agreements || []).some(a => a.id === 'sim-agree-1')) {
      mcData.agreements = mcData.agreements || [];
      mcData.agreements.push(activeApp);
    }
    localStorage.setItem(mcKey, JSON.stringify(mcData));

    // ── 3. Library — Journal entries ─────────────────────────────────
    const jKey = 'clayVillageJournals';
    const journals = JSON.parse(localStorage.getItem(jKey) || '[]');
    const simJournals = [
      { id: 'sim-jn-1', title: 'What stopping posting taught me about making', author: 'Tomás', date: 'Mar 2026',
        body: 'Six months without Instagram. I made more than in the year before. The pieces were different — slower, less concerned with the photograph, more concerned with the weight in the hand. I do not think this is because the algorithm is evil. I think it is because I was making decisions while throwing about how the piece would look in a square image at 1080 pixels. That is not a good way to make a vase. The vase does not care about the image. When I stopped thinking about the image the vase got better. That is all I know.' },
      { id: 'sim-jn-2', title: 'On the foot ring', author: 'Kenji', date: 'Mar 2026',
        body: 'The foot ring is where the piece meets the world. Everything else floats. The foot is the decision about how the piece sits on a table, in a hand, on a shelf. A high foot ring makes the piece feel elevated, held above the surface. A low foot ring makes it feel grounded, settled. No foot ring makes it feel raw, unfinished, or deliberately primitive depending on how everything else was done. I have been trimming foot rings for forty three years. A student asked me to explain this last week. It took me twenty minutes. I should have been able to say it in two. The gap between knowing and explaining — that is where teaching lives.' },
      { id: 'sim-jn-3', title: 'What I learned from watching a platform die', author: 'Mira', date: 'Feb 2026',
        body: 'I built a platform for artists. We raised money. We hired people. We had values written on the wall. Then we needed to grow faster to satisfy our investors. Every decision after that was a compromise. Not a dramatic one. Small ones. A metric here. A feature there. The values on the wall stayed the same. The decisions moved away from them slowly enough that nobody noticed until it was too late. The platform did not die from one bad decision. It died from a hundred small ones that each seemed reasonable at the time. I watch this village carefully. Not because I think it will fail. Because I know how it happens if it does.' },
      { id: 'sim-jn-4', title: 'I did not know there was a word for it', author: 'Alix', date: 'Mar 2026',
        body: 'Someone at the Bonfire described a bowl repaired with gold. The repair more beautiful than the original bowl. More valuable because of the breaking. There is a word for it — kintsugi. I looked it up. I have been doing this with other things my whole life. Relationships that broke and became more honest after. Work that failed and taught me something the success never would have. Ideas that I had to abandon before I found the real one underneath. I did not know there was a word. Having the word changes something. It makes the breaking intentional instead of accidental. I am not sure what to do with that yet.' },
      { id: 'sim-jn-5', title: 'Making for no one', author: 'Carl', date: 'Feb 2026',
        body: 'I have been making for nineteen years. For most of those years I made for someone — for the market, for an exhibition, for a commission, for Instagram. Last year I made a series of twelve bowls with no intention of selling or showing them. I gave ten away to neighbours and friends. I kept two. The two I kept are the best things I have made in ten years. I do not think this is a coincidence. When there is no audience the decisions are different. The form does not need to explain itself. The glaze does not need to photograph well. The piece only needs to be right. I am trying to remember this when I make things that will be seen.' },
      { id: 'sim-jn-6', title: 'Teaching from the kitchen', author: 'Noor', date: 'Jan 2026',
        body: 'I have taught pottery from my kitchen for three years. Six students maximum. The kitchen table becomes the wedging surface. The oven does not get used on workshop days. My wheel is in the corner where the dining table used to be. People ask me when I am going to get a proper studio. I tell them this is a proper studio. What they mean is — when will you have something that looks like a school. I do not want something that looks like a school. I want something that works. The kitchen works. Students come and they make and they leave with something. That is what a studio is for.' },
      { id: 'sim-jn-7', title: 'What I know about engagement systems', author: 'Peter', date: 'Jan 2026',
        body: 'I spent twenty years building systems designed to keep people on screens. I know exactly how they work. Variable reward schedules. Social validation loops. Fear of missing out engineered into notification timing. I was good at this. The products I built were used by hundreds of millions of people. I am not proud of this in the way I used to be. What I know is that the systems work because they exploit real human needs — for connection, for recognition, for belonging. The need is real. The exploitation of it is the problem. A platform that meets the real need without exploiting it — that is what I am watching for here. That is what I could not build in the places I worked. I do not know yet if it is possible. I am watching.' },
      { id: 'sim-jn-8', title: 'Ten sessions', author: 'Sofia', date: 'Mar 2026',
        body: 'I have had ten sessions at the wheel now. I counted. The first five I thought about stopping after every one. The clay did not do what I wanted. My hands did not know what they were supposed to do. Everything was frustrating and nothing was satisfying and I kept thinking — maybe this is not for me. Then something happened between session five and session six that I cannot explain. The clay started to feel like something I was in conversation with instead of something I was fighting. I do not centre well. I do not pull walls evenly. My pieces are uneven and my rims are not level. But I am in a conversation now. I think that is the beginning of something.' },
    ];
    // Merge — only add entries whose IDs are not already present
    const existingIds = new Set(journals.map(j => j.id));
    simJournals.forEach(j => { if (!existingIds.has(j.id)) journals.push(j); });
    localStorage.setItem(jKey, JSON.stringify(journals));

    // ── 4. Council — Replace proposals with 3 real ones ──────────────
    if (typeof councilData !== 'undefined') {
      councilData.proposals = [
        {
          id: 'sim-p1', title: 'What should the platform fee be on sales made through the village?',
          why: 'The village needs revenue to sustain its infrastructure. Makers need to feel the fee is fair. This is the first and most important economic decision the Council makes.',
          options: ['5% — minimum viable, maker-first', '8% — balanced, sustainable', '10% — platform-first, maximum growth'],
          deadline: Date.now() + 4 * 86400000,
          prevote: 'Mei, Amara, and Sofia strongly favour 5%. Marcus and Elena favour 10% arguing platform sustainability. Kenji and Peter support 8% as principled middle ground.',
          votes: { '5% — minimum viable, maker-first': 8, '8% — balanced, sustainable': 6, '10% — platform-first, maximum growth': 1 },
          abstentions: [{ persona: 'Marcus', note: 'I need to see the revenue model projections before I can vote on this.' }],
          status: 'active', sim: true
        },
        {
          id: 'sim-p2', title: 'Should AI-assisted work be permitted in the village Gallery?',
          why: 'Ren uses AI to generate forms and then throws them by hand. Kenji believes the hand must make all decisions. The village needs a position.',
          options: ['Yes — permitted with no disclosure required', 'Yes — permitted but must be disclosed on the piece listing', 'No — the Gallery is for hand-made work only'],
          deadline: Date.now() + 11 * 86400000,
          prevote: 'Ren, Alix and Zoe support permission. Kenji and Kofi oppose it strongly. Helen notes that museums already face this question.',
          votes: { 'Yes — permitted with no disclosure required': 2, 'Yes — permitted but must be disclosed on the piece listing': 9, 'No — the Gallery is for hand-made work only': 4 },
          abstentions: [{ persona: 'Alix', note: 'I am too new to know what I think about this yet.' }],
          status: 'active', sim: true
        },
        {
          id: 'sim-p3', title: 'Should the village ever accept outside investment?',
          why: 'The village needs infrastructure to grow. Outside investment could accelerate this. It could also change what decisions get made. The Council should decide this now before the question becomes urgent.',
          options: ['Yes — if terms protect the manifesto', 'No — the village funds itself through its own revenue or not at all', 'Decide when the moment arrives'],
          deadline: Date.now() + 7 * 86400000,
          prevote: 'Mira, Peter, Jess, and Kenji oppose investment entirely. Marcus supports it with protections. Elena is neutral — she cares about whether the platform works, not how it is funded.',
          votes: { 'Yes — if terms protect the manifesto': 3, 'No — the village funds itself through its own revenue or not at all': 11, 'Decide when the moment arrives': 2 },
          abstentions: [{ persona: 'Peter', note: 'I have seen what happens when platforms take money. I am not abstaining because I am unsure. I am abstaining because I want to see if this Council is capable of saying no when the money is real and not hypothetical.' }],
          status: 'active', sim: true
        }
      ];
      if (typeof saveCouncil === 'function') saveCouncil();
    }

    // ── 5. Residency Archive — 1 completed exchange ──────────────────
    const archKey = 'clayVillageExchangeArchive';
    const arch = JSON.parse(localStorage.getItem(archKey) || '[]');
    if (!arch.some(a => a.id === 'sim-arch-1')) {
      arch.push({
        id: 'sim-arch-1',
        who1: 'James', who1Location: 'Portland, Oregon', who1Craft: 'Ceramics',
        who2: 'Kofi', who2Location: 'Accra, Ghana', who2Craft: 'Ceramics',
        craft: 'Ceramics', duration: '2 weeks', year: '2025',
        para1: 'Kofi came to Portland in October. He used my cone 10 reduction kiln for the first time — his work is usually wood fired. The results surprised both of us. His forms do not change in different firing conditions. What changes is the surface conversation. The reduction kiln had things to say to his clay that the wood kiln does not. I watched him adjust his expectations in real time. That was worth more than anything I could have taught him.',
        para2: 'James has a beautiful kiln and a very clean studio. Too clean for my taste. By the end of the first week I had made enough mess that it felt like a working space. He did not complain. His cone 10 reduction is nothing like wood firing but it is also not nothing. My pieces came out with a quietness they do not usually have. I am not sure if I prefer it. I am sure it showed me something about my own work I could not have seen from home.',
        ts: Date.now() - 60 * 86400000, sim: true
      });
      localStorage.setItem(archKey, JSON.stringify(arch));
    }

    // Mark as seeded
    localStorage.setItem('_simContentSeeded', '1');
    console.log('Sim: immediate content seeded — wall(2), apprenticeship(1), journals(8), council(3), archive(1)');
  }

  // ── Boot: seed immediate content, then start timed releases ────────
  setTimeout(function() {
    seedImmediateContent();
    checkAndRelease();
  }, 2000);

  // ── Periodic check every 5 minutes ───────────────────────────────
  setInterval(checkAndRelease, 5 * 60 * 1000);

  // ── Console: reset seed flag to re-seed ──────────────────────────
  window.simReseed = function() {
    localStorage.removeItem('_simContentSeeded');
    seedImmediateContent();
    console.log('Sim: content re-seeded');
  };

})();
// ===== END VILLAGE SIMULATION ENGINE =====
