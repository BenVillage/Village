# MURA — SYNTHESISED MEMBER DATABASE
# Maya and James — 3 months in the village
# For: CLAUDE_CODE_BRIEF_SESSION_SUPABASE.md
# Table: member_language
# Purpose: Seeds Mura intelligence with real patterns from day one

---

## THE TWO MEMBERS

**Maya** — profile-maya
- Practice: Mixed — wheel throwing and hand building
- Craft age: 8 years
- Character: Experienced, precise, occasionally impatient with herself. Thinks in systems. Teaches without meaning to. Has sold work. Has a following. Came to the village because Instagram stopped feeling real.

**James** — profile-james
- Practice: Hand building — sculptural
- Craft age: 1 year
- Character: Beginner who thinks too much and makes too little. Writes beautifully about making. Afraid of the kiln. Came to the village because he didn't know anyone else who made things with their hands.

---

## DATABASE SCHEMA

Table: `member_language`

| field | type | description |
|---|---|---|
| id | uuid | unique entry id |
| member_id | string | profile-maya or profile-james |
| building | string | which building the entry came from |
| entry_type | string | process_note, journal, bonfire, wish, failure, interview, gallery_post, response_to_mura |
| content | text | what they wrote |
| timestamp | datetime | when they wrote it |
| word_count | integer | length of entry |
| tags | array | themes detected — hands, fear, time, selling, teaching, failure, identity, body, material |
| mura_triggered | boolean | did this entry trigger a Mura moment |
| mura_response | text | what Mura said if triggered |
| member_responded | boolean | did they respond to Mura |

---

## MAYA — 3 MONTHS OF ENTRIES

### Month 1 — January

---

**Entry M001**
- member_id: profile-maya
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-01-03 09:14
- content: "First day. This feels different from everywhere else I've tried. No follower count visible. I didn't realise how much that number was affecting me until it wasn't there."
- word_count: 34
- tags: [identity, platform, relief]
- mura_triggered: false

---

**Entry M002**
- member_id: profile-maya
- building: library
- entry_type: process_note
- timestamp: 2026-01-05 14:32
- content: "Been throwing mugs for six years. Still can't get the handle attachment right every time. The clay remembers stress in ways I don't fully understand. I score, I slip, I press — and sometimes it holds and sometimes it doesn't. Eight years in and it still feels like asking permission."
- word_count: 54
- tags: [hands, material, uncertainty, time, repetition]
- mura_triggered: false

---

**Entry M003**
- member_id: profile-maya
- building: studio
- entry_type: process_note
- timestamp: 2026-01-09 11:20
- content: "Made thirty mugs today. Sold twelve before they were even fired. That used to feel good. Today it just felt like work. I don't know when that changed."
- word_count: 33
- tags: [selling, identity, loss, production]
- mura_triggered: false

---

**Entry M004**
- member_id: profile-maya
- building: gallery
- entry_type: gallery_post
- timestamp: 2026-01-12 16:45
- content: "First piece posted here. A hand-built bowl. Asymmetric. I usually don't post the asymmetric ones."
- word_count: 18
- tags: [hand_building, vulnerability, asymmetry]
- mura_triggered: true
- mura_response: "ようこそ。\nWelcome.\n\nYou found your way here. That already means something.\n\nTake your time."
- member_responded: false

---

**Entry M005**
- member_id: profile-maya
- building: library
- entry_type: process_note
- timestamp: 2026-01-15 10:08
- content: "Hand building and wheel throwing use completely different muscles. Not just physically — mentally. Wheel throwing is about control, about centering, about negotiating with centrifugal force. Hand building is about surrender. You push and the clay pushes back and you have to decide how much to fight it. I've been throwing for eight years and I still find hand building humbling."
- word_count: 65
- tags: [hands, body, control, surrender, humility, material]
- mura_triggered: false

---

**Entry M006**
- member_id: profile-maya
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-01-18 20:33
- content: "James — your coil pot from yesterday. The unevenness at the top is not a mistake. Don't fix it."
- word_count: 18
- tags: [teaching, james, imperfection]
- mura_triggered: false

