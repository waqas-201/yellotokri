import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { ProductDetail } from "@/components/product-detail"
import { notFound } from "next/navigation"
import type { Product } from "@/lib/types"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductDetail product={product as Product} />
      </main>
    </div>
  )
}
