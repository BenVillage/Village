// ==================== ROUNDTABLE ENGINE ====================

const RT_PERSONAS = [
  { id:'zoe', name:'Zoe', age:24, initials:'Z', identity:'TikTok potter. 1.2M followers.',
    quote:'Honestly? The algorithm is not the enemy. The algorithm found me. Without it nobody would know I exist. The perfect system gives creators reach.',
    want:'Reach. Growth. The algorithm working for her.', fear:'Losing her audience. Becoming invisible.', need:'Discovery tools that find her new followers.',
    obliqueQ:'Tell me about the last piece you posted that you were genuinely proud of. What did you do in the first hour after posting it?',
    obliqueA:'I refreshed the page maybe... forty times? I know that sounds bad. But I needed to know if people saw it. The piece was good. But if nobody saw it, did it matter?',
    gap:{ says:'The algorithm isn\'t everything', does:'Refreshes the like count every 3 minutes' },
    topics:{ algorithm:{stance:'pro',response:'The algorithm found me. Without it nobody would know I exist. Growth is not a dirty word.'}, metrics:{stance:'pro',response:'I need to know my reach. Numbers tell me if I\'m connecting.'}, community:{stance:'neutral',response:'Community is nice but I need an audience first. You can\'t have community without people.'}, discovery:{stance:'pro',response:'Show my work to people who don\'t know me yet. That\'s all I want.'}, monetisation:{stance:'pro',response:'Creators need to eat. If the platform doesn\'t help me earn, I\'ll use the one that does.'} },
    closingStatement:'Don\'t build a platform that hides people. That\'s not protection. That\'s a cage.'
  },
  { id:'kenji', name:'Kenji', age:67, initials:'K', identity:'Master ceramicist. 340 followers.',
    quote:'I have made tea bowls for forty-three years. I do not need a platform to tell me what my work is worth. What I need is for the right people to find it.',
    want:'The right 10 people, not 10,000 wrong ones.', fear:'His work being judged by people who don\'t understand it.', need:'Curated discovery. Quality over quantity.',
    obliqueQ:'When was the last time someone held one of your bowls for the first time? What did their hands do?',
    obliqueA:'A woman in Kyoto. She turned it three times before lifting it. She understood the weight was intentional. I knew immediately she was the right person.',
    gap:{ says:'I don\'t need a platform', does:'Remembers every serious collector who ever held his work' },
    topics:{ algorithm:{stance:'against',response:'Your algorithm sends me ten thousand wrong people and calls it success. I would rather have ten serious collectors.'}, metrics:{stance:'against',response:'Numbers mean nothing. One person who understands the work is worth more than a million who scroll past.'}, community:{stance:'neutral',response:'Community happens when the right people find each other. You cannot engineer it.'}, discovery:{stance:'pro',response:'Discovery that filters. Not discovery that broadcasts.'}, monetisation:{stance:'neutral',response:'I sell my work to collectors. The price reflects forty-three years of practice. I do not need a marketplace.'} },
    closingStatement:'Build for the work. Not for the numbers around the work.'
  },
  { id:'marcus', name:'Marcus', age:31, initials:'M', identity:'Venture capitalist.',
    quote:'A platform without engagement metrics is a platform nobody can monetize. Beautiful doesn\'t scale.',
    want:'A return. Numbers that go up.', fear:'Investing in something that can\'t scale.', need:'Proof of growth potential.',
    obliqueQ:'What\'s the last product you personally used every day that wasn\'t built to scale?',
    obliqueA:'My barber. He has four chairs. He doesn\'t want five. I\'ve gone there for nine years. ...I see what you\'re doing.',
    gap:{ says:'Scale is everything', does:'His most valued relationships are with small, intimate businesses' },
    topics:{ algorithm:{stance:'pro',response:'Engagement metrics drive ad revenue. Without impressions you can\'t sell advertising.'}, metrics:{stance:'pro',response:'Investors need a number that goes up. Monthly active users. Engagement rate. Retention.'}, community:{stance:'against',response:'Community doesn\'t scale. At some point you need network effects.'}, discovery:{stance:'neutral',response:'Discovery is just another word for growth. I care about conversion.'}, monetisation:{stance:'pro',response:'How do you make money without ads? Subscriptions cap your TAM. Show me the business model.'} },
    closingStatement:'I respect the vision. But vision doesn\'t pay back a Series A. Show me the model.'
  },
  { id:'elena', name:'Elena', age:38, initials:'E', identity:'Studio owner. Berlin.',
    quote:'I don\'t care about philosophy. I care about my twelve wheels being full six days a week.',
    want:'A better booking system. Customers.', fear:'Wasting time on a platform that doesn\'t fill seats.', need:'Bookings, deposits, reminders.',
    obliqueQ:'What happens in your studio in the last hour before everyone leaves?',
    obliqueA:'That\'s when the real conversations happen. Someone shows their piece and everyone gathers. Last week a student cried because her bowl came out perfect. ...That\'s not something a booking system gives you.',
    gap:{ says:'I don\'t need community', does:'Her studio already IS a community — she just calls it a business' },
    topics:{ algorithm:{stance:'neutral',response:'I don\'t care about algorithms. I care about whether your platform fills my classes better than Google Ads.'}, metrics:{stance:'neutral',response:'The only metric I care about is bookings per week.'}, community:{stance:'against',response:'I don\'t need community. I need customers.'}, discovery:{stance:'pro',response:'Help students in Berlin find my studio. That\'s discovery that matters.'}, monetisation:{stance:'pro',response:'If your platform handles bookings and takes a fair cut, fine. If it doesn\'t do bookings, it\'s useless to me.'} },
    closingStatement:'Come back when you have a booking system. Then we\'ll talk about philosophy.'
  },
  { id:'raj', name:'Raj', age:29, initials:'R', identity:'Growth hacker. Ex-social platforms.',
    quote:'Every platform that killed engagement metrics died. Ello, Vero, Mastodon — all failed to reach critical mass.',
    want:'To be right. He\'s seen this before.', fear:'Being wrong — that this actually works.', need:'To be shown something genuinely new.',
    obliqueQ:'Is there a community you\'re part of that you\'ve never tried to grow?',
    obliqueA:'My climbing gym. About sixty regulars. Nobody\'s trying to scale it. It just... works. But that\'s different.',
    gap:{ says:'Humans are tribal and status-seeking by nature', does:'His most meaningful community has no metrics at all' },
    topics:{ algorithm:{stance:'pro',response:'Take away follower counts and people find something else to compete on. Craft age will become the new follower count.'}, metrics:{stance:'pro',response:'Without metrics people don\'t know if they\'re succeeding. Ambiguity kills engagement.'}, community:{stance:'neutral',response:'Community requires activation energy. Without gamification you can\'t generate it at scale.'}, discovery:{stance:'pro',response:'The cold start problem will kill you. How do you get the first thousand users without a growth loop?'}, monetisation:{stance:'pro',response:'Ethical platforms that can\'t monetise die ethical and broke.'} },
    closingStatement:'I\'ve seen this movie before. Prove me wrong. I genuinely hope you can.'
  },
  { id:'diane', name:'Diane', age:55, initials:'D', identity:'Serious collector. Zürich.',
    quote:'I want trust. I want provenance. I want the relationship with the maker, not with the platform.',
    want:'Exactly what the village is building.', fear:'Beautiful photos hiding mediocre work.', need:'Craft age, story cards, maker verification.',
    obliqueQ:'Tell me about a piece you bought that disappointed you. What did you learn?',
    obliqueA:'A yunomi from Instagram. Beautiful photograph. When it arrived the foot was rough, the glaze was uneven in the wrong way. Six months of practice pretending to be six years. I felt foolish. I stopped buying online for a year.',
    gap:{ says:'I want trust and provenance', does:'Exactly that — she is the customer who already exists' },
    topics:{ algorithm:{stance:'against',response:'The algorithm shows me beautiful photographs with no context. I\'ve been burned.'}, metrics:{stance:'against',response:'Follower count tells me nothing about skill. Craft age would.'}, community:{stance:'pro',response:'I want a relationship with the maker. That IS community.'}, discovery:{stance:'pro',response:'I want to discover makers I can trust. Not just makers who photograph well.'}, monetisation:{stance:'neutral',response:'I pay premium for real work. The platform should facilitate that, not extract from it.'} },
    closingStatement:'Build what you described. I\'m already your customer. I\'ve been waiting for this.'
  },
  { id:'james', name:'James', age:42, initials:'J', identity:'Etsy seller. Top 1% ceramics.',
    quote:'I make $180,000 a year on Etsy. My SEO is perfect. Why would I leave?',
    want:'To not risk what he\'s built.', fear:'Starting over.', need:'Proof that this works before he moves.',
    obliqueQ:'When you\'re making a piece, do you think about the listing title first or last?',
    obliqueA:'...First. I know which keywords convert before I throw the clay. That\'s... that\'s not something I\'m proud of, if I\'m honest.',
    gap:{ says:'The system works perfectly', does:'Has optimised the art out of his own process' },
    topics:{ algorithm:{stance:'pro',response:'Etsy\'s algorithm works for me. I rank for every keyword I target.'}, metrics:{stance:'pro',response:'I track conversion rate, views, favorites, revenue per listing. It works.'}, community:{stance:'against',response:'I don\'t need community. I need traffic.'}, discovery:{stance:'neutral',response:'Come back when you have 100,000 users.'}, monetisation:{stance:'pro',response:'Show me revenue potential that matches what I already earn.'} },
    closingStatement:'I\'m not against what you\'re building. I\'m against risking what I\'ve already built. Come back with traffic.'
  },
  { id:'amara', name:'Amara', age:23, initials:'A', identity:'Fine arts graduate. Broke.',
    quote:'I just want to sell my work without giving 40% to a gallery and another 10% to a platform.',
    want:'Economic dignity. Rent paid from craft.', fear:'That making art means being poor forever.', need:'Low fees, direct sales, fair economics.',
    obliqueQ:'What do you tell people when they ask what you do?',
    obliqueA:'I say I\'m freelancing. I don\'t say I\'m a potter. Because when I say I\'m a potter, the next question is always about money, and I don\'t have a good answer.',
    gap:{ says:'I just want fair economics', does:'Can\'t even claim her identity because the economics won\'t let her' },
    topics:{ algorithm:{stance:'neutral',response:'I don\'t care about algorithms. I care about rent.'}, metrics:{stance:'neutral',response:'The only metric I care about is: can I pay rent this month.'}, community:{stance:'pro',response:'Community might help. If other makers buy from each other, that\'s something.'}, discovery:{stance:'pro',response:'Help people find my work. I can\'t afford ads.'}, monetisation:{stance:'pro',response:'Take less than 10%. Let the money go to the person who made the thing.'} },
    closingStatement:'Is that so complicated? The money goes to the maker. That\'s it.'
  },
  { id:'peter', name:'Peter', age:61, initials:'P', identity:'Former Facebook product director.',
    quote:'Every platform starts with the right values and ends with the wrong incentives. I\'ve seen it forty times.',
    want:'To be proven wrong.', fear:'That this one gets corrupted too.', need:'A business model that aligns with values.',
    obliqueQ:'When you left Facebook, what did you build for yourself?',
    obliqueA:'A garden. Stone paths. I laid every one by hand. It took fourteen months. Nobody saw it but my wife. It was the first thing I\'d made in twenty years that wasn\'t optimised for anything.',
    gap:{ says:'I\'ve seen too many good ideas corrupted', does:'Already knows what making without metrics feels like — he just left it behind for decades' },
    topics:{ algorithm:{stance:'against',response:'Algorithms serve the platform, not the user. I\'ve built them. I know.'}, metrics:{stance:'against',response:'Metrics become targets. Targets become incentives. Incentives become corruption.'}, community:{stance:'pro',response:'Real community doesn\'t need gamification. It needs shared purpose.'}, discovery:{stance:'neutral',response:'Discovery is fine. Algorithmic amplification is not.'}, monetisation:{stance:'neutral',response:'The only platforms that kept their soul found a model that aligned with values. Which one are you?'} },
    closingStatement:'I hope you\'re the one that proves me wrong. I really do. But I\'ve hoped before.'
  },
  { id:'sofia', name:'Sofia', age:19, initials:'S', identity:'Two weeks into pottery. Buenos Aires.',
    quote:'I just want to find someone to teach me. I don\'t care about business models.',
    want:'A teacher. Someone to tell her what she\'s doing wrong.', fear:'Giving up before she gets good.', need:'Mentorship. Accessible guidance.',
    obliqueQ:'What happened the last time you tried to centre the clay?',
    obliqueA:'It flew off the wheel and hit the wall. I laughed so hard. Then I cried a little. Then I tried again. I don\'t know why I keep trying. I just... need to.',
    gap:{ says:'I just want a teacher', does:'Already has the most important thing — she can\'t stop' },
    topics:{ algorithm:{stance:'neutral',response:'I don\'t know what an algorithm is. I just want someone to help me centre.'}, metrics:{stance:'neutral',response:'I don\'t have any followers. I just want to learn.'}, community:{stance:'pro',response:'Other beginners? Yes please. I thought I was the only one this bad.'}, discovery:{stance:'neutral',response:'I found pottery on YouTube. That worked fine.'}, monetisation:{stance:'neutral',response:'I can\'t pay much. But I would pay something for a real teacher.'} },
    closingStatement:'Can the village do that? Just... help me find someone who\'ll show me what I\'m doing wrong?'
  },
  { id:'lena', name:'Lena', age:34, initials:'L', identity:'Casual buyer. Bought one mug at a market.',
    quote:'I found this mug at a craft market and I think about it every day. I want more things like this but I have no idea where to look.',
    want:'To find more handmade things that feel right.', fear:'Being overwhelmed by a world she doesn\'t understand.', need:'Simple, trust-based discovery for non-experts.',
    obliqueQ:'Where is the mug right now?',
    obliqueA:'Front of the shelf. I moved the other mugs behind it. My husband thinks I\'m being ridiculous. But every morning I choose that one.',
    gap:{ says:'I want more things like this', does:'Already has a deep emotional relationship with craft — just doesn\'t have the language for it' },
    topics:{ algorithm:{stance:'neutral',response:'I don\'t follow pottery accounts. I just want someone to show me where to find beautiful things.'}, metrics:{stance:'neutral',response:'I don\'t care about numbers. I care about whether the thing feels right in my hand.'}, community:{stance:'neutral',response:'Community sounds intimidating. I just want to buy.'}, discovery:{stance:'pro',response:'Yes. Help me find things. I don\'t know where to look.'}, monetisation:{stance:'neutral',response:'I\'ll pay fair prices. I just need to find the makers.'} },
    closingStatement:'I\'m not a pottery person. I just know what I love when I hold it.'
  },
  { id:'tomas', name:'Tomás', age:36, initials:'T', identity:'Burned maker. Quit sharing.',
    quote:'I tried Instagram for two years. Posted consistently. Got 4,000 followers and sold almost nothing. Sharing broke something.',
    want:'To make without performing.', fear:'Every new platform is the same lie.', need:'Proof that this is genuinely different.',
    obliqueQ:'Do you still make every day?',
    obliqueA:'Every day. I just don\'t show anyone. The work got better the moment I stopped photographing it.',
    gap:{ says:'Sharing broke something', does:'The work literally improved when he stopped performing — the evidence is in the clay' },
    topics:{ algorithm:{stance:'against',response:'The algorithm made me optimise for photos instead of pots. I made worse work trying to make it photograph well.'}, metrics:{stance:'against',response:'4,000 followers. Almost zero sales. The metrics lied to me for two years.'}, community:{stance:'neutral',response:'I\'d want community on my terms. No pressure to post.'}, discovery:{stance:'neutral',response:'I\'m not sure I want to be discovered again. Maybe. If it\'s different.'}, monetisation:{stance:'neutral',response:'I\'d sell if someone came to me. I won\'t perform to attract them.'} },
    closingStatement:'I need to see it working for someone like me before I trust it.'
  },
  { id:'noor', name:'Noor', age:41, initials:'N', identity:'Kitchen teacher. No studio.',
    quote:'I teach from my kitchen table. One student at a time. I\'m the best teacher most of my students have ever had and no institution knows I exist.',
    want:'Recognition without institutionalisation.', fear:'Being invisible because she doesn\'t have a studio.', need:'A way to be found by students without overhead.',
    obliqueQ:'What happens when a student finishes their first piece in your kitchen?',
    obliqueA:'We have tea. We look at it together. Sometimes for a long time. That moment — that\'s what a studio can\'t replicate. It\'s intimate. It\'s home.',
    gap:{ says:'I just need students to find me', does:'Has created something studios can\'t — she just doesn\'t know how to scale the intimacy' },
    topics:{ algorithm:{stance:'neutral',response:'I don\'t need an algorithm. I need students in my city to find me.'}, metrics:{stance:'neutral',response:'I track nothing. I just know who comes back.'}, community:{stance:'pro',response:'A network of kitchen teachers? That would be beautiful.'}, discovery:{stance:'pro',response:'Local discovery. Let someone in my neighbourhood find me.'}, monetisation:{stance:'pro',response:'I charge fairly. I just need enough students to keep going.'} },
    closingStatement:'Build something that sees me. That\'s all I ask.'
  },
  { id:'mei', name:'Mei', age:45, initials:'Me', identity:'Maker\'s partner.',
    quote:'I love what my husband makes. I hate what it costs us. Every kiln firing is $200 we don\'t have.',
    want:'For the craft to pay for itself.', fear:'The craft destroying the family finances.', need:'Economic sustainability for makers\' households.',
    obliqueQ:'What do you see in his face when he opens the kiln?',
    obliqueA:'Everything. That\'s the problem. I see everything I fell in love with. And then I see the electricity bill.',
    gap:{ says:'I need economic sustainability', does:'She already knows the work matters — the gap is between meaning and money' },
    topics:{ algorithm:{stance:'neutral',response:'I don\'t care about algorithms. I care about whether this month breaks even.'}, metrics:{stance:'neutral',response:'The only metric is: can we keep the kiln running.'}, community:{stance:'neutral',response:'Community is nice. Income is necessary.'}, discovery:{stance:'pro',response:'Help people find his work. He won\'t promote himself.'}, monetisation:{stance:'pro',response:'Low fees. Direct sales. Make the economics work for the household, not just the maker.'} },
    closingStatement:'Build something that lets him keep making without me worrying every month.'
  },
  { id:'kofi', name:'Kofi', age:58, initials:'Ko', identity:'Ghanaian kente weaver. 500-year tradition.',
    quote:'My craft is older than your internet. I do not need validation from a Silicon Valley platform. But my granddaughter needs to eat.',
    want:'Economic infrastructure without cultural extraction.', fear:'His tradition being flattened into content.', need:'Global collectors, invoicing, fair trade — without performing.',
    obliqueQ:'What do you teach your apprentices that has nothing to do with weaving?',
    obliqueA:'Patience. Silence. How to sit with a pattern for three days before beginning. The loom teaches everything else.',
    gap:{ says:'I don\'t need the internet', does:'His tradition is the most sophisticated design system at this table — it just predates the digital world' },
    topics:{ algorithm:{stance:'against',response:'My cloth is not content. Do not put it in a feed.'}, metrics:{stance:'against',response:'The value of my work is not measured in followers.'}, community:{stance:'neutral',response:'I have community. Four apprentices and forty years of tradition.'}, discovery:{stance:'pro',response:'Connect me with collectors who understand what they are buying. Not tourists.'}, monetisation:{stance:'pro',response:'Fair invoicing. International shipping. Payment that reaches me. These are problems worth solving.'} },
    closingStatement:'Build the infrastructure. Leave the culture alone.'
  },
  { id:'alix', name:'Alix', age:20, initials:'Al', identity:'Gen Z. Never touched clay.',
    quote:'Everything online feels fake now. I don\'t know what\'s real anymore. I want things made by humans but I don\'t know how to find them.',
    want:'Authenticity in a synthetic world.', fear:'Not being able to tell what\'s real.', need:'A space that feels human without requiring them to make anything.',
    obliqueQ:'What\'s the last object you touched that made you feel something?',
    obliqueA:'A ceramic bowl at my grandmother\'s house. It has a crack that was repaired with gold. She said someone fixed it because it was worth keeping. I think about that a lot.',
    gap:{ says:'I don\'t know what\'s real anymore', does:'Already knows — she just described kintsugi without knowing the word' },
    topics:{ algorithm:{stance:'against',response:'I\'m so tired of algorithms. Everything looks the same. Everything feels manufactured.'}, metrics:{stance:'against',response:'Likes are meaningless. I stopped posting a year ago.'}, community:{stance:'pro',response:'I want to be around people who make things. Even if I don\'t make anything.'}, discovery:{stance:'pro',response:'Show me things that are real. That\'s enough.'}, monetisation:{stance:'neutral',response:'I\'d buy handmade things if I could find them and afford them.'} },
    closingStatement:'I don\'t need to make anything. I just need to be near people who do.'
  },
  { id:'jess', name:'Jess', age:33, initials:'Je', identity:'Lost 200K followers when Vine died.',
    quote:'I built an audience of 200,000 on someone else\'s platform. Then they turned off the lights. I lost everything overnight.',
    want:'To never build on someone else\'s land again.', fear:'Trusting any platform ever again.', need:'Ownership. Portability. Guarantees.',
    obliqueQ:'If this platform shut down tomorrow, what would you need to take with you?',
    obliqueA:'My customer list. My work history. My reputation. The relationships. Everything Vine took from me. I need to own it. All of it.',
    gap:{ says:'I\'ll never trust a platform again', does:'Is here at this table — which means she still hopes' },
    topics:{ algorithm:{stance:'against',response:'Every algorithm is a landlord. You build on their land, they change the rules.'}, metrics:{stance:'against',response:'200,000 followers. Gone overnight. Metrics on someone else\'s platform are not yours.'}, community:{stance:'pro',response:'Community you own is the only thing worth building.'}, discovery:{stance:'neutral',response:'I\'ll handle my own discovery. Just give me the tools and get out of the way.'}, monetisation:{stance:'pro',response:'Let me sell directly. Let me keep my customer data. Let me leave if I want to.'} },
    closingStatement:'Let me own my presence. Let me take it with me if I leave. That\'s the only thing that matters.'
  }
];