---

**Entry M007**
- member_id: profile-maya
- building: studio
- entry_type: failure
- timestamp: 2026-01-22 15:17
- content: "Lost a whole batch today. Twelve pieces. The kiln ran too hot and I didn't catch it. Eight years and I still make this mistake. The worst part isn't the pieces — it's the three weeks of work. You can't rush the drying. I always rush the drying."
- word_count: 50
- tags: [failure, kiln, time, rushing, loss, repetition]
- mura_triggered: false

---

**Entry M008**
- member_id: profile-maya
- building: library
- entry_type: journal
- timestamp: 2026-01-28 21:45
- content: "Why did I come here? I have a studio. I have buyers. I have — by every measure — a successful practice. But I've been making the same mugs for three years because mugs sell. I used to make things that scared me a little. I want to make things that scare me again."
- word_count: 55
- tags: [identity, fear, commercial, purpose, change]
- mura_triggered: false

---

### Month 2 — February

---

**Entry M009**
- member_id: profile-maya
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-02-02 09:55
- content: "Month two. The village feels real now. James posted his first complete sculptural piece yesterday. I remember feeling that way about my first piece. You don't get that feeling back."
- word_count: 36
- tags: [community, james, memory, beginnings]
- mura_triggered: false

---

**Entry M010**
- member_id: profile-maya
- building: studio
- entry_type: process_note
- timestamp: 2026-02-06 13:22
- content: "Started a new series. Not mugs. Large hand-built forms. No function. I don't know what they are yet. That's the point. I haven't worked this way in four years."
- word_count: 33
- tags: [hand_building, new_work, uncertainty, freedom, change]
- mura_triggered: false

---

**Entry M011**
- member_id: profile-maya
- building: library
- entry_type: process_note
- timestamp: 2026-02-10 11:40
- content: "The large forms are teaching me something about scale. When you work small — mugs, bowls — your hands are in control. When you work at body scale, the clay starts to have opinions. It wants to slump. It wants to crack. You have to work with its timeline not yours. I've been fighting the drying again. Same mistake, different scale."
- word_count: 62
- tags: [scale, hands, control, time, drying, material, repetition]
- mura_triggered: false

---

**Entry M012**
- member_id: profile-maya
- building: mentor
- entry_type: process_note
- timestamp: 2026-02-14 16:30
- content: "James asked me about firing temperatures today. I spent an hour explaining oxidation vs reduction. I don't think he needed all of that. I think he needed me to say: just fire it and see what happens. I over-explain because I'm afraid of being misunderstood. Old habit."
- word_count: 50
- tags: [teaching, james, over_explaining, fear, identity]
- mura_triggered: true
- mura_response: "You said you over-explain because you're afraid of being misunderstood.\n\nWhat would it feel like to be misunderstood and be okay with it?"
- member_responded: true
- member_response: "Probably freeing. I've been performing competence for so long I've forgotten what it's like to just not know."

---

**Entry M013**
- member_id: profile-maya
- building: gallery
- entry_type: gallery_post
- timestamp: 2026-02-18 14:15
- content: "First large form. I don't know what to call it. I've just called it Form 01. It cracked during drying and I fired it anyway. The crack is now the best thing about it."
- word_count: 36
- tags: [hand_building, large_form, crack, imperfection, wabi_sabi]
- mura_triggered: false

---

**Entry M014**
- member_id: profile-maya
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-02-22 19:44
- content: "Someone asked me today if the crack in Form 01 was intentional. I said yes. That was a lie. But maybe by the time I make Form 02 it will be true."
- word_count: 36
- tags: [intention, craft, honesty, evolution, imperfection]
- mura_triggered: false

---

**Entry M015**
- member_id: profile-maya
- building: library
- entry_type: journal
- timestamp: 2026-02-26 22:10
- content: "I haven't made a mug in six weeks. My buyers are asking. I don't know how to explain that I'm making something I can't sell yet and I don't care. That's new. I used to care very much."
- word_count: 43
- tags: [mugs, selling, change, identity, freedom, buyers]
- mura_triggered: false

