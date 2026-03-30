# Clay Village — Project Context

## What This Is

Clay Village is a virtual community platform for potters and ceramic artists. It's an isometric illustrated village where people walk around, meet at the bonfire, visit each other's studios, and connect in ways that feel real — not performative like Instagram.

This is not a game. It's a **place**. The first village in what will become a platform for all creative communities.

## Who's Building This

One person. A vibe coder who can't read, write, or edit code directly. Everything is built through AI assistance (Claude). The developer describes what they want in natural language, and Claude writes the code. This means:

- **Never show raw code and ask for review** — just make the changes
- **Always explain what you did in plain language** after making changes
- **Test everything** before saying it works — use the preview when possible
- **Be careful with edits** — the codebase is one large file and breaking something is costly
- **When in doubt, ask** — don't assume what the developer wants

## Architecture

### Current Setup
- **Frontend:** Single `index.html` file (~8,300+ lines) with inline CSS and JavaScript. No framework — pure vanilla JS.
- **Backend:** `saveserver.py` — Python HTTP server on `localhost:3001` with GET `/data` and POST `/save`
- **Data:** `gamedata.json` — file-backed persistence for map data (outlines, zones, positions)
- **Map:** `map.png` — hand-illustrated isometric village map
- **Storage:** Dual persistence — localStorage for instant reads + async POST to save server for durability

### Key Technical Patterns
- `persistData(key, value)` — saves to both localStorage and the save server
- `loadWithDefaults(storageKey, defaults)` — loads from localStorage with hardcoded fallbacks
- `pointInPolygon(x, y, polygon)` — ray-casting collision detection used everywhere
- All DOM manipulation is vanilla JS — no jQuery, no React, no framework
- Profiles, messages, threads, friends, studios all stored in localStorage with `clayVillage*` prefixed keys

## The Village Map (9 Buildings)

Each building has: polygon outlines (collision), roof outlines (occlusion), trigger areas (NPC zones), banner label offsets, and info/description.

1. **School** — learning hub for beginners and workshops
2. **Library / Archive** — knowledge repository, glaze recipes, techniques
3. **Commons / Café** — social heart, tea and conversation
4. **Mentor Cluster** — master-apprentice pairings
5. **Bonfire Plaza** — central gathering, proximity-triggered group chat
6. **Studio Quarter** — where potters work
7. **Observatory / World** — looking outward, connecting to other communities
8. **Gallery / Market** — displaying and selling work
9. **Residency / Exchange** — artist residency program

## NPCs (6 Animal Residents)

Each is hand-drawn pixel art on canvas with unique animations:
- **Fox** — curious, quick, darts around, nose twitches (Commons / Café)
- **Owl** — wise, slow head tilts, calm blinks (Library / Archive)
- **Crane** — graceful, deliberate waddle, long pauses (Mentor Cluster)
- **Cat** — independent, tail flicks, stretches (Studio Quarter)
- **Deer** — gentle, ear twitches (Gallery / Market)
- **Dog** — friendly, bouncy, excited movement (School)

NPCs wander within walkable zones, have collision detection, and show speech bubbles on player proximity.

## Profile System

Rich schema with 8 sections:
- **Basic Identity:** name, village name, photo, city, country, identity statement
- **About:** bio, what clay means, current work, feedback preference
- **Practice:** main practice (wheel/handbuilding/etc), level, years, focus, streak
- **Style:** forms loved, materials, firing interests, glaze interests, tags
- **Social:** open to chat/critique/meetups/studio visits/exchange/mentor/peer buddy
- **Mentorship:** has mentor, offers teaching, workshops
- **Studio:** own studio, shared, home setup, kiln access, wheel access
- **Links:** instagram, website, portfolio

Default profiles: Maya (Seattle), James (Portland), Yuki (Kyoto), Sophia (Berlin), Oliver (London), Ben (Melbourne) + two unnamed.

## Chat Systems

