-- ============================================
-- HWOOD CMS - MIGRATION SQL
-- Run this in Supabase SQL Editor
-- This ADDS to existing schema (does not drop tables)
-- ============================================

-- ============================================
-- ADD NEW COLUMNS TO EXISTING TABLES
-- ============================================

-- Add visibility_status to services (replaces simple is_visible)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS visibility_status VARCHAR(20) DEFAULT 'visible' 
CHECK (visibility_status IN ('visible', 'hidden', 'coming_soon'));

-- Add visibility_status to subservices
ALTER TABLE subservices 
ADD COLUMN IF NOT EXISTS visibility_status VARCHAR(20) DEFAULT 'visible' 
CHECK (visibility_status IN ('visible', 'hidden', 'coming_soon'));

-- Add visibility_status to product_categories
ALTER TABLE product_categories 
ADD COLUMN IF NOT EXISTS visibility_status VARCHAR(20) DEFAULT 'visible' 
CHECK (visibility_status IN ('visible', 'hidden', 'coming_soon'));

-- Add visibility_status to products (includes 'not_in_stock')
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS visibility_status VARCHAR(20) DEFAULT 'visible' 
CHECK (visibility_status IN ('visible', 'hidden', 'not_in_stock'));

-- Add content fields to stories for full articles
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS content_he TEXT;
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS excerpt_en VARCHAR(500);
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS excerpt_he VARCHAR(500);

-- Add video_url to hero_slides
ALTER TABLE hero_slides 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- ============================================
-- NEW TABLES
-- ============================================

-- Story Types (admin can rename)
CREATE TABLE IF NOT EXISTS story_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default story types
INSERT INTO story_types (name, slug, sort_order) VALUES 
  ('Events', 'events', 1),
  ('Customer Story', 'customer-story', 2),
  ('Case Study', 'case-study', 3)
ON CONFLICT (slug) DO NOTHING;

-- Update stories to reference story_types
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS type_id UUID REFERENCES story_types(id);

-- Specifications Master List
CREATE TABLE IF NOT EXISTS specification_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  unit VARCHAR(20),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default specification types
INSERT INTO specification_types (name, unit, sort_order) VALUES 
  ('Width', 'cm', 1),
  ('Height', 'cm', 2),
  ('Depth', 'cm', 3),
  ('Weight', 'kg', 4),
  ('Material', NULL, 5),
  ('Color', NULL, 6),
  ('Finish', NULL, 7)
ON CONFLICT DO NOTHING;

-- Product Specifications (links products to spec types)
CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  spec_type_id UUID REFERENCES specification_types(id) ON DELETE CASCADE,
  value VARCHAR(200) NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(product_id, spec_type_id)
);

-- Contact Form Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(300),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote Request Submissions
CREATE TABLE IF NOT EXISTS quote_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(200),
  project_type VARCHAR(100),
  budget_range VARCHAR(100),
  timeline VARCHAR(100),
  message TEXT,
  product_interest JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Media Links (part of company_info, but separate for flexibility)
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL UNIQUE,
  url TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Insert default social platforms
INSERT INTO social_links (platform, sort_order) VALUES 
  ('facebook', 1),
  ('linkedin', 2),
  ('instagram', 3),
  ('tiktok', 4),
  ('whatsapp', 5),
  ('telegram', 6)
ON CONFLICT (platform) DO NOTHING;

-- Admin Users (simple, single user for now)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  name VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Insert default admin user (password: Hwood2024!)
-- Using simple hash for demo - in production use proper bcrypt
INSERT INTO admin_users (email, password_hash, name) VALUES 
  ('admin@hwood.co.il', 'Hwood2024!', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- UPDATE ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on new tables
ALTER TABLE story_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE specification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read story_types" ON story_types FOR SELECT USING (true);
CREATE POLICY "Public read active specs" ON specification_types FOR SELECT USING (is_active = true);
CREATE POLICY "Public read visible product_specs" ON product_specifications FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read visible social_links" ON social_links FOR SELECT USING (is_visible = true);

-- Public insert for submissions
CREATE POLICY "Public insert contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert quote" ON quote_submissions FOR INSERT WITH CHECK (true);

-- Admin full access (using service role or authenticated)
CREATE POLICY "Admin full story_types" ON story_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full spec_types" ON specification_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full product_specs" ON product_specifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full contact" ON contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full quote" ON quote_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full social" ON social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin read users" ON admin_users FOR SELECT TO authenticated USING (true);

-- ============================================
-- UPDATE TRIGGERS FOR NEW TABLES
-- ============================================

CREATE TRIGGER update_story_types_timestamp 
  BEFORE UPDATE ON story_types 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- UPDATE VISIBILITY POLICIES
-- ============================================

-- Drop old policies and create new ones with visibility_status
DROP POLICY IF EXISTS "Public read visible services" ON services;
DROP POLICY IF EXISTS "Public read visible subservices" ON subservices;
DROP POLICY IF EXISTS "Public read visible categories" ON product_categories;
DROP POLICY IF EXISTS "Public read visible products" ON products;

CREATE POLICY "Public read visible services" ON services 
  FOR SELECT USING (visibility_status = 'visible' OR visibility_status = 'coming_soon');

CREATE POLICY "Public read visible subservices" ON subservices 
  FOR SELECT USING (visibility_status = 'visible' OR visibility_status = 'coming_soon');

CREATE POLICY "Public read visible categories" ON product_categories 
  FOR SELECT USING (visibility_status = 'visible' OR visibility_status = 'coming_soon');

CREATE POLICY "Public read visible products" ON products 
  FOR SELECT USING (visibility_status = 'visible' OR visibility_status = 'not_in_stock');

-- ============================================
-- DONE
-- ============================================