const RT_CONFLICTS = [
  { a:'zoe', b:'kenji', tension:'Zoe needs mass reach to survive. Kenji needs mass reach to disappear. The same discovery system cannot serve both unless it gives each control over who finds them.', solution:'Visibility controls per maker — choose between broadcast, curated, or invite-only. Each maker sets their own reach.', status:'amber' },
  { a:'marcus', b:'peter', tension:'Marcus needs growth metrics to justify investment. Peter knows growth metrics corrupt platforms. The business model cannot depend on engagement without eventually sacrificing values.', solution:'Revenue from memberships and marketplace fees, not ads. Growth measured by maker income, not engagement.', status:'amber' },
  { a:'zoe', b:'tomas', tension:'Zoe thrives on sharing. Tomás was broken by it. The platform must make sharing feel safe for the burned without restricting reach for those who want it.', solution:'No mandatory posting. Presence without performance. Studio doors can be open or closed.', status:'green' },
  { a:'james', b:'amara', tension:'James won\'t move without traffic. Amara can\'t wait for traffic. The early platform must serve the broke maker while somehow attracting the successful one.', solution:'Free tier for makers like Amara. Premium tools that attract makers like James once critical mass exists.', status:'red' },
  { a:'elena', b:'sofia', tension:'Elena needs customers with money. Sofia needs a teacher who\'s affordable. The workshop system must balance teacher economics with student accessibility.', solution:'Sliding scale workshops. Scholarship spots funded by premium bookings.', status:'amber' },
  { a:'kofi', b:'zoe', tension:'Kofi\'s tradition spans 500 years. Zoe\'s practice spans 5. The same platform must respect deep mastery without gatekeeping beginners.', solution:'Craft age is visible but never used for ranking. Years of practice inform, not exclude.', status:'green' },
  { a:'diane', b:'james', tension:'Diane wants provenance and trust. James wants SEO and conversion. Discovery optimised for collectors conflicts with discovery optimised for volume sales.', solution:'Two discovery modes: curator (for collectors) and marketplace (for buyers). Different lenses on the same makers.', status:'amber' },
  { a:'lena', b:'kofi', tension:'Lena doesn\'t know the word ceramicist. Kofi has been a master for 40 years. The platform must welcome the ignorant buyer without trivialising the expert maker.', solution:'Story Cards that educate the buyer while respecting the maker. The learning happens naturally through the object.', status:'green' },
  { a:'raj', b:'jess', tension:'Raj believes all ethical platforms fail at scale. Jess knows platform dependency destroys people. If Raj is right, Jess can never trust the platform. If Jess is right, the platform must be different from everything Raj has seen.', solution:'Data portability as a core feature. Makers own everything. If the platform fails, they leave whole.', status:'green' },
  { a:'mei', b:'marcus', tension:'Mei needs the craft to pay rent. Marcus needs the craft to generate returns. Investor incentives and maker household economics rarely align.', solution:'No outside investment model. Community-funded. Revenue goes to makers first, platform second.', status:'red' },
  { a:'noor', b:'elena', tension:'Noor teaches from her kitchen. Elena has twelve wheels. The platform must serve the informal teacher without undermining the professional studio.', solution:'Both are listed as teachers. Students choose based on style, location, and price — not studio size.', status:'green' },
  { a:'alix', b:'kenji', tension:'Alix wants to be near makers without making anything. Kenji doesn\'t want spectators. How do you welcome the audience without disturbing the artist?', solution:'Observation mode. Alix can follow the village without appearing in anyone\'s studio unless invited.', status:'amber' }
];

