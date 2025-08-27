import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data: order, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single()

    if (error) {
      console.error("Error updating order status:", error)
      return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
