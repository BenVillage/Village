-- ==========================================================================
--  Stall templates + theme + onboarding
--
--  Adds the columns the new Stall system needs on village_members:
--    - stall_template        TEXT   which template renders their stall
--    - stall_theme           JSONB  {heading_font, body_font, accent_color}
--    - socials               JSONB  {instagram, arena, website, ...}
--    - craft_category        TEXT   e.g. "pottery", "photography", "woodwork"
--    - years_practising      INT    years of craft experience
--    - stall_onboarded       BOOL   true once the 4-step onboarding ran
--
--  Previous migrations already added: stall_name, stall_tagline, stall_location,
--  stall_instagram, stall_cover_url, stall_avatar_url, stall_ig_bg_url,
--  stall_nav_links, stall_nav_settings, stall_link_label, stall_link_url,
--  stall_published. This file is additive — safe to re-run with IF NOT EXISTS.
-- ==========================================================================

-- Which template renders this maker's stall. NULL = hasn't chosen yet.
-- Valid values (enforced in JS): 'handmade', 'grid', 'magazine', 'journal', 'tall-mobile'.
ALTER TABLE village_members
  ADD COLUMN IF NOT EXISTS stall_template TEXT;

-- Font + accent swap — applied on top of the chosen template.
-- Default mirrors the village's warm-cream look so un-themed stalls still feel right.
ALTER TABLE village_members
  ADD COLUMN IF NOT EXISTS stall_theme JSONB
  DEFAULT '{"heading_font":"Cormorant Garamond","body_font":"Inter","accent_color":"#b8914a"}'::jsonb;

-- Full social links. Single stall_instagram stays for back-compat; onboarding
-- writes both until we migrate the old field out.
ALTER TABLE village_members
  ADD COLUMN IF NOT EXISTS socials JSONB DEFAULT '{}'::jsonb;

-- Craft category — matches the filter chips on the Market floor.
ALTER TABLE village_members
  ADD COLUMN IF NOT EXISTS craft_category TEXT;

-- Years of craft experience — shown on stall card + piece detail.
ALTER TABLE village_members
  ADD COLUMN IF NOT EXISTS years_practising INT;

-- Flips to TRUE when the maker finishes the 4-step onboarding modal.
-- Gate for: "first time → onboarding → carousel" vs. "return visit → template direct".
ALTER TABLE village_members
  ADD COLUMN IF NOT EXISTS stall_onboarded BOOLEAN DEFAULT false;

-- Helpful index for Market-floor category filtering.
CREATE INDEX IF NOT EXISTS idx_village_members_craft_category
  ON village_members (craft_category)
  WHERE craft_category IS NOT NULL;