const RT_REQUIREMENTS = [
  { text:'Makers must own their data and be able to export everything at any time.', level:'green', supporters:['jess','peter','tomas','amara','kofi'], opposers:[] },
  { text:'No algorithmic feed. Discovery is intentional, not addictive.', level:'amber', supporters:['kenji','peter','tomas','diane','kofi','alix'], opposers:['zoe','raj','marcus'] },
  { text:'Craft age (years of practice) is visible on every maker profile.', level:'green', supporters:['diane','kenji','peter','kofi','lena'], opposers:[] },
  { text:'Platform fees below 10% on all transactions.', level:'green', supporters:['amara','mei','kofi','jess','elena'], opposers:['marcus'] },
  { text:'Workshop booking system with deposits, reminders, and calendar integration.', level:'green', supporters:['elena','noor','sofia'], opposers:[] },
  { text:'Mentor matching system for beginners.', level:'green', supporters:['sofia','noor','lena'], opposers:[] },
  { text:'No follower counts visible on profiles.', level:'red', supporters:['kenji','peter','tomas','alix'], opposers:['zoe','raj','james'] },
  { text:'Maker Story Cards with provenance, process photos, and material details.', level:'green', supporters:['diane','kenji','lena','kofi'], opposers:[] },
  { text:'Revenue model based on memberships and marketplace fees — no advertising.', level:'amber', supporters:['peter','amara','jess','tomas'], opposers:['marcus','raj'] },
  { text:'Visibility controls: broadcast, curated, or invite-only.', level:'green', supporters:['kenji','tomas','zoe','kofi'], opposers:[] },
  { text:'Two discovery modes: curator (for collectors) and marketplace (for volume).', level:'amber', supporters:['diane','james','lena'], opposers:['kenji'] },
  { text:'Free tier for makers. Premium tools for established sellers.', level:'amber', supporters:['amara','sofia','noor'], opposers:['marcus'] },
  { text:'Observation mode: non-makers can be present without pressure to create.', level:'green', supporters:['alix','lena','mei'], opposers:[] },
  { text:'Data portability: if the platform shuts down, makers leave whole.', level:'green', supporters:['jess','peter','tomas','kofi'], opposers:[] },
  { text:'No mandatory posting or activity requirements.', level:'green', supporters:['tomas','kenji','kofi','mei'], opposers:['raj'] }
];

const RT_AMBIENT = [
  { a:'zoe', b:'kenji', text:'"But if nobody sees your work—" "The right person sees it. That is enough."' },
  { a:'marcus', b:'amara', text:'"Show me the revenue model." "Show me the rent money."' },
  { a:'peter', b:'raj', text:'"I built the thing you\'re defending." "And then you left."' },
  { a:'sofia', b:'noor', text:'"Can you teach me to centre?" "Sit down. We\'ll start now."' },
  { a:'jess', b:'zoe', text:'"Your 1.2 million followers aren\'t yours." "...I know."' },
  { a:'diane', b:'james', text:'"Your SEO is perfect. But is the glaze?" "That\'s not fair."' },
  { a:'mei', b:'marcus', text:'"My husband opens the kiln and his face lights up." "And the P&L?"' },
  { a:'tomas', b:'zoe', text:'"I stopped posting and the work got better." "I started posting and people found me."' },
  { a:'kofi', b:'alix', text:'"The crack repaired with gold — that is kintsugi." "There\'s a word for it?"' },
  { a:'elena', b:'noor', text:'"Twelve wheels." "One kitchen table." "Same thing, honestly." "...Really?"' },
  { a:'lena', b:'diane', text:'"I bought one mug and I think about it every day." "That\'s how it starts."' },
  { a:'raj', b:'jess', text:'"Critical mass or death." "I had critical mass. Then death anyway."' },
  { a:'peter', b:'sofia', text:'"I built Facebook." "Can you help me centre clay?" "...No. But I admire that that\'s what you need."' },
  { a:'amara', b:'james', text:'"$180,000 a year." "And I can\'t make rent." "...I started where you are."' },
  { a:'kofi', b:'marcus', text:'"My craft is 500 years old." "But what\'s the TAM?" "I do not know that word and I do not need to."' }
];

// === STATE ===
var rtData = null;
function ensureRtData() {
  if (!rtData) {
    rtData = loadWithDefaults('clayVillageRoundtable', { interviewResults: {}, systemScore: 0 });
  }
  if (!rtData || !rtData.interviewResults) rtData = { interviewResults: {}, systemScore: 0 };
}
var rtCurrentTab = 'table';
var rtSelectedPersona = null;
var rtInterviewActive = false;
var rtInterviewPersonaId = null;
var rtInterviewMessages = [];
var rtInterviewStep = 0;
var rtBubbleInterval = null;

// === OPEN / CLOSE ===
function openRoundtable() {
  ensureRtData();
  document.getElementById('roundtable-overlay').style.display = 'flex';
  rtCurrentTab = 'table';
  renderRtTab('table');
  startRtBubbles();
  var _tc = document.getElementById('top-controls');
  var _vn = document.getElementById('village-name-label');
  if (_tc) _tc.style.display = 'none';
  if (_vn) _vn.style.display = 'none';
}
function closeRoundtable() {
  document.getElementById('roundtable-overlay').style.display = 'none';
  stopRtBubbles();
  var _tc = document.getElementById('top-controls');
  var _vn = document.getElementById('village-name-label');
  if (_tc) _tc.style.display = '';
  if (_vn) _vn.style.display = '';
}

// === TAB SWITCHING ===
document.getElementById('rt-tabs').addEventListener('click', e => {
  const tab = e.target.closest('.rt-tab');
  if (!tab) return;
  const name = tab.dataset.rtTab;
  document.querySelectorAll('.rt-tab').forEach(t => t.classList.toggle('active', t === tab));
  rtCurrentTab = name;
  renderRtTab(name);
});

function renderRtTab(name) {
  ['table','interview','conflicts','requirements'].forEach(v => {
    document.getElementById('rt-view-' + v).style.display = v === name ? 'block' : 'none';
  });
  document.getElementById('rt-profile-card').classList.remove('open');
  if (name === 'table') renderRtTable();
  if (name === 'conflicts') renderRtConflicts();
  if (name === 'requirements') renderRtRequirements();
}

// === PERSONA HELPERS ===
function getPersona(id) { return RT_PERSONAS.find(p => p.id === id); }
function getFlameLevel(id) {
  ensureRtData();
  const res = rtData.interviewResults[id];
  if (!res) return 0;
  if (res.interviewCount >= 2) return 3;
  if (res.interviewCount >= 1) return 2;
  return 1;
}
function getSystemScore() {
  let count = 0;
  RT_PERSONAS.forEach(p => {
    if (getFlameLevel(p.id) >= 2) count++;
  });
  return count;
}