---

### Month 3 — March

---

**Entry M016**
- member_id: profile-maya
- building: studio
- entry_type: process_note
- timestamp: 2026-03-03 10:15
- content: "Form 03 collapsed this morning. I'd been building it for two weeks. I sat with the collapsed clay for a long time before I did anything. Then I built something smaller from the wreckage. That smaller thing is better than the form would have been."
- word_count: 48
- tags: [failure, collapse, time, adaptation, emergence]
- mura_triggered: false

---

**Entry M017**
- member_id: profile-maya
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-03-07 09:30
- content: "James is ready to teach someone. He doesn't know it yet."
- word_count: 12
- tags: [james, teaching, readiness]
- mura_triggered: false

---

**Entry M018**
- member_id: profile-maya
- building: library
- entry_type: process_note
- timestamp: 2026-03-11 14:55
- content: "I've been thinking about why I rush the drying stage. I think it's because drying is waiting. And waiting means not knowing. The piece is finished but not finished. It could crack. It could warp. And I can't do anything about it. I rush it because I can't stand not being able to do anything."
- word_count: 59
- tags: [drying, rushing, control, uncertainty, patience, self_knowledge]
- mura_triggered: true
- mura_response: "余白。\nThe space that holds everything else.\n\nYou wrote in January that you always rush the drying. You've just told yourself why.\n\nWhat changes now that you know?"
- member_responded: true
- member_response: "Maybe nothing changes. Knowing why you do something doesn't always stop you doing it. But at least now I'm not pretending it's the clay's fault."

---

**Entry M019**
- member_id: profile-maya
- building: gallery
- entry_type: gallery_post
- timestamp: 2026-03-15 16:20
- content: "Form 05. The first one I'm not embarrassed by. Five forms to get here. That's the real price of the work — not the materials, not the kiln costs. The five that came before."
- word_count: 38
- tags: [large_form, progress, cost, process, milestone]
- mura_triggered: false

---

**Entry M020**
- member_id: profile-maya
- building: library
- entry_type: journal
- timestamp: 2026-03-20 21:30
- content: "Three months here. I've made five large forms, posted four of them, sold none of them, and I feel more like a maker than I have in four years. Something about this place makes the work feel real again. I think it's because nobody here cares how many followers I have."
- word_count: 55
- tags: [reflection, identity, three_months, platform, authenticity, selling]
- mura_triggered: false

---

**Entry M021**
- member_id: profile-maya
- building: mentor
- entry_type: process_note
- timestamp: 2026-03-25 15:40
- content: "Spent the afternoon with James. He's ready for the kiln. I didn't tell him what to expect. I want him to have his own experience of the first firing. Some knowledge you have to earn yourself."
- word_count: 40
- tags: [james, teaching, kiln, knowledge, letting_go]
- mura_triggered: false

---

**Entry M022**
- member_id: profile-maya
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-03-29 20:15
- content: "Made a mug today. First one in two months. It felt completely different. Like I was choosing it instead of defaulting to it. Same mug. Different maker."
- word_count: 30
- tags: [mugs, choice, identity, change, return]
- mura_triggered: true
- mura_response: "Same mug. Different maker.\n\nWhat is the difference between choosing something and defaulting to it?"
- member_responded: false

---

## JAMES — 3 MONTHS OF ENTRIES

### Month 1 — January

---

**Entry J001**
- member_id: profile-james
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-01-04 11:22
- content: "I've been making things for about a year. Mostly I make them and then hide them. I'm not sure why I'm here but it felt like the right place to figure that out."
- word_count: 34
- tags: [identity, hiding, uncertainty, beginnings]
- mura_triggered: true
- mura_response: "ようこそ。\nWelcome.\n\nYou found your way here. That already means something.\n\nTake your time."
- member_responded: false

---

**Entry J002**
- member_id: profile-james
- building: library
- entry_type: process_note
- timestamp: 2026-01-07 16:45
- content: "I've been building with coils. The technique feels honest to me — you can see exactly how the thing was made. Every coil is visible in the finished piece if you look. I like that. I'm not interested in hiding the process."
- word_count: 43
- tags: [coil_building, honesty, process, visibility, material]
- mura_triggered: false

