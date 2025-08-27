-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
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
INSERT INTO products (name, description, price, original_price, image_url, category, stock_quantity, is_featured) VALUES
('Foldable Mini Cycle Arm And Leg Exercises with digital meter', 'Compact exercise equipment perfect for home workouts. Features digital meter to track your progress.', 7985.00, 10500.00, '/placeholder.svg?height=400&width=400', 'Sports & Fitness', 15, true),
('Portable Electric Blender Bottle (LED Display) USB Rechargeable', 'Convenient portable blender with LED display and USB charging capability.', 3795.00, 5500.00, '/placeholder.svg?height=400&width=400', 'Home & Kitchen', 25, true),
('EG6 Two-Way Reversible Stroller, High View Foldable Pram', 'Premium baby stroller with reversible seat and high viewing position.', 17685.00, 25500.00, '/placeholder.svg?height=400&width=400', 'Baby & Kids', 8, true),
('Portable Mini Retractable Silicone Juicer Cup Electric', 'Compact silicone juicer cup that retracts for easy storage and portability.', 2995.00, 4500.00, '/placeholder.svg?height=400&width=400', 'Home & Kitchen', 30, false),
('LED Desktop Fish tank Fantasy Fish Lamp', 'Decorative LED fish tank lamp perfect for desktop decoration.', 2695.00, 6500.00, '/placeholder.svg?height=400&width=400', 'Electronics', 12, false),
('Quencher H2.0 Tumbler 30oz – Stainless Steel', 'Premium stainless steel tumbler with leak-proof design and insulation.', 6795.00, 8500.00, '/placeholder.svg?height=400&width=400', 'Home & Kitchen', 20, false),
('Science Park Water Tornado Demonstrator Teaching Instrument', 'Educational water tornado demonstrator for science learning.', 2395.00, 4500.00, '/placeholder.svg?height=400&width=400', 'Electronics', 18, false),
('Night Light Laser Ambiance Lamp Bluetooth Speaker', 'Multi-function device combining night light, laser projector, and Bluetooth speaker.', 2755.00, 7500.00, '/placeholder.svg?height=400&width=400', 'Electronics', 22, true),
('2-in-1 Foldable Sitting and Rocking Children''s Dining', 'Versatile children''s dining chair that converts between sitting and rocking modes.', 21450.00, 30500.00, '/placeholder.svg?height=400&width=400', 'Baby & Kids', 10, false),
('Luxury Bath Gift Set for Women – Spa Accessories with Towel', 'Complete spa gift set with premium bath accessories and soft towel.', 3295.00, 5500.00, '/placeholder.svg?height=400&width=400', 'Home & Kitchen', 35, false);