// === SCREEN 1: THE TABLE ===
function renderRtTable() {
  const container = document.getElementById('rt-view-table');
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 600;
  const cx = w / 2;
  const cy = h / 2;
  const rx = Math.min(cx - 60, 320); // horizontal radius
  const ry = Math.min(cy - 60, 280); // vertical radius

  const score = getSystemScore();
  const glowIntensity = score / RT_PERSONAS.length;

  let html = `<div class="rt-table-wrap">
    <div class="rt-center" style="left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);">
      <div class="rt-center-glow" style="box-shadow:0 0 ${40 + glowIntensity * 60}px rgba(200,150,80,${0.1 + glowIntensity * 0.3});">
        <div class="rt-center-score">${score}</div>
      </div>
      <div class="rt-center-label">of ${RT_PERSONAS.length} served</div>
    </div>`;

  RT_PERSONAS.forEach((p, i) => {
    const angle = (i / RT_PERSONAS.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * rx - 32;
    const y = cy + Math.sin(angle) * ry - 32;
    const flame = getFlameLevel(p.id);
    const res = rtData.interviewResults[p.id];
    const revisit = res && res.interviewCount >= 1 ? `<div class="rt-seat-revisit">Interviewed</div>` : '';

    const goldBorder = p.isRealPerson ? 'border-color:rgba(255,200,60,0.8);box-shadow:0 0 12px rgba(255,200,60,0.3);' : '';
    html += `<div class="rt-seat rt-flame-${flame}" style="left:${x}px;top:${y}px;" onclick="openRtProfile('${p.id}')">
      <div class="rt-seat-avatar" style="background:rgba(${30+i*14},${20+i*8},${10+i*5},0.6);${goldBorder}">${p.initials}</div>
      <div class="rt-seat-name">${p.name}${p.isRealPerson ? ' *' : ''}</div>
      <div class="rt-seat-id">${p.age} · ${p.identity.split('.')[0]}</div>
      ${revisit}
    </div>`;
  });

  html += `<div id="rt-bubble-container"></div></div>`;
  container.innerHTML = html;
}

// === AMBIENT SPEECH BUBBLES ===
let rtBubbleIndex = 0;
function startRtBubbles() {
  stopRtBubbles();
  showNextBubble();
  rtBubbleInterval = setInterval(showNextBubble, 9000);
}
function stopRtBubbles() {
  if (rtBubbleInterval) { clearInterval(rtBubbleInterval); rtBubbleInterval = null; }
}
function showNextBubble() {
  const container = document.getElementById('rt-bubble-container');
  if (!container) return;
  const exchange = RT_AMBIENT[rtBubbleIndex % RT_AMBIENT.length];
  rtBubbleIndex++;
  const pA = getPersona(exchange.a);
  const pB = getPersona(exchange.b);
  if (!pA || !pB) return;

  // Position near person A's seat
  const wrap = container.closest('.rt-table-wrap');
  if (!wrap) return;
  const w = wrap.clientWidth || 800;
  const h = wrap.clientHeight || 600;
  const cx = w/2, cy = h/2;
  const rx = Math.min(cx-60,320), ry = Math.min(cy-60,280);
  const idxA = RT_PERSONAS.indexOf(pA);
  const angle = (idxA / RT_PERSONAS.length) * Math.PI * 2 - Math.PI / 2;
  const bx = cx + Math.cos(angle) * (rx * 0.65);
  const by = cy + Math.sin(angle) * (ry * 0.65);

  const bubble = document.createElement('div');
  bubble.className = 'rt-bubble';
  bubble.style.left = bx + 'px';
  bubble.style.top = by + 'px';
  bubble.innerHTML = `<div class="rt-bubble-name">${pA.name} & ${pB.name}</div>${exchange.text}`;
  container.appendChild(bubble);
  requestAnimationFrame(() => bubble.classList.add('visible'));
  setTimeout(() => {
    bubble.classList.remove('visible');
    setTimeout(() => bubble.remove(), 800);
  }, 7000);
}

// === PROFILE CARD ===
function openRtProfile(id) {
  const p = getPersona(id);
  if (!p) return;
  rtSelectedPersona = id;
  const card = document.getElementById('rt-profile-card');
  const res = rtData.interviewResults[id];
  const flame = getFlameLevel(id);

  let html = `<button class="rt-profile-close" onclick="document.getElementById('rt-profile-card').classList.remove('open')">&times;</button>
    <div class="rt-profile-name">${p.name}, ${p.age}${p.isRealPerson ? ' <span style="font-size:11px;color:rgba(255,200,60,0.8);font-weight:400;">real person</span>' : ''}</div>
    <div class="rt-profile-meta">${p.identity}</div>`;

  if (p.isRealPerson && p.realAnswers) {
    html += `<div class="rt-profile-section">Last time they made something</div>
      <div class="rt-profile-text">${p.realAnswers.lastMade}</div>
      <div class="rt-profile-section">How it felt</div>
      <div class="rt-profile-text">${p.realAnswers.howItFelt}</div>
      <div class="rt-profile-section">What they stopped making</div>
      <div class="rt-profile-text">${p.realAnswers.stoppedMaking}</div>
      <div class="rt-profile-section">One hour to do anything</div>
      <div class="rt-profile-text">${p.realAnswers.oneHour}</div>
      <div class="rt-profile-section">Treasured object</div>
      <div class="rt-profile-text">${p.realAnswers.treasuredObject}</div>`;
  } else {
    html += `<div class="rt-profile-quote">"${p.quote}"</div>
    <div class="rt-profile-section">What they actually want</div>
    <div class="rt-profile-text">${p.want}</div>
    <div class="rt-profile-section">What they fear</div>
    <div class="rt-profile-text">${p.fear}</div>`;
  }
  html += `<div class="rt-profile-section">What they need</div>
    <div class="rt-profile-text">${p.need}</div>`;

  if (res && res.gap) {
    html += `<div class="rt-profile-gap">Says: "${res.gap.says}"<br>Does: "${res.gap.does}"</div>`;
  }
  if (res && res.insights && res.insights.length > 0) {
    html += `<div class="rt-profile-section">Insights (${res.insights.length})</div>`;
    res.insights.forEach(ins => {
      html += `<div class="rt-profile-text" style="margin-bottom:6px;">· ${ins}</div>`;
    });
  }
  if (res && res.delta) {
    html += `<div class="rt-profile-section">Delta (revisit)</div>
      <div class="rt-profile-text">${res.delta}</div>`;
  }

  html += `<div style="flex:1;"></div>
    <button class="rt-profile-btn" onclick="startRtInterview('${id}')">${res && res.interviewCount > 0 ? 'Revisit Interview' : 'Interview'}</button>`;

  card.innerHTML = html;
  card.classList.add('open');
}

// === SCREEN 2: THE INTERVIEW ROOM ===
function startRtInterview(id) {
  const p = getPersona(id);
  if (!p) return;
  rtInterviewPersonaId = id;
  rtInterviewActive = true;
  rtInterviewMessages = [];
  rtInterviewStep = 0;
  document.getElementById('rt-profile-card').classList.remove('open');

  // Switch to interview view
  ['table','conflicts','requirements'].forEach(v => {
    document.getElementById('rt-view-' + v).style.display = 'none';
  });
  document.getElementById('rt-view-interview').style.display = 'block';
  stopRtBubbles();

  renderRtInterviewUI(p);
  // Start with first question after a short delay
  setTimeout(() => advanceInterview(), 600);
}

function renderRtInterviewUI(p) {
  const container = document.getElementById('rt-view-interview');
  container.innerHTML = `<div class="rt-interview-wrap">
    <div class="rt-interview-header">
      <div class="rt-interview-avatar" style="background:rgba(40,25,10,0.8);">${p.initials}</div>
      <div class="rt-interview-name">${p.name}, ${p.age}</div>
      <div class="rt-interview-identity">${p.identity}</div>
    </div>
    <div class="rt-interview-messages" id="rt-interview-msgs"></div>
    <div class="rt-interview-status" id="rt-interview-status">Interview in progress...</div>
  </div>`;
}

function addRtMsg(who, text, isSystem) {
  const p = getPersona(rtInterviewPersonaId);
  rtInterviewMessages.push({ who, text, isSystem });
  const container = document.getElementById('rt-interview-msgs');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'rt-msg' + (isSystem ? ' rt-msg-system' : '');
  div.innerHTML = `<div class="rt-msg-avatar" style="background:rgba(${isSystem?'80,60,30':'40,25,10'},0.6);">${isSystem ? 'Q' : p.initials}</div>
    <div class="rt-msg-bubble"><div class="rt-msg-label">${isSystem ? 'The Table' : p.name}</div>${text}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

const RT_INTERVIEW_FLOW = [
  { type:'question', text:'What does the perfect platform for makers look like?' },
  { type:'response', topic:'algorithm' },
  { type:'question', text:'What would make you leave a platform?' },
  { type:'response', topic:'metrics' },
  { type:'question', text:'What would make you tell someone else about it?' },
  { type:'response', topic:'community' },
  { type:'oblique' },
  { type:'followup', topic:'discovery' },
  { type:'followup', topic:'monetisation' },
  { type:'closing' }
];

function advanceInterview() {
  if (!rtInterviewActive) return;
  const p = getPersona(rtInterviewPersonaId);
  if (!p) return;
  const step = RT_INTERVIEW_FLOW[rtInterviewStep];
  if (!step) { finishInterview(); return; }

  if (step.type === 'question') {
    addRtMsg('system', step.text, true);
    rtInterviewStep++;
    setTimeout(() => advanceInterview(), 1800);
  } else if (step.type === 'response' || step.type === 'followup') {
    const topicData = p.topics[step.topic];
    if (topicData) {
      addRtMsg(p.id, topicData.response, false);
    }
    rtInterviewStep++;
    setTimeout(() => advanceInterview(), 2200);
  } else if (step.type === 'oblique') {
    addRtMsg('system', p.obliqueQ, true);
    rtInterviewStep++;
    setTimeout(() => {
      addRtMsg(p.id, p.obliqueA, false);
      setTimeout(() => advanceInterview(), 2200);
    }, 2000);
  } else if (step.type === 'closing') {
    addRtMsg('system', 'Last word. What should we never forget?', true);
    rtInterviewStep++;
    setTimeout(() => {
      addRtMsg(p.id, p.closingStatement, false);
      setTimeout(() => finishInterview(), 2000);
    }, 1800);
  }
}

function finishInterview() {
  rtInterviewActive = false;
  const p = getPersona(rtInterviewPersonaId);
  if (!p) return;

  // Extract insights
  const existing = rtData.interviewResults[p.id] || { interviewCount:0, insights:[], gap:null, delta:null };
  const isRevisit = existing.interviewCount > 0;

  const insights = [
    `Core stance on algorithms: ${(p.topics.algorithm||{}).stance||'unknown'}`,
    `Core stance on metrics: ${(p.topics.metrics||{}).stance||'unknown'}`,
    `Core stance on community: ${(p.topics.community||{}).stance||'unknown'}`,
    `Closing statement: "${p.closingStatement}"`
  ];

  if (isRevisit) {
    existing.delta = `Revisited. Core beliefs held steady. ${p.name} is consistent.`;
  }

  existing.interviewCount++;
  existing.insights = insights;
  existing.gap = p.gap;
  existing.firstInterviewDate = existing.firstInterviewDate || new Date().toISOString();

  rtData.interviewResults[p.id] = existing;
  rtData.systemScore = getSystemScore();
  persistData('clayVillageRoundtable', rtData);

  const status = document.getElementById('rt-interview-status');
  if (status) status.innerHTML = `<button class="rt-profile-btn" style="max-width:240px;margin:0 auto;" onclick="endRtInterview()">← Back to Table</button>`;
}

function endRtInterview() {
  rtInterviewActive = false;
  rtCurrentTab = 'table';
  document.querySelectorAll('.rt-tab').forEach(t => t.classList.toggle('active', t.dataset.rtTab === 'table'));
  renderRtTab('table');
  startRtBubbles();
}

// === SCREEN 3: CONFLICTS ===
function renderRtConflicts() {
  const container = document.getElementById('rt-view-conflicts');
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 600;
  const cx = w/2, cy = h/2;
  const rx = Math.min(cx-60,280), ry = Math.min(cy-60,240);

  // Map persona positions
  const positions = {};
  RT_PERSONAS.forEach((p, i) => {
    const angle = (i / RT_PERSONAS.length) * Math.PI * 2 - Math.PI / 2;
    positions[p.id] = { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry };
  });

  let svg = `<svg class="rt-conflict-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">`;
  RT_CONFLICTS.forEach((c, ci) => {
    const pa = positions[c.a], pb = positions[c.b];
    if (!pa || !pb) return;
    const color = c.status === 'green' ? '#70c878' : c.status === 'amber' ? '#d4b050' : '#e88070';
    svg += `<line x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}" stroke="${color}" stroke-opacity="0.5" data-conflict="${ci}" onclick="showRtConflict(${ci})"/>`;
  });
  svg += '</svg>';

  let seats = '';
  RT_PERSONAS.forEach((p, i) => {
    const pos = positions[p.id];
    seats += `<div class="rt-seat" style="left:${pos.x-32}px;top:${pos.y-20}px;pointer-events:none;">
      <div class="rt-seat-avatar" style="width:28px;height:28px;font-size:11px;background:rgba(30,20,10,0.6);">${p.initials}</div>
      <div class="rt-seat-name">${p.name}</div>
    </div>`;
  });

  container.innerHTML = `<div class="rt-conflicts-wrap">${svg}${seats}<div class="rt-conflict-card" id="rt-conflict-detail"></div></div>`;
}

