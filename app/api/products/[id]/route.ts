import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { productSchema } from "@/lib/validations/product"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Validate the request body
    const validatedData = productSchema.parse(body)

    const { data: product, error } = await supabase
      .from("products")
      .update({
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        stock: validatedData.stock,
        image_url: validatedData.image_url || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