1. **Bonfire Chat** — shared public chat in flyout panel. Opens on proximity to bonfire, closes when you walk away. Instagram-light styled.
2. **Private Chat** — warm café-aesthetic 1-on-1 chat. Accessible from profile cards.
3. **Direct Messages** — full mailbox with thread list and conversation view. Stored as `cvThread_idA_idB` (sorted IDs). Max 300 messages per thread.

## Studios (Personal Spaces)

Each human profile gets a personal studio (full-screen overlay):
- **Workbench note** — what they're working on today (editable by owner)
- **Tools & Setup** — visual indicators of what they have access to
- **Photo wall** — up to 9 photos of their work (uploaded as resized base64)
- **Guestbook** — visitors leave short notes
- Data stored in `clayVillageStudios` localStorage key

## UI Design Language

- **Admin sidebar:** Instagram-inspired, right side, white, icon navigation with flyout panels
- **Profile cards:** Instagram-style light cards with gradient avatar rings
- **Bonfire chat:** Instagram DM-style, white background
- **Private chat:** Warm café aesthetic (cream, brown, blur backdrop)
- **Studios:** Dark warm atmosphere (candlelit workshop feel)
- **Map tools:** Dark overlays for admin/drawing modes

## Rendering Layers (z-index order)

1. Map image (base)
2. Grayscale/glow canvas (z:2) — gold highlight overlays
3. Avatar shadow (z:9)
4. Avatar (z:10)
5. Foreground canvas (z:11) — tree canopy occlusion
6. Roof canvas (z:11) — building roof occlusion
7. NPC sprites (z:13)
8. Building labels (z:15)
9. Outline canvas (z:20) — drawing tools + particle system

## Particle System

- Fire particles in defined zones with glow effects
- Smoke particles from chimneys with drift
- Both rendered on outline canvas every frame

---

## The Bigger Vision

### The Story
Clay Village is the first proof of concept for a larger vision: **Village Maker** — a platform where any creative community can create their own village. village.clay, village.woodwork, village.glass, etc.

### The Origin Story
The developer also built an X (Twitter) reply app — an AI tool that reads tweets and generates replies. Great UI, polished, works perfectly. But it's morally wrong — nothing human in the output. It was never released. This contrast — "I built the thing that makes the internet faker, then I built the thing that makes it real" — is the core narrative.

### The Movie (XPRIZE)
There's also a short film being developed for the XPRIZE sci-fi competition ($3.5M+ prize, finals Sep 25, 2026). The story is set shortly before post-scarcity: a man's daughter moves into a Regency-era village (one of many themed villages people can apply to live in). He doesn't understand. Ten years later, his job ends — he's one of the last people who still worked. He still doesn't know his place. He carries a saxophone case but doesn't open it. The film explores the transition between the old world and the new — the same transition this platform is building for.

### Revenue Model (Future)
- Premium memberships (studio space, workshops, tools)
- Workshop marketplace (teachers earn, platform takes cut)
- Gallery marketplace (artists sell, small fee)
- Village creation tools (premium templates, custom maps)
- No ads. No algorithm. Community-funded.

### Build in Public Strategy
- **X/Twitter:** Show X reply app first (weeks 1-3) to build vibe coder credibility, then pivot narrative to Village
- **Instagram:** Target potter community with village screenshots, "what if" posts, and waitlist
- **The contrast method:** Every piece of content follows "here's what's broken → here's what I'm building instead"

---

## Design Principles

1. **Place, not feed** — you walk in, you don't scroll
2. **Presence, not performance** — no likes, no followers, no algorithm
3. **Slow and intentional** — notes on doors, not notifications
4. **The village evolves** — shaped by what the community does
5. **Scarcity of attention, not content** — intimacy over scale
6. **No metrics visible** — you discover people by being present
7. **Sincere always** — the whole point is that it's real

## Common Requests

When the developer asks to build something, they mean:
- Write the code directly into the files
- Use the existing patterns and style conventions
- Test it works
- Explain what changed in simple terms

They will NOT review code. They will test by looking at the preview and interacting with it. If something looks wrong, they'll describe what they see and expect you to fix it.
