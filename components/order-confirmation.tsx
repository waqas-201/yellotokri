import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderConfirmationProps {
  order: any // We'll type this properly later
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your order! We'll send you a confirmation email shortly.</p>
      </div>

      <Card className="text-left mb-6">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Order Number</p>
              <p className="text-muted-foreground">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="font-medium">Order Date</p>
              <p className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Customer</p>
              <p className="text-muted-foreground">{order.customer_name}</p>
            </div>
            <div>
              <p className="font-medium">Total</p>
              <p className="text-[#FFD700] font-semibold">${order.total_amount}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <p className="font-medium">Items Ordered:</p>
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={item.products.image_url || "/placeholder.svg?height=48&width=48"}
                    alt={item.products.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.products.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We'll send you tracking information once your order ships. Expected delivery: 3-5 business days.
        </p>
        <Link href="/">
          <Button className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
