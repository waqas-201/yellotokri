import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/product-grid"
import { Header } from "@/components/header"
import type { Product } from "@/lib/types"

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-balance">All Products</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Browse our complete collection of happiness-inducing products
          </p>
        </div>
        <ProductGrid products={(products as Product[]) || []} />
      </main>
    </div>
  )
}
