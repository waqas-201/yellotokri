import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { OrderConfirmation } from "@/components/order-confirmation"
import { notFound } from "next/navigation"

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
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
    .eq("id", id)
    .single()

  if (error || !order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <OrderConfirmation order={order} />
      </main>
    </div>
  )
}
