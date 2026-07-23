-- SQL Seed File for Supabase Database Schema
-- Generated from src/lib/data/mockData.ts for LABEL NUVI

-- 1. categories Table
INSERT INTO categories (id, name, slug, description, image_url, item_count) VALUES
('cat-1', 'Couture Dresses', 'couture-dresses', 'Architectural silhouettes, silk satins, and sculpted evening gowns.', '/images/category-dresses.jpg', 24),
('cat-2', 'Tailored Suiting', 'tailored-suiting', 'Precision double-breasted blazers, wide-leg trousers, and waistcoats.', '/images/product-suit-front.jpg', 18),
('cat-3', 'Sculpt & Contour', 'sculpt-contour', 'Ultra-smoothing bodysuits, second-skin layer pieces.', '/images/hero-portrait.jpg', 15),
('cat-4', 'Atelier Outerwear', 'atelier-outerwear', 'Cashmere trenches, structured leather jackets, and double-faced wool coats.', '/images/editorial-banner.jpg', 12);

-- 2. collections Table
INSERT INTO collections (id, title, slug, subtitle, description, banner_image, is_featured, products_count) VALUES
('col-1', 'The Atelier Drop ''26', 'atelier-drop-26', 'High Fashion Runway Silhouettes', 'Unveiled at Paris Fashion Week. Minimalist lines meet dramatic draping.', '/images/editorial-banner.jpg', true, 16),
('col-2', 'Monochrome Noir', 'monochrome-noir', 'Timeless Obsidian Elegance', 'Deep noir tones engineered in Italian stretch crepe and bonded satin.', '/images/hero-portrait.jpg', true, 12),
('col-3', 'Resort Riviera', 'resort-riviera', 'Sun-Drenched Nude & Gold', 'Fluid champagne satins, breathable European linen, and liquid gold accents.', '/images/category-dresses.jpg', false, 10);

-- 3. products Table
INSERT INTO products (id, name, slug, subtitle, description, price, sale_price, is_new, is_bestseller, category_id, collection_id, rating, reviews_count, created_at) VALUES
('prod-1', 'Soren Cowl Satin Midi Dress', 'soren-cowl-satin-midi-dress', 'Liquid Silk Draped Floor-Length Gown', 'Crafted from heavy 30mm silk satin, the Soren gown cradles the collarbones with a sculpted cowl neck and drops into an effortless open back with hand-rolled spaghetti straps.', 490.00, 420.00, true, true, 'cat-1', 'col-1', 4.9, 38, '2026-07-01 00:00:00+00'),
('prod-2', 'Aura Double-Breasted Linen Blazer Set', 'aura-double-breasted-linen-blazer-set', 'Tailored Power Suiting in Sand Linen', 'An iconic two-piece suit constructed from premium Italian flax linen. Sharp padded shoulders contrast with relaxed, pleated wide-leg trousers for runway authority.', 680.00, NULL, true, true, 'cat-2', 'col-1', 4.8, 22, '2026-07-05 00:00:00+00'),
('prod-3', 'Valeria Sculpt Corset Bodysuit', 'valeria-sculpt-corset-bodysuit', 'Micro-Modal Contour Shaping Layer', 'Engineered high-compression second-skin body contours. Built-in underwire support and bonded boning create an instant snatched silhouette beneath blazers or evening skirts.', 240.00, 195.00, false, true, 'cat-3', 'col-2', 5.0, 64, '2026-06-20 00:00:00+00'),
('prod-4', 'Celine Cashmere Atelier Trench', 'celine-cashmere-atelier-trench', 'Hand-Stitched Double-Faced Wool Coat', 'Floor-sweeping length with exaggerated storm flaps and hand-turned lapels. Made from double-faced cashmere wool blend for weightless warmth.', 1250.00, NULL, true, false, 'cat-4', 'col-1', 4.9, 15, '2026-07-12 00:00:00+00');

-- 4. product_images Table
INSERT INTO product_images (product_id, image_url, display_order) VALUES
('prod-1', '/images/product-dress-front.jpg', 1),
('prod-1', '/images/product-dress-back.jpg', 2),
('prod-1', '/images/category-dresses.jpg', 3),
('prod-2', '/images/product-suit-front.jpg', 1),
('prod-2', '/images/product-suit-back.jpg', 2),
('prod-2', '/images/hero-portrait.jpg', 3),
('prod-3', '/images/hero-portrait.jpg', 1),
('prod-3', '/images/product-dress-front.jpg', 2),
('prod-4', '/images/editorial-banner.jpg', 1),
('prod-4', '/images/product-suit-front.jpg', 2);

-- 5. product_variants Table
INSERT INTO product_variants (product_id, variant_type, value, hex_value, image_url) VALUES
-- prod-1 variants
('prod-1', 'color', 'Champagne Satin', '#E6D5C3', '/images/product-dress-front.jpg'),
('prod-1', 'color', 'Obsidian Black', '#1A1A1A', NULL),
('prod-1', 'color', 'Mocha Nude', '#A89280', NULL),
('prod-1', 'size', 'XXS', NULL, NULL),
('prod-1', 'size', 'XS', NULL, NULL),
('prod-1', 'size', 'S', NULL, NULL),
('prod-1', 'size', 'M', NULL, NULL),
('prod-1', 'size', 'L', NULL, NULL),
('prod-1', 'size', 'XL', NULL, NULL),
-- prod-2 variants
('prod-2', 'color', 'Oatmeal Sand', '#D6C7B2', '/images/product-suit-front.jpg'),
('prod-2', 'color', 'Ivory White', '#F7F5F0', NULL),
('prod-2', 'color', 'Obsidian Black', '#1A1A1A', NULL),
('prod-2', 'size', 'XS', NULL, NULL),
('prod-2', 'size', 'S', NULL, NULL),
('prod-2', 'size', 'M', NULL, NULL),
('prod-2', 'size', 'L', NULL, NULL),
-- prod-3 variants
('prod-3', 'color', 'Pure Ivory', '#FAF8F5', NULL),
('prod-3', 'color', 'Nude Caramel', '#C79E82', NULL),
('prod-3', 'color', 'Obsidian Black', '#111111', NULL),
('prod-3', 'size', 'XXS', NULL, NULL),
('prod-3', 'size', 'XS', NULL, NULL),
('prod-3', 'size', 'S', NULL, NULL),
('prod-3', 'size', 'M', NULL, NULL),
('prod-3', 'size', 'L', NULL, NULL),
('prod-3', 'size', 'XL', NULL, NULL),
('prod-3', 'size', 'XXL', NULL, NULL),
-- prod-4 variants
('prod-4', 'color', 'Camel Beige', '#B89B7A', NULL),
('prod-4', 'color', 'Monochrome Two-Tone', '#3A3835', NULL),
('prod-4', 'size', 'XS', NULL, NULL),
('prod-4', 'size', 'S', NULL, NULL),
('prod-4', 'size', 'M', NULL, NULL),
('prod-4', 'size', 'L', NULL, NULL);

-- 6. product_reviews Table
INSERT INTO product_reviews (id, product_id, user_name, rating, date, title, comment, verified_purchase) VALUES
('rev-1', 'prod-1', 'Elena R.', 5, '2026-07-14', 'Absolute perfection for Paris gala', 'The fabric weight is unreal. It hugs every curve without feeling tight. Reached Paris in 2 days. Stunning quality!', true),
('rev-2', 'prod-1', 'Sophia V.', 5, '2026-07-10', 'Sensual & elegant', 'I felt like a supermodel wearing this. The back drape is so high end. Highly recommend buying your exact size.', true);