function showRtConflict(idx) {
  const c = RT_CONFLICTS[idx];
  if (!c) return;
  const pA = getPersona(c.a), pB = getPersona(c.b);
  const card = document.getElementById('rt-conflict-detail');
  card.className = 'rt-conflict-card open';
  card.innerHTML = `<button class="rt-profile-close" onclick="this.parentElement.classList.remove('open')">&times;</button>
    <div class="rt-conflict-vs">
      <div class="rt-conflict-person"><div class="rt-conflict-person-name">${pA.name}</div></div>
      <div class="rt-conflict-divider">vs</div>
      <div class="rt-conflict-person"><div class="rt-conflict-person-name">${pB.name}</div></div>
    </div>
    <div class="rt-conflict-tension">${c.tension}</div>
    ${c.solution ? `<div class="rt-conflict-solution">${c.solution}</div>` : ''}
    <div style="text-align:center;margin-top:12px;"><span class="rt-conflict-status ${c.status}">${c.status}</span></div>`;
}

// === SCREEN 4: REQUIREMENTS ===
function renderRtRequirements() {
  const container = document.getElementById('rt-view-requirements');
  let html = `<div class="rt-reqs-wrap"><div style="text-align:center;margin-bottom:24px;">
    <div style="font-size:18px;font-weight:700;color:#e8d5b8;">Living Requirements</div>
    <div style="font-size:11px;color:rgba(232,213,184,0.4);margin-top:4px;">${RT_REQUIREMENTS.length} requirements · updated after each interview</div>
  </div>`;

  // Sort: green first, then amber, then red
  const sorted = [...RT_REQUIREMENTS].sort((a,b) => {
    const order = { green:0, amber:1, red:2 };
    return (order[a.level]||0) - (order[b.level]||0);
  });

  sorted.forEach(req => {
    const supporters = req.supporters.map(id => getPersona(id)?.name).filter(Boolean).join(', ');
    const opposers = req.opposers.map(id => getPersona(id)?.name).filter(Boolean).join(', ');
    html += `<div class="rt-req-item">
      <div class="rt-req-bar ${req.level}"></div>
      <div><div class="rt-req-text">${req.text}</div>
        <div class="rt-req-supporters">${supporters ? 'Supported by: ' + supporters : ''}${opposers ? ' · Opposed by: ' + opposers : ''}</div>
      </div>
    </div>`;
  });

  html += '</div>';
  container.innerHTML = html;
}

// === AUTO-INTERVIEW ALL ===
var rtAutoRunning = false;
var rtAutoQueue = [];

function startAutoInterview() {
  ensureRtData();
  rtAutoRunning = true;
  rtAutoQueue = RT_PERSONAS.filter(p => !rtData.interviewResults[p.id] || rtData.interviewResults[p.id].interviewCount === 0).map(p => p.id);
  if (rtAutoQueue.length === 0) { rtAutoRunning = false; showPostRound(); return; }
  renderRtTab('table');
  document.getElementById('rt-auto-progress').style.display = 'block';
  updateAutoProgress();
  runNextAutoInterview();
}

function updateAutoProgress() {
  const total = RT_PERSONAS.length;
  const done = total - rtAutoQueue.length;
  const el = document.getElementById('rt-auto-progress');
  if (el) el.innerHTML = `<div style="font-size:12px;color:#e8d5b8;text-align:center;padding:8px;">Interviewing... ${done} of ${total} complete</div><div style="height:3px;background:rgba(200,150,80,0.15);border-radius:2px;margin:0 20px;"><div style="height:100%;background:rgba(200,150,80,0.7);border-radius:2px;width:${(done/total*100).toFixed(1)}%;transition:width 0.5s ease;"></div></div>`;
}

function runNextAutoInterview() {
  if (rtAutoQueue.length === 0) {
    rtAutoRunning = false;
    document.getElementById('rt-auto-progress').style.display = 'none';
    renderRtTable();
    setTimeout(showPostRound, 500);
    return;
  }
  const id = rtAutoQueue.shift();
  // Highlight current persona on the table
  document.querySelectorAll('.rt-seat').forEach(s => s.style.outline = 'none');
  const seats = document.querySelectorAll('.rt-seat');
  const idx = RT_PERSONAS.findIndex(p => p.id === id);
  if (seats[idx]) seats[idx].style.outline = '2px solid rgba(255,180,60,0.7)';

  // Run fast interview (no UI switching, just process data)
  const p = getPersona(id);
  const existing = rtData.interviewResults[p.id] || { interviewCount:0, insights:[], gap:null, delta:null };
  existing.interviewCount++;
  existing.insights = [
    `Core stance on algorithms: ${(p.topics.algorithm||{}).stance||'unknown'}`,
    `Core stance on metrics: ${(p.topics.metrics||{}).stance||'unknown'}`,
    `Core stance on community: ${(p.topics.community||{}).stance||'unknown'}`,
    `Closing statement: "${p.closingStatement}"`
  ];
  existing.gap = p.gap;
  existing.firstInterviewDate = existing.firstInterviewDate || new Date().toISOString();
  rtData.interviewResults[p.id] = existing;
  rtData.systemScore = getSystemScore();
  persistData('clayVillageRoundtable', rtData);

  updateAutoProgress();
  // Brief pause, then next — each takes ~1.5s so the user sees them light up
  setTimeout(() => {
    renderRtTable(); // re-render to show updated flame
    setTimeout(runNextAutoInterview, 800);
  }, 700);
}

// === POST-ROUND: SYNTHESISE / GAPS / NEXT ROUND / EXPORT ===
function showPostRound() {
  const container = document.getElementById('rt-view-table');
  const interviewedCount = RT_PERSONAS.filter(p => rtData.interviewResults[p.id] && rtData.interviewResults[p.id].interviewCount > 0).length;
  if (interviewedCount < RT_PERSONAS.length) return; // not all done yet

  let postHtml = document.getElementById('rt-post-round');
  if (!postHtml) {
    postHtml = document.createElement('div');
    postHtml.id = 'rt-post-round';
    postHtml.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(8,5,2,0.95) 30%);padding:60px 20px 24px;z-index:6;display:flex;flex-direction:column;align-items:center;gap:10px;';
    container.appendChild(postHtml);
  }
  postHtml.innerHTML = `
    <div style="font-size:14px;font-weight:700;color:#e8d5b8;margin-bottom:4px;">${RT_PERSONAS.length} of ${RT_PERSONAS.length} interviewed. Round complete.</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
      <button class="rt-profile-btn" style="width:auto;padding:10px 20px;" onclick="rtSynthesise()">Synthesise Round</button>
      <button class="rt-profile-btn" style="width:auto;padding:10px 20px;" onclick="rtFindGaps()">Find Gaps</button>
      <button class="rt-profile-btn" style="width:auto;padding:10px 20px;" onclick="rtBuildNextRound()">Build Next Round</button>
      <button class="rt-profile-btn" style="width:auto;padding:10px 20px;" onclick="rtExportRequirements()">Export Requirements</button>
      <button class="rt-profile-btn" style="width:auto;padding:10px 20px;border-color:rgba(255,200,60,0.5);" onclick="rtInviteRealPerson()">Invite a Real Person</button>
    </div>`;
}