---

**Entry J003**
- member_id: profile-james
- building: studio
- entry_type: process_note
- timestamp: 2026-01-10 14:30
- content: "Everything I make looks like it was made by someone learning. Which it was. I don't know if that's something to be embarrassed about or proud of. Both, maybe."
- word_count: 33
- tags: [learning, embarrassment, pride, beginner, identity]
- mura_triggered: false

---

**Entry J004**
- member_id: profile-james
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-01-13 19:55
- content: "Maya said something to me today about my coil pot — that the unevenness at the top is not a mistake. I've been thinking about that for two days. I think she's right but I don't fully believe it yet."
- word_count: 42
- tags: [maya, imperfection, belief, learning, unevenness]
- mura_triggered: false

---

**Entry J005**
- member_id: profile-james
- building: library
- entry_type: journal
- timestamp: 2026-01-17 22:10
- content: "I came to clay because I needed something that couldn't be done on a screen. My whole life is screens. I write on screens, I think on screens, I communicate on screens. Clay is the only thing I do where the mistake is permanent and the success is also permanent. Everything else is editable. Clay isn't. I think that's why it terrifies me."
- word_count: 67
- tags: [screens, hands, permanence, fear, mistake, identity, digital]
- mura_triggered: false

---

**Entry J006**
- member_id: profile-james
- building: studio
- entry_type: failure
- timestamp: 2026-01-21 15:20
- content: "Built a form for three days. A figure. Human scale — well, half human scale. It collapsed this morning. I came back to the studio and it had just... fallen. I stood there for a long time. Then I took a photo of the collapsed form. It looks better collapsed than it did standing. I'm not sure what that means."
- word_count: 62
- tags: [collapse, failure, figure, scale, photography, meaning]
- mura_triggered: false

---

**Entry J007**
- member_id: profile-james
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-01-25 09:40
- content: "I haven't fired anything yet. Ten months of making and nothing has been through a kiln. I keep saying it's not ready. I think I'm the one who's not ready."
- word_count: 33
- tags: [kiln, fear, readiness, avoidance, identity]
- mura_triggered: true
- mura_response: "Ten months of making. Nothing fired yet.\n\nWhat are you protecting?"
- member_responded: true
- member_response: "The possibility that it might be good. Once it's fired it's real. And real things can be disappointing."

---

**Entry J008**
- member_id: profile-james
- building: library
- entry_type: process_note
- timestamp: 2026-01-29 13:55
- content: "The coil technique means building slowly. You can only add so many coils before the weight becomes too much and the form starts to move. So you build, and wait, and build again. I've started to enjoy the waiting. I didn't expect that."
- word_count: 45
- tags: [coil_building, patience, waiting, time, surprise]
- mura_triggered: false

---

### Month 2 — February

---

**Entry J009**
- member_id: profile-james
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-02-03 10:15
- content: "Maya posted her first large form today. There's a crack in it and she fired it anyway. I've been thinking about that all day. I wouldn't have fired it. I would have started again."
- word_count: 37
- tags: [maya, crack, courage, comparison, avoidance]
- mura_triggered: false

---

**Entry J010**
- member_id: profile-james
- building: library
- entry_type: process_note
- timestamp: 2026-02-08 14:40
- content: "I've been building a series of small heads. Faces, really. Not portraits of anyone. Just faces that might exist. They're the first things I've made that I actually want to show people. I don't know why faces. Hands felt too obvious."
- word_count: 44
- tags: [faces, series, showing, hands, intuition, sculpture]
- mura_triggered: false

---

**Entry J011**
- member_id: profile-james
- building: studio
- entry_type: process_note
- timestamp: 2026-02-12 11:30
- content: "Maya spent an hour explaining oxidation and reduction firing to me. I understood about a third of it. What I took from it: the fire does things you can't predict. You load the kiln and then you let it go. That's the part she didn't say in words but that's what I heard."
- word_count: 55
- tags: [maya, kiln, fire, control, letting_go, learning]
- mura_triggered: false

