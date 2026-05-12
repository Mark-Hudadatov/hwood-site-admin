-- ============================================================
-- PAGE BUILDER MIGRATION
-- Run in Supabase SQL Editor ONCE after existing schema
-- ============================================================

-- Pages table: stores all CMS pages as block arrays
CREATE TABLE IF NOT EXISTS pages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                VARCHAR(120) UNIQUE NOT NULL,
  title_en            VARCHAR(300) NOT NULL,
  title_he            VARCHAR(300),
  status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published')),
  blocks              JSONB NOT NULL DEFAULT '[]',
  meta_description_en VARCHAR(300),
  meta_description_he VARCHAR(300),
  sort_order          INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Design tokens: singleton row, controls runtime CSS variables
CREATE TABLE IF NOT EXISTS design_tokens (
  id           INTEGER PRIMARY KEY DEFAULT 1,
  brand        VARCHAR(20) DEFAULT '#005f5f',
  brand_hover  VARCHAR(20) DEFAULT '#004d4d',
  brand_dark   VARCHAR(20) DEFAULT '#003d3d',
  surface_dark VARCHAR(20) DEFAULT '#002828',
  neutral_900  VARCHAR(20) DEFAULT '#171717',
  font_sans    VARCHAR(100) DEFAULT 'Inter',
  base_radius  VARCHAR(20) DEFAULT '8px',
  section_gap  VARCHAR(20) DEFAULT '0px'
);

INSERT INTO design_tokens (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Auto-update updated_at on pages
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pages_updated_at ON pages;
CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_tokens ENABLE ROW LEVEL SECURITY;

-- Public can read published pages
CREATE POLICY "Public read published pages"
  ON pages FOR SELECT USING (status = 'published');

-- Public can read design tokens
CREATE POLICY "Public read design_tokens"
  ON design_tokens FOR SELECT USING (true);

-- Anon full access matches existing admin pattern (anon key + localStorage auth)
CREATE POLICY "Anon full pages"
  ON pages FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon full design_tokens"
  ON design_tokens FOR ALL TO anon USING (true) WITH CHECK (true);
