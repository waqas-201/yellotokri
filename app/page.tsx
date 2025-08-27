"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ProductGrid } from "@/components/product-grid"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Database, Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [databaseError, setDatabaseError] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      const timeoutId = setTimeout(() => {
        console.log("[v0] Fetch timeout - setting loading to false")
        setLoading(false)
        setDatabaseError(true)
      }, 10000) // 10 second timeout

      try {
        console.log("[v0] Starting product fetch...")
        const supabase = createClient()

        const { data: testData, error: testError } = await supabase
          .from("products")
          .select("count", { count: "exact", head: true })

        if (testError) {
          console.log("[v0] Connection test failed:", testError)
          throw testError
        }

        console.log("[v0] Connection successful, fetching products...")
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

        clearTimeout(timeoutId) // Clear timeout on successful response

        if (error) {
          console.error("Error fetching products:", error)
          if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
            setDatabaseError(true)
          }
        } else {
          console.log("[v0] Products fetched successfully:", data?.length || 0)
          setProducts(data as Product[])
        }
      } catch (error) {
        console.error("Database connection error:", error)
        clearTimeout(timeoutId) // Clear timeout on error
        setDatabaseError(true)
      } finally {
        console.log("[v0] Setting loading to false")
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const retryFetch = () => {
    setLoading(true)
    setDatabaseError(false)
    setProducts([])

    // Trigger re-fetch by updating a dependency
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <section className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-500" />
              <p className="text-muted-foreground">Loading products...</p>
              <p className="text-xs text-muted-foreground mt-2">
                If this takes too long, there might be a connection issue
              </p>
            </div>
          </section>
        ) : databaseError ? (
          <section className="max-w-2xl mx-auto">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl text-yellow-800">Database Setup Required</CardTitle>
                <CardDescription className="text-yellow-700">
                  Welcome to YELLOWTOKRI! To get started, you need to set up the database tables.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Setup Instructions:
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
                    <li>
                      Run the database script:{" "}
                      <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                        scripts/001_create_ecommerce_tables.sql
                      </code>
                    </li>
                    <li>
                      Add sample products:{" "}
                      <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                        scripts/002_add_more_sample_products.sql
                      </code>
                    </li>
                    <li>Refresh this page to see your products!</li>
                  </ol>
                </div>
                <div className="text-center space-x-2">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Refresh Page
                  </Button>
                  <Button
                    onClick={retryFetch}
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        ) : (
          <section>
            <h2 className="text-3xl font-bold text-center mb-8 text-balance">Our Happy Products</h2>
            <ProductGrid products={products} />
          </section>
        )}
      </main>
    </div>
  )
}