---

**Entry J012**
- member_id: profile-james
- building: gallery
- entry_type: gallery_post
- timestamp: 2026-02-16 16:55
- content: "First piece posted. One of the faces. I almost didn't. Posted it in under thirty seconds before I could change my mind."
- word_count: 22
- tags: [first_post, faces, courage, speed, vulnerability]
- mura_triggered: true
- mura_response: "一期一会。\nThis moment. Only once.\n\nYou posted it before you could stop yourself.\n\nWhat made thirty seconds feel safer than thinking about it?"
- member_responded: true
- member_response: "Thinking about it gives the fear time to organise. Thirty seconds doesn't."

---

**Entry J013**
- member_id: profile-james
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-02-20 20:30
- content: "Someone said my face looked sad. It does. I didn't make it sad on purpose. It just came out that way. I think that's the most interesting thing that's happened to me making things — when the thing knows something you don't."
- word_count: 43
- tags: [faces, emotion, intuition, unconscious, meaning, sculpture]
- mura_triggered: false

---

**Entry J014**
- member_id: profile-james
- building: library
- entry_type: journal
- timestamp: 2026-02-24 22:45
- content: "Still haven't fired anything. The faces are bisque hard and sitting on my shelf. They've been there for three weeks. I pick them up and put them down. I know the kiln is the next step. I know Maya will help me. I know the worst that can happen is they crack. And I know that knowing all of this doesn't make it easier."
- word_count: 65
- tags: [kiln, fear, faces, knowing, maya, avoidance, crack]
- mura_triggered: false

---

**Entry J015**
- member_id: profile-james
- building: studio
- entry_type: process_note
- timestamp: 2026-02-28 13:20
- content: "Built my first large piece. Not as large as Maya's forms but larger than anything I've done. A figure, seated. Arms around its own knees. I don't know if it's about loneliness or comfort. Maybe it's about both at the same time."
- word_count: 45
- tags: [figure, large_scale, loneliness, comfort, ambiguity, sculpture]
- mura_triggered: false

---

### Month 3 — March

---

**Entry J016**
- member_id: profile-james
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-03-04 09:45
- content: "I fired the faces. Yesterday. Maya was there. Three of the five survived. One cracked completely. One cracked partially and is somehow better for it. I held the survivors for a long time. They felt different. Like they'd been through something."
- word_count: 44
- tags: [kiln, first_firing, faces, survival, crack, maya, transformation]
- mura_triggered: true
- mura_response: "守破離。\nLearn. Break. Become.\n\nYou said in January you were protecting the possibility that they might be good.\n\nWhat are you protecting now?"
- member_responded: true
- member_response: "Nothing, I think. Something changed in that kiln. I don't know what. But I'm not as careful as I was."

---

**Entry J017**
- member_id: profile-james
- building: library
- entry_type: process_note
- timestamp: 2026-03-08 14:10
- content: "The cracked face is the one people ask about most. I've stopped explaining that it wasn't intentional. I just say: the fire decided. Which is true."
- word_count: 30
- tags: [crack, fire, intention, letting_go, honesty, faces]
- mura_triggered: false

---

**Entry J018**
- member_id: profile-james
- building: studio
- entry_type: process_note
- timestamp: 2026-03-12 11:55
- content: "The seated figure is drying. I'm not rushing it. I keep thinking about what Maya said — that you can't rush the drying. I've been checking on it twice a day. Gently. Like it's something alive."
- word_count: 38
- tags: [drying, patience, maya, figure, care, alive]
- mura_triggered: false

---

**Entry J019**
- member_id: profile-james
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-03-16 19:20
- content: "I've started making more faces. Eight now. I want to make enough for a room. I don't know whose room. I don't know why a room. But that's where the work wants to go."
- word_count: 36
- tags: [faces, series, vision, intuition, room, scale]
- mura_triggered: false

---

