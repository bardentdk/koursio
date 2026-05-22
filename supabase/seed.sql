-- =============================================
-- MyLMS — Seed Data (données fictives)
-- =============================================

-- Insert categories
INSERT INTO categories (id, name, slug, description, icon, color, image_url, order_index, is_active) VALUES
('00000000-0000-0000-0001-000000000001', 'Développement Web', 'developpement-web', 'HTML, CSS, JavaScript, React, Next.js et bien plus', 'Code2', '#00674F', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400', 1, TRUE),
('00000000-0000-0000-0001-000000000002', 'Informatique', 'informatique', 'Systèmes, réseaux, cybersécurité, cloud', 'Monitor', '#7c3aed', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', 2, TRUE),
('00000000-0000-0000-0001-000000000003', 'Marketing Digital', 'marketing-digital', 'SEO, réseaux sociaux, publicité en ligne, analytics', 'TrendingUp', '#f84904', 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400', 3, TRUE),
('00000000-0000-0000-0001-000000000004', 'Communication', 'communication', 'Prise de parole, copywriting, personal branding', 'MessageSquare', '#0891b2', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400', 4, TRUE),
('00000000-0000-0000-0001-000000000005', 'Digital & Design', 'digital-design', 'UI/UX, Figma, Photoshop, motion design', 'Palette', '#ec4899', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', 5, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Insert theme settings
INSERT INTO theme_settings (primary_color, secondary_from, secondary_to, font_family, border_radius, dark_mode_default)
VALUES ('#00674F', '#f84904', '#ff0072', 'Sora', '12px', FALSE)
ON CONFLICT DO NOTHING;

-- Insert site settings
INSERT INTO site_settings (key, value) VALUES
('app_name', '"MyLMS"'),
('app_tagline', '"Apprenez avec les meilleurs experts"'),
('contact_email', '"hello@mylms.fr"'),
('company_name', '"MyLMS SAS"'),
('company_address', '"Paris, France"'),
('vat_number', '"FR00000000000"'),
('invoice_prefix', '"FAC"'),
('satisfaction_guarantee_days', '30'),
('support_hours', '"Lun-Ven 9h-18h"')
ON CONFLICT (key) DO NOTHING;

-- Insert sample promo popup
INSERT INTO promo_popups (title, text, coupon_code, target_pages, frequency, is_active)
VALUES (
  '🎉 Offre de bienvenue !',
  'Profitez de -70% sur tous vos premiers cours avec le code BIENVENUE70',
  'BIENVENUE70',
  ARRAY['/', '/cours'],
  'once',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Insert sample coupon
INSERT INTO coupons (code, type, value, max_uses, max_uses_per_user, is_active, description)
VALUES
('BIENVENUE70', 'percentage', 70, 1000, 1, TRUE, 'Code de bienvenue -70%'),
('FLASH50', 'percentage', 50, 500, 2, TRUE, 'Promo flash -50%'),
('ETUDIANT20', 'percentage', 20, NULL, 3, TRUE, 'Réduction étudiant -20%'),
('SAVE10', 'fixed', 10, NULL, NULL, TRUE, 'Remise fixe -10€')
ON CONFLICT (code) DO NOTHING;
