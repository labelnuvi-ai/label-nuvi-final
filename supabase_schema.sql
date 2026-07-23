-- Supabase Database Schema for LABEL NUVI
-- Create tables for Profiles, Cart Items, Wishlist Items, Orders, Order Items, and Products

-- 1. profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to automatically create a profile record when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.phone);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  item_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (true);

-- 3. collections Table
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  banner_image TEXT,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  products_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Admin manage collections" ON collections FOR ALL USING (true);

-- 4. products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  is_new BOOLEAN DEFAULT true NOT NULL,
  is_bestseller BOOLEAN DEFAULT false NOT NULL,
  is_sold_out BOOLEAN DEFAULT false NOT NULL,
  images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  colors JSONB DEFAULT '[]'::JSONB NOT NULL,
  sizes TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL,
  rating DECIMAL(3, 2) DEFAULT 5.00 NOT NULL,
  reviews_count INTEGER DEFAULT 0 NOT NULL,
  details TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  fabric_care TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin manage products" ON products FOR ALL USING (true);

-- 5. cart_items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  size_value TEXT NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart items" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- 6. wishlist_items Table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlist_items
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist items" ON wishlist_items
  FOR ALL USING (auth.uid() = user_id);

-- 7. orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'Processing' NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
  shipping DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  tracking_number TEXT,
  payment_method TEXT NOT NULL,
  shipping_name TEXT NOT NULL,
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  shipping_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. order_items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- 9. Storage Bucket Setup
-- Create product-images storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies to allow public reads and authenticated uploads
CREATE POLICY "Public read bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin uploads to bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
