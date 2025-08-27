import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      customer_name,
      customer_email,
      customer_phone,
      total_amount,
      items,
      shipping_address,
      billing_address,
      payment_method,
    } = body

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Rollback the order if items creation fails
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error processing order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