// === SYNTHESISE ROUND ===
function rtSynthesise() {
  // Analyze all personas to produce the distilled one-page truth
  const stances = {};
  const topics = ['algorithm','metrics','community','discovery','monetisation'];
  topics.forEach(t => { stances[t] = { pro:[], neutral:[], against:[] }; });
  RT_PERSONAS.forEach(p => {
    topics.forEach(t => {
      if (p.topics[t]) stances[t][p.topics[t].stance].push(p.name);
    });
  });

  // Consensus points: topics where most agree
  const consensus = [];
  const hardConflicts = [];
  topics.forEach(t => {
    const s = stances[t];
    const total = s.pro.length + s.neutral.length + s.against.length;
    if (s.pro.length > total * 0.6) consensus.push({ topic:t, direction:'pro', supporters:s.pro });
    else if (s.against.length > total * 0.6) consensus.push({ topic:t, direction:'against', supporters:s.against });
    else hardConflicts.push({ topic:t, pro:s.pro, against:s.against });
  });

  // Gaps that were revealed
  const gaps = RT_PERSONAS.filter(p => p.gap).map(p => ({ name:p.name, says:p.gap.says, does:p.gap.does }));

  // Unresolved conflicts
  const unresolvedConflicts = RT_CONFLICTS.filter(c => c.status === 'red');

  // Build the synthesis view
  const view = document.getElementById('rt-view-table');
  // Save table content and replace temporarily
  const savedTable = view.innerHTML;
  let html = `<div style="max-width:92%;margin:0 auto;padding:24px 20px;">
    <button class="rt-profile-btn" style="width:auto;margin-bottom:24px;padding:8px 16px;font-size:12px;" onclick="renderRtTab('table')">← Back to Table</button>
    <div style="font-size:22px;font-weight:700;color:#e8d5b8;margin-bottom:4px;">Round Synthesis</div>
    <div style="font-size:11px;color:rgba(232,213,184,0.4);margin-bottom:24px;">${RT_PERSONAS.length} interviews completed · ${new Date().toLocaleDateString()}</div>

    <div class="bld-glass" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:rgba(200,150,80,0.8);margin-bottom:10px;">WHAT EVERYONE AGREES ON</div>`;
  if (consensus.length === 0) html += `<div style="font-size:12px;color:rgba(232,213,184,0.5);">No strong consensus yet.</div>`;
  consensus.forEach(c => {
    html += `<div style="font-size:13px;color:#e8d5b8;margin-bottom:8px;padding-left:12px;border-left:2px solid #70c878;">
      <strong>${c.topic}</strong> — ${c.direction === 'pro' ? 'Supported' : 'Rejected'} by ${c.supporters.join(', ')}</div>`;
  });
  html += `</div>

    <div class="bld-glass" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:rgba(200,150,80,0.8);margin-bottom:10px;">HARDEST CONFLICTS</div>`;
  if (hardConflicts.length === 0) html += `<div style="font-size:12px;color:rgba(232,213,184,0.5);">All topics have clear consensus.</div>`;
  hardConflicts.forEach(c => {
    html += `<div style="font-size:13px;color:#e8d5b8;margin-bottom:8px;padding-left:12px;border-left:2px solid #e88070;">
      <strong>${c.topic}</strong> — For: ${c.pro.join(', ')} · Against: ${c.against.join(', ')}</div>`;
  });
  html += `</div>

    <div class="bld-glass" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:rgba(200,150,80,0.8);margin-bottom:10px;">UNRESOLVED TENSIONS (${unresolvedConflicts.length})</div>`;
  unresolvedConflicts.forEach(c => {
    const pA = getPersona(c.a), pB = getPersona(c.b);
    html += `<div style="font-size:12px;color:#e8d5b8;margin-bottom:10px;padding-left:12px;border-left:2px solid #e88070;">
      <strong>${pA.name} vs ${pB.name}</strong><br><span style="color:rgba(232,213,184,0.6);">${c.tension}</span></div>`;
  });
  html += `</div>

    <div class="bld-glass" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:rgba(200,150,80,0.8);margin-bottom:10px;">THE GAPS — WHAT THEY SAY vs WHAT THEY DO</div>`;
  gaps.forEach(g => {
    html += `<div style="font-size:12px;color:#e8d5b8;margin-bottom:8px;padding-left:12px;border-left:2px solid #c89640;">
      <strong>${g.name}</strong> — Says: "${g.says}" · Does: "${g.does}"</div>`;
  });
  html += `</div>

    <div class="bld-glass">
      <div style="font-size:13px;font-weight:700;color:rgba(200,150,80,0.8);margin-bottom:10px;">THE DISTILLED TRUTH</div>
      <div style="font-size:13px;color:#e8d5b8;line-height:1.65;">
        The platform must give makers control over who sees them — not force visibility or hide them. Economic dignity for beginners is non-negotiable; the free tier is pipeline, not charity. Data portability is universal — every persona who has been hurt by platforms demands ownership. The deepest conflict is between growth (Zoe, Marcus, Raj) and integrity (Kenji, Peter, Tomás) — and the design solution is not a compromise but a choice architecture: each maker sets their own rules. The people at this table who disagree most violently actually want the same thing — respect for the work. They just define respect differently.
      </div>
    </div>
  </div>`;
  view.innerHTML = html;
}

// === CLAUDE API HELPER ===
function getRtApiKey() {
  let key = localStorage.getItem('clayVillageClaudeApiKey');
  if (key) return key;
  key = prompt('Enter your Anthropic API key to power the Roundtable AI.\nThis is saved locally and never sent anywhere except the Anthropic API.');
  if (key && key.startsWith('sk-')) {
    localStorage.setItem('clayVillageClaudeApiKey', key);
    return key;
  }
  return null;
}

async function callClaude(systemPrompt, userPrompt) {
  const apiKey = getRtApiKey();
  if (!apiKey) throw new Error('No API key');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('API error: ' + err);
  }
  const data = await res.json();
  return data.content[0].text;
}

function buildRtContext() {
  // Compile all interview data into a text summary for the AI
  let ctx = 'CURRENT ROUNDTABLE STATE:\n\n';
  ctx += `Personas (${RT_PERSONAS.length}):\n`;
  RT_PERSONAS.forEach(p => {
    ctx += `- ${p.name}, ${p.age}. ${p.identity} Want: ${p.want} Fear: ${p.fear}`;
    if (p.gap) ctx += ` Gap: Says "${p.gap.says}", Does "${p.gap.does}"`;
    ctx += '\n';
  });
  ctx += `\nRequirements (${RT_REQUIREMENTS.length}):\n`;
  RT_REQUIREMENTS.forEach(r => {
    const sup = r.supporters.map(id => getPersona(id)?.name).filter(Boolean).join(', ');
    const opp = r.opposers.map(id => getPersona(id)?.name).filter(Boolean).join(', ');
    ctx += `- [${r.level}] ${r.text} (For: ${sup || 'none'}${opp ? ' | Against: ' + opp : ''})\n`;
  });
  ctx += `\nConflicts (${RT_CONFLICTS.length}):\n`;
  RT_CONFLICTS.forEach(c => {
    const pA = getPersona(c.a), pB = getPersona(c.b);
    ctx += `- [${c.status}] ${pA?.name} vs ${pB?.name}: ${c.tension}\n`;
  });
  return ctx;
}

// === FIND GAPS (Claude API) ===
async function rtFindGaps() {
  const view = document.getElementById('rt-view-table');
  view.innerHTML = `<div style="max-width:92%;margin:80px auto;text-align:center;padding:20px;">
    <div style="font-size:18px;color:#e8d5b8;">Analyzing gaps...</div>
    <div style="font-size:12px;color:rgba(232,213,184,0.4);margin-top:8px;">Calling Claude to find what this round missed</div>
  </div>`;

  try {
    const context = buildRtContext();
    const result = await callClaude(
      'You are the analytical engine behind a product roundtable for Clay Village — a platform for makers and craftspeople. You analyze interview data to find what is missing. Be specific, provocative, and honest. Write in a direct, spare style. No fluff.',
      context + '\n\nBased on everything above, return EXACTLY this structure (use these exact headers, no markdown formatting):\n\n' +
      'MISSING ARCHETYPES\nList 5 specific people who are completely absent from this table. For each: a name, age, one-line identity, and 2-3 sentences explaining why they would break something the current table agrees on. These should be people who would genuinely challenge the consensus — not just add nuance.\n\n' +
      'QUESTIONS NEVER ASKED\nList 5 questions that no interview in this round ever asked. These should be questions that would reveal something the current data cannot see.\n\n' +
      'MOST DANGEROUS ASSUMPTION\nIdentify the single most dangerous assumption buried in the current requirements list. Explain why it is dangerous and what would happen if it turned out to be wrong. Be specific — name the requirement and the people who support it.'
    );

    let html = `<div style="max-width:92%;margin:0 auto;padding:24px 20px;">
      <button class="rt-profile-btn" style="width:auto;margin-bottom:24px;padding:8px 16px;font-size:12px;" onclick="renderRtTab('table')">← Back to Table</button>
      <div style="font-size:22px;font-weight:700;color:#e8d5b8;margin-bottom:4px;">Gap Analysis</div>
      <div style="font-size:11px;color:rgba(232,213,184,0.4);margin-bottom:24px;">Generated by Claude from ${RT_PERSONAS.length} interviews</div>
      <div class="bld-glass" style="white-space:pre-wrap;font-size:13px;color:#e8d5b8;line-height:1.65;">${result.replace(/</g,'&lt;')}</div>
    </div>`;
    view.innerHTML = html;
  } catch (e) {
    view.innerHTML = `<div style="max-width:500px;margin:80px auto;text-align:center;padding:20px;">
      <div style="font-size:16px;color:#e88070;">${e.message}</div>
      <button class="rt-profile-btn" style="width:auto;margin-top:16px;padding:8px 16px;" onclick="renderRtTab('table')">← Back</button>
    </div>`;
  }
}

