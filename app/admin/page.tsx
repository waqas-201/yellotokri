import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { AdminDashboard } from "@/components/admin-dashboard"
import type { Product } from "@/lib/types"

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ data: products, error: productsError }, { data: orders, error: ordersError }] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (*)
        )
      `,
      )
      .order("created_at", { ascending: false }),
  ])

  if (productsError) {
    console.error("Error fetching products:", productsError)
  }

  if (ordersError) {
    console.error("Error fetching orders:", ordersError)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your YELLOWTOKRI products and orders</p>
          </div>
          <AdminDashboard products={(products as Product[]) || []} orders={orders || []} />
        </div>
      </main>
    </div>
  )
}
