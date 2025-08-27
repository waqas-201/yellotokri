-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table (no auth needed for MVP)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products for testing
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('Happy Mug', 'Start your day with a smile! Bright yellow ceramic mug perfect for coffee or tea.', 24.99, '/placeholder.svg?height=400&width=400', 'Home & Kitchen', 50),
('Sunshine T-Shirt', 'Comfortable cotton t-shirt featuring the YELLOWTOKRI smiley design.', 29.99, '/placeholder.svg?height=400&width=400', 'Clothing', 100),
('Cheerful Notebook', 'Premium notebook with yellow cover and smiley design. Perfect for journaling or notes.', 19.99, '/placeholder.svg?height=400&width=400', 'Stationery', 75),
('Smile Stickers Pack', 'Pack of 50 waterproof stickers featuring various smiley designs.', 12.99, '/placeholder.svg?height=400&width=400', 'Accessories', 200),
('Happy Tote Bag', 'Eco-friendly canvas tote bag with YELLOWTOKRI branding.', 34.99, '/placeholder.svg?height=400&width=400', 'Bags', 80),
('Sunshine Phone Case', 'Protective phone case with cheerful yellow design.', 22.99, '/placeholder.svg?height=400&width=400', 'Tech', 120);