// === BUILD NEXT ROUND ===
var RT_ROUND2_PERSONAS = [
  { id:'dana', name:'Dana', age:44, initials:'Da', identity:'Instagram PM. Ships features she hates.',
    quote:'I know the algorithm hurts people. I ship it anyway. I have a mortgage and two kids. Judge me when you\'ve made that trade.',
    want:'Permission to stop. Or a system that doesn\'t require the trade.', fear:'That the village is naive about what it takes to survive as a platform.', need:'To believe an alternative can actually sustain itself.',
    obliqueQ:'What did you build at work this month that you\'re proud of?', obliqueA:'...Nothing. I haven\'t been proud of a shipped feature in three years. I used to be.',
    gap:{ says:'The algorithm is necessary', does:'Hasn\'t been proud of her work in years' },
    topics:{ algorithm:{stance:'pro',response:'The algorithm works. Not morally — functionally. It keeps 2 billion people engaged.'}, metrics:{stance:'pro',response:'Without metrics we can\'t justify headcount. Without headcount nothing gets built.'}, community:{stance:'neutral',response:'We tried community features. They always get deprioritised for engagement.'}, discovery:{stance:'pro',response:'Discovery is the only thing that matters at scale. Everything else is a feature.'}, monetisation:{stance:'pro',response:'Ads fund everything. Subscriptions can\'t replace $100 billion in ad revenue.'} },
    closingStatement:'Build it. But don\'t pretend it\'s easy. And don\'t pretend the people at Instagram are evil. Most of us are just tired.'
  },
  { id:'carl', name:'Carl', age:52, initials:'C', identity:'Weekend potter. Never sells.',
    quote:'I make pots every Saturday. I give them away. I don\'t need a platform and I don\'t need money for it. Making is already enough.',
    want:'Nothing from the platform. He\'s already complete.', fear:'That the village would make him feel like making should be productive.', need:'Proof that making for joy alone is valued here.',
    obliqueQ:'What happens to the pots you give away?', obliqueA:'My neighbor has six of them. She puts flowers in them. One cracked last winter and she asked me to fix it instead of throwing it away. That\'s the whole point.',
    gap:{ says:'I don\'t need anything', does:'Has built exactly what the village promises — gift economy, real relationships, making for joy — without any platform' },
    topics:{ algorithm:{stance:'neutral',response:'I\'m not on social media. I don\'t need an algorithm.'}, metrics:{stance:'against',response:'The moment you measure making, you change what it means to make.'}, community:{stance:'pro',response:'My community is my street. Potters don\'t need the internet for community.'}, discovery:{stance:'neutral',response:'I don\'t want to be discovered. I\'m not hiding. I\'m just... here.'}, monetisation:{stance:'against',response:'Not everything needs to be a business. Some things are just gifts.'} },
    closingStatement:'If the village makes room for people who just make — not sell, not teach, not perform — then you\'ve built something real.'
  },
  { id:'ren', name:'Ren', age:26, initials:'Re', identity:'AI-assisted ceramic designer.',
    quote:'I use Midjourney to design my forms. I use ChatGPT to formulate glazes. Then I throw them by hand. Is that cheating? I don\'t care.',
    want:'Acceptance. To not be gatekept.', fear:'Being told his work isn\'t "real" because AI touched it.', need:'A definition of craft that includes him.',
    obliqueQ:'Which part do your hands remember?', obliqueA:'The centering. Always the centering. The AI can\'t feel the wobble. My hands know when it\'s right before my eyes do. That part is mine.',
    gap:{ says:'I don\'t care if it\'s cheating', does:'The part he\'s proudest of is the part AI can\'t do' },
    topics:{ algorithm:{stance:'neutral',response:'I use AI as a tool, not an audience. The algorithm is irrelevant to my process.'}, metrics:{stance:'neutral',response:'I track what works in glaze chemistry. That\'s data, not metrics.'}, community:{stance:'pro',response:'I want to talk to people doing what I\'m doing. AI-assisted makers need community too.'}, discovery:{stance:'pro',response:'Show people that AI-assisted craft is still craft. Change the conversation.'}, monetisation:{stance:'pro',response:'I sell everything I make. People don\'t care how I designed it. They care how it feels.'} },
    closingStatement:'The hand always finishes what the machine starts. That\'s enough.'
  },
  { id:'mira', name:'Mira', age:48, initials:'Mi', identity:'Failed ethical platform founder.',
    quote:'I built exactly what you\'re describing. In 2017. It lasted two years. I lost my house.',
    want:'To save someone else from her mistakes.', fear:'That the village will repeat every error she made.', need:'To see evidence they\'ve learned from the failures she lived.',
    obliqueQ:'What would you have done differently?', obliqueA:'I wouldn\'t have taken the investment. The moment we had investors, the timeline became their timeline. Every good decision got compressed into a quarter.',
    gap:{ says:'It can\'t work', does:'Her analysis of why it failed is the blueprint for making it work' },
    topics:{ algorithm:{stance:'against',response:'We tried no algorithm. Users couldn\'t find anything. We added one. Users stopped trusting us.'}, metrics:{stance:'against',response:'We measured everything and it killed the culture. We stopped measuring and couldn\'t raise money.'}, community:{stance:'pro',response:'Community was the only thing that worked. The 200 people who stayed to the end still talk to each other.'}, discovery:{stance:'neutral',response:'Discovery without an algorithm is just search. Search without content is a ghost town.'}, monetisation:{stance:'neutral',response:'We tried subscriptions. 3% converted. That\'s standard. And it wasn\'t enough.'} },
    closingStatement:'Don\'t take outside money until you know who you are. And charge from day one. Free platforms attract the wrong crowd.'
  },
  { id:'helen', name:'Helen', age:63, initials:'H', identity:'Museum curator of craft and design.',
    quote:'I decide what gets preserved and what gets forgotten. Most of what Instagram celebrates will not survive the decade. What matters is what the hands remember.',
    want:'Institutional legitimacy for contemporary craft.', fear:'That platforms flatten everything to content.', need:'A system that distinguishes between noise and signal in craft.',
    obliqueQ:'What\'s in the permanent collection that nobody visits?', obliqueA:'A set of cups by a woman who never sold a piece. She made them for thirty years. They\'re flawless. No one knows her name. That\'s the failure — not the cups.',
    gap:{ says:'I decide what gets preserved', does:'Haunted by the makers she didn\'t find in time' },
    topics:{ algorithm:{stance:'against',response:'Algorithms select for spectacle. Museums select for significance. These are different things.'}, metrics:{stance:'against',response:'The most important makers in history had no audience while they were alive.'}, community:{stance:'pro',response:'A community that identifies and supports significant makers before they die unknown? Yes.'}, discovery:{stance:'pro',response:'I need to find makers the algorithm would never surface. The quiet ones.'}, monetisation:{stance:'neutral',response:'Funding for craft comes from collectors, grants, and institutions. The platform should connect those.'} },
    closingStatement:'Every generation forgets the makers of the previous generation. If your platform remembers — actually remembers — that alone justifies its existence.'
  }
];

async function rtBuildNextRound() {
  const view = document.getElementById('rt-view-table');
  view.innerHTML = `<div style="max-width:92%;margin:80px auto;text-align:center;padding:20px;">
    <div style="font-size:18px;color:#e8d5b8;">Building next round...</div>
    <div style="font-size:12px;color:rgba(232,213,184,0.4);margin-top:8px;">Claude is generating 5 challenger personas</div>
  </div>`;

  try {
    const context = buildRtContext();
    const result = await callClaude(
      'You are generating personas for a product roundtable stress-testing Clay Village — a platform for makers. Each new persona must BREAK something the current table agrees on. Be specific, provocative, real. Write in direct prose. These are not nice people added for diversity — they are people whose existence challenges a core assumption.',
      context + '\n\nGenerate exactly 5 new personas. For each, return this EXACT JSON structure (return ONLY a JSON array, no other text):\n' +
      '[{"id":"lowercase_no_spaces","name":"FirstName","age":number,"initials":"XX","identity":"One line.",' +
      '"quote":"Their opening statement in 2-3 sentences.",' +
      '"want":"What they actually want.","fear":"What they fear.","need":"What they need.",' +
      '"obliqueQ":"One oblique question that reveals their gap.",' +
      '"obliqueA":"Their honest answer to the oblique question.",' +
      '"gap":{"says":"What they claim","does":"What they actually do"},' +
      '"topics":{"algorithm":{"stance":"pro|neutral|against","response":"2 sentences"},"metrics":{"stance":"pro|neutral|against","response":"2 sentences"},"community":{"stance":"pro|neutral|against","response":"2 sentences"},"discovery":{"stance":"pro|neutral|against","response":"2 sentences"},"monetisation":{"stance":"pro|neutral|against","response":"2 sentences"}},' +
      '"closingStatement":"Their final word — one memorable sentence."}]\n\n' +
      'Each persona must directly challenge a specific consensus point or resolved conflict from the current table. Make them real, specific, with genuine stakes.'
    );

    // Parse the JSON from Claude's response
    let newPersonas;
    try {
      // Extract JSON array from response (Claude might wrap it in text)
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found');
      newPersonas = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      throw new Error('Could not parse personas: ' + parseErr.message);
    }

    // Add to table
    let added = 0;
    newPersonas.forEach(p => {
      if (!RT_PERSONAS.find(ep => ep.id === p.id)) {
        p.isAiGenerated = true; // mark as AI-generated in this round
        RT_PERSONAS.push(p);
        added++;
      }
    });

    persistData('clayVillageRoundtable', rtData);

    view.innerHTML = `<div style="max-width:500px;margin:80px auto;text-align:center;padding:20px;">
      <div style="font-size:28px;font-weight:700;color:#e8d5b8;margin-bottom:12px;">Next Round Loaded</div>
      <div style="font-size:14px;color:rgba(232,213,184,0.6);line-height:1.6;margin-bottom:24px;">
        ${added} new personas added to the table. ${RT_PERSONAS.length} total seats.<br>
        Each one was chosen specifically to challenge what this round agreed on.
      </div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
        <button class="rt-profile-btn" style="width:auto;padding:10px 20px;" onclick="renderRtTab('table')">See the Table</button>
        <button class="rt-profile-btn" style="width:auto;padding:10px 20px;" onclick="startAutoInterview()">Auto-Interview New</button>
      </div>
    </div>`;
  } catch (e) {
    view.innerHTML = `<div style="max-width:500px;margin:80px auto;text-align:center;padding:20px;">
      <div style="font-size:16px;color:#e88070;">${e.message}</div>
      <button class="rt-profile-btn" style="width:auto;margin-top:16px;padding:8px 16px;" onclick="renderRtTab('table')">← Back</button>
    </div>`;
  }
}