**Entry J020**
- member_id: profile-james
- building: library
- entry_type: journal
- timestamp: 2026-03-20 23:00
- content: "Three months. I've fired work for the first time. I've posted work for the first time. I've shown work to people I don't know for the first time. None of it killed me. All of it changed me. I came here because I needed somewhere to figure out if I was actually a maker or just someone who played at making. I think I know the answer now."
- word_count: 70
- tags: [three_months, reflection, identity, maker, transformation, milestone]
- mura_triggered: false

---

**Entry J021**
- member_id: profile-james
- building: mentor
- entry_type: process_note
- timestamp: 2026-03-24 15:30
- content: "Maya suggested I might think about teaching a hand-building session for beginners. I laughed. I'm a beginner. She said: you remember what it's like to not know. That's more useful than you think."
- word_count: 37
- tags: [teaching, maya, beginner, knowledge, readiness, laughter]
- mura_triggered: true
- mura_response: "You remember what it's like to not know.\n\nMaya said that about you three weeks before she said it to you.\n\nWhat do you think she saw?"
- member_responded: false

---

**Entry J022**
- member_id: profile-james
- building: bonfire
- entry_type: bonfire
- timestamp: 2026-03-28 20:40
- content: "Fired the seated figure today. It survived. No cracks. I'm almost disappointed. The cracks teach you something. The perfect ones just sit there looking finished."
- word_count: 28
- tags: [kiln, figure, survival, crack, perfection, learning]
- mura_triggered: false

---

## MURA PATTERN ANALYSIS — What Mura knows after 3 months

### Maya — detected patterns:

**Recurring words:** hands, drying, rushing, control, mugs, selling, fear, eight years
**Theme arc:** commercial identity → reconnection with making → large forms → choosing vs defaulting
**Threshold crossings:** first post (Jan 12), first Mura response (Feb 14), first large form posted (Feb 18), three month reflection (Mar 20)
**Key unanswered question:** "What is the difference between choosing something and defaulting to it?" (Mar 29) — still open
**Silences:** Never entered the Wish Board. Never posted in the Failure Wall until prompted.
**The thing she hasn't said:** She mentions James teaching without saying she wants to teach again herself.

**Next Mura trigger ready:** Maya has not answered the Mar 29 question. It has been sitting for 3 days. Mura waits 7 more days then surfaces it differently — not the same question. A new angle.

---

### James — detected patterns:

**Recurring words:** faces, fear, kiln, hiding, crack, fired, ready
**Theme arc:** hiding → first post → first firing → beginning to teach
**Threshold crossings:** first Mura response (Jan 25 — protecting possibility), first post (Feb 16), first firing (Mar 4), teaching suggestion (Mar 24)
**Key unanswered question:** "What do you think she saw?" (Mar 24) — still open
**Silences:** Has never written about his life outside the village. Has never mentioned money, selling, or whether he wants to.
**The thing he hasn't said:** He describes every piece in terms of emotion but has never written the word "art". He is circling an identity claim he hasn't made yet.

**Next Mura trigger ready:** James posted his seated figure (Mar 28) and said perfect things are disappointing. This connects directly to his Jan 25 response about protecting possibility. Mura has something to say. Waiting 48 hours before speaking.

---

## FOR CLAUDE CODE — IMPLEMENTATION NOTES

This database seeds the `member_language` table with 44 real entries across 3 months.

Each entry maps directly to the schema fields.

The pattern analysis section tells Mura what it already knows — use this to pre-populate the pattern recognition layer so Mura can generate real questions from day one rather than waiting months for real data to accumulate.

Two Mura moments are ready to fire immediately on platform launch:

**For Maya:**
*物の哀れ。*
*The ache of passing things.*

*Four days ago you wrote: same mug, different maker.*

*What is the difference between choosing something and defaulting to it?*

**For James:**
*間 — the space between.*

*You said perfect things just sit there looking finished. In January you said you were protecting the possibility that they might be good.*

*What happened to that fear?*

These fire into the Mura window on first login after implementation.

---

*End of synthesised database — Maya and James — 3 months*
*44 entries. 8 Mura triggers. 5 responses. 3 open questions.*
*The village has a memory. Now it can speak.*
