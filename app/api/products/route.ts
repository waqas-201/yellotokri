import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { productSchema } from "@/lib/validations/product"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate the request body
    const validatedData = productSchema.parse(body)

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        stock: validatedData.stock,
        image_url: validatedData.image_url || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
