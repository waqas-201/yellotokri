export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  stock: number
  created_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  total_amount: number
  status: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}