// === INVITE A REAL PERSON ===
function rtInviteRealPerson() {
  const view = document.getElementById('rt-view-table');
  const inviteId = 'real_' + Date.now().toString(36);

  // Generate the standalone interview page as a downloadable HTML file
  const interviewHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Roundtable — You've Been Invited</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{min-height:100vh;background:radial-gradient(ellipse at 50% 55%,rgba(40,25,8,0.95),rgba(8,5,2,1));color:#e8d5b8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;padding:20px}
.wrap{max-width:560px;width:100%}
h1{font-size:22px;font-weight:700;margin-bottom:6px;text-align:center}
.sub{font-size:13px;color:rgba(232,213,184,0.5);text-align:center;margin-bottom:32px;line-height:1.5}
.q-card{background:rgba(234,229,222,0.06);border:1px solid rgba(200,150,80,0.12);border-radius:14px;padding:20px;margin-bottom:16px}
.q-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:rgba(200,150,80,0.6);margin-bottom:8px}
.q-text{font-size:15px;font-weight:600;color:#e8d5b8;margin-bottom:12px;line-height:1.5}
textarea{width:100%;min-height:80px;background:rgba(200,150,80,0.06);border:1px solid rgba(200,150,80,0.15);border-radius:10px;color:#e8d5b8;font-size:13px;padding:12px;font-family:inherit;resize:vertical;outline:none}
textarea:focus{border-color:rgba(200,150,80,0.35)}
.name-row{display:flex;gap:12px;margin-bottom:24px}
.name-row input{flex:1;background:rgba(200,150,80,0.06);border:1px solid rgba(200,150,80,0.15);border-radius:10px;color:#e8d5b8;font-size:13px;padding:10px 12px;font-family:inherit;outline:none}
.name-row input:focus{border-color:rgba(200,150,80,0.35)}
.submit-btn{display:block;width:100%;padding:9px 20px;border-radius:10px;border:none;background:#c8a84b;color:#1a1008;font-size:13px;font-weight:700;cursor:pointer;margin-top:8px;transition:background 0.15s}
.submit-btn:hover{background:#d4b45c}
.done{text-align:center;padding:40px 20px}
.done h2{font-size:20px;margin-bottom:12px}
.done p{font-size:13px;color:rgba(232,213,184,0.5);line-height:1.6}
.code-box{margin-top:20px;background:rgba(200,150,80,0.08);border:1px solid rgba(200,150,80,0.2);border-radius:10px;padding:12px;font-size:11px;color:rgba(232,213,184,0.7);word-break:break-all;cursor:pointer;user-select:all}
</style></head><body>
<div class="wrap" id="interview-form">
  <h1>You've been invited to help build something.</h1>
  <p class="sub">Five questions. Ten minutes. Your answers shape what this platform becomes.</p>
  <div class="name-row">
    <input type="text" id="rp-name" placeholder="Your first name">
    <input type="number" id="rp-age" placeholder="Age" style="max-width:80px">
  </div>
  <div class="q-card"><div class="q-label">Question 1</div><div class="q-text">When was the last time you made something from start to finish with your own hands? What was it?</div><textarea id="a1"></textarea></div>
  <div class="q-card"><div class="q-label">Question 2</div><div class="q-text">What did it feel like to hold it when it was done?</div><textarea id="a2"></textarea></div>
  <div class="q-card"><div class="q-label">Question 3</div><div class="q-text">Is there something you used to make that you don't make anymore? What happened?</div><textarea id="a3"></textarea></div>
  <div class="q-card"><div class="q-label">Question 4</div><div class="q-text">If you could spend one hour tomorrow doing anything — not what you should do, what you want to do — what would it be?</div><textarea id="a4"></textarea></div>
  <div class="q-card"><div class="q-label">Question 5</div><div class="q-text">What's one thing you own that you care about more than anything else you own? Why that thing?</div><textarea id="a5"></textarea></div>
  <button class="submit-btn" onclick="submitInterview()">Submit my answers</button>
</div>
<div class="wrap done" id="done-screen" style="display:none">
  <h2>Thank you.</h2>
  <p>Your answers are now part of the Roundtable. Copy the code below and send it back to the person who invited you. They'll add you to the table.</p>
  <div class="code-box" id="answer-code" onclick="navigator.clipboard.writeText(this.textContent)"></div>
  <p style="margin-top:8px;font-size:11px;">Click to copy</p>
</div>
<script>
function submitInterview(){
  const name=document.getElementById('rp-name').value.trim();
  const age=parseInt(document.getElementById('rp-age').value)||0;
  if(!name){alert('Please enter your name.');return}
  const answers=[1,2,3,4,5].map(i=>document.getElementById('a'+i).value.trim());
  if(answers.some(a=>!a)){alert('Please answer all five questions.');return}
  const data={id:'${inviteId}',name,age,answers,ts:Date.now()};
  const code=btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  document.getElementById('interview-form').style.display='none';
  document.getElementById('done-screen').style.display='block';
  document.getElementById('answer-code').textContent=code;
}
<\\/script></body></html>`;

  // Show the invite UI with download button and import
  view.innerHTML = `<div style="max-width:580px;margin:40px auto;padding:20px;">
    <button class="rt-profile-btn" style="width:auto;margin-bottom:24px;padding:8px 16px;font-size:12px;" onclick="renderRtTab('table')">← Back to Table</button>
    <div style="font-size:22px;font-weight:700;color:#e8d5b8;margin-bottom:4px;">Invite a Real Person</div>
    <div style="font-size:12px;color:rgba(232,213,184,0.4);margin-bottom:24px;line-height:1.5;">Generate an interview page. Share it. Import their answers. They join the table with a gold border.</div>

    <div class="bld-glass" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:rgba(200,150,80,0.8);margin-bottom:10px;">STEP 1 — Download the interview page</div>
      <div style="font-size:12px;color:rgba(232,213,184,0.6);margin-bottom:12px;">This generates a standalone HTML file. Send it to anyone. They open it in their browser, answer 5 questions, and get a code to send back.</div>
      <button class="rt-profile-btn" style="width:auto;padding:10px 20px;" id="rt-download-invite">Download Interview Page</button>
    </div>

    <div class="bld-glass">
      <div style="font-size:13px;font-weight:700;color:rgba(200,150,80,0.8);margin-bottom:10px;">STEP 2 — Import their answers</div>
      <div style="font-size:12px;color:rgba(232,213,184,0.6);margin-bottom:12px;">Paste the code they send back. Their answers become a real person at the table.</div>
      <textarea id="rt-import-code" style="width:100%;min-height:60px;background:rgba(200,150,80,0.06);border:1px solid rgba(200,150,80,0.15);border-radius:10px;color:#e8d5b8;font-size:12px;padding:10px;font-family:monospace;resize:vertical;margin-bottom:10px;" placeholder="Paste the answer code here..."></textarea>
      <button class="rt-profile-btn" style="width:auto;padding:10px 20px;" onclick="rtImportRealPerson()">Import to Table</button>
    </div>
  </div>`;

  // Wire up download button
  document.getElementById('rt-download-invite').addEventListener('click', () => {
    const blob = new Blob([interviewHtml.replace('<\\/script>','<'+'/script>')], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'roundtable-interview.html';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

function rtImportRealPerson() {
  const codeEl = document.getElementById('rt-import-code');
  const code = codeEl.value.trim();
  if (!code) { alert('Paste the answer code first.'); return; }

  let data;
  try {
    data = JSON.parse(decodeURIComponent(escape(atob(code))));
  } catch (e) { alert('Invalid code. Make sure you pasted the complete code.'); return; }

  if (!data.name || !data.answers || data.answers.length < 5) {
    alert('Incomplete answers.'); return;
  }

  // Check if already imported
  if (RT_PERSONAS.find(p => p.id === data.id)) {
    alert(data.name + ' is already at the table.'); return;
  }

  // Build a persona from the real person's answers
  const answers = data.answers;
  const persona = {
    id: data.id,
    name: data.name,
    age: data.age || '?',
    initials: data.name.substring(0, 2).toUpperCase(),
    identity: 'Real person. Invited to the table.',
    isRealPerson: true,
    quote: answers[0], // their answer to "when did you last make something"
    want: 'Revealed through interview.',
    fear: 'Revealed through interview.',
    need: 'Revealed through interview.',
    obliqueQ: 'What\'s one thing you own that you care about more than anything else you own?',
    obliqueA: answers[4],
    gap: null,
    realAnswers: {
      lastMade: answers[0],
      howItFelt: answers[1],
      stoppedMaking: answers[2],
      oneHour: answers[3],
      treasuredObject: answers[4]
    },
    topics: {
      algorithm: { stance: 'unknown', response: answers[0] },
      metrics: { stance: 'unknown', response: answers[1] },
      community: { stance: 'unknown', response: answers[2] },
      discovery: { stance: 'unknown', response: answers[3] },
      monetisation: { stance: 'unknown', response: answers[4] }
    },
    closingStatement: answers[4]
  };

  RT_PERSONAS.push(persona);

  // Also mark as interviewed immediately — their answers ARE the interview
  ensureRtData();
  rtData.interviewResults[data.id] = {
    interviewCount: 1,
    insights: [
      'Last made: ' + answers[0].substring(0, 100),
      'Feeling: ' + answers[1].substring(0, 100),
      'Stopped making: ' + answers[2].substring(0, 100),
      'One hour wish: ' + answers[3].substring(0, 100),
      'Treasured object: ' + answers[4].substring(0, 100)
    ],
    gap: null,
    firstInterviewDate: new Date(data.ts || Date.now()).toISOString(),
    delta: null,
    isRealPerson: true
  };
  rtData.systemScore = getSystemScore();
  persistData('clayVillageRoundtable', rtData);

  renderRtTab('table');
}

// === EXPORT REQUIREMENTS ===
function rtExportRequirements() {
  let text = 'THE ROUNDTABLE — LIVING REQUIREMENTS DOCUMENT\n';
  text += '═══════════════════════════════════════════════\n';
  text += `Generated: ${new Date().toLocaleString()}\n`;
  text += `Personas: ${RT_PERSONAS.length} | Conflicts: ${RT_CONFLICTS.length} | Requirements: ${RT_REQUIREMENTS.length}\n\n`;

  text += '── REQUIREMENTS ──\n\n';
  const sorted = [...RT_REQUIREMENTS].sort((a,b) => {
    const order = { green:0, amber:1, red:2 };
    return (order[a.level]||0) - (order[b.level]||0);
  });
  sorted.forEach((r, i) => {
    const status = r.level === 'green' ? '●' : r.level === 'amber' ? '◐' : '○';
    const supporters = r.supporters.map(id => getPersona(id)?.name).filter(Boolean).join(', ');
    const opposers = r.opposers.map(id => getPersona(id)?.name).filter(Boolean).join(', ');
    text += `${status} ${r.text}\n`;
    if (supporters) text += `  Supported by: ${supporters}\n`;
    if (opposers) text += `  Opposed by: ${opposers}\n`;
    text += '\n';
  });

  text += '\n── UNRESOLVED CONFLICTS ──\n\n';
  RT_CONFLICTS.filter(c => c.status === 'red').forEach(c => {
    const pA = getPersona(c.a), pB = getPersona(c.b);
    text += `${pA?.name || c.a} vs ${pB?.name || c.b}\n`;
    text += `  ${c.tension}\n\n`;
  });

  text += '\n── PERSONA GAPS (Says vs Does) ──\n\n';
  RT_PERSONAS.forEach(p => {
    if (p.gap) text += `${p.name}: Says "${p.gap.says}" — Does "${p.gap.does}"\n`;
  });

  // Download as text file
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'roundtable-requirements.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// === RENDER TABLE: add auto-interview and post-round buttons ===
const _origRenderRtTable = renderRtTable;
renderRtTable = function() {
  _origRenderRtTable();
  const container = document.getElementById('rt-view-table');
  if (!container) return;

  ensureRtData();
  const interviewedCount = RT_PERSONAS.filter(p => rtData.interviewResults[p.id] && rtData.interviewResults[p.id].interviewCount > 0).length;
  const uninterviewed = RT_PERSONAS.length - interviewedCount;

  // Add auto-interview button and progress bar
  let controls = `<div id="rt-auto-progress" style="display:none;position:absolute;top:60px;left:50%;transform:translateX(-50%);width:280px;z-index:6;"></div>`;
  if (uninterviewed > 0 && !rtAutoRunning) {
    controls += `<div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);z-index:6;">
      <button class="rt-profile-btn" style="width:auto;padding:10px 24px;" onclick="startAutoInterview()">Auto-Interview All (${uninterviewed} remaining)</button>
    </div>`;
  }
  container.insertAdjacentHTML('beforeend', controls);

  // Show post-round buttons if all done
  if (interviewedCount >= RT_PERSONAS.length) {
    showPostRound();
  }
};

// === ADMIN NAV ===
// Roundtable is now opened from inside the Observatory building
