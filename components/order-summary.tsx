"use client"

import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function OrderSummary() {
  const { items, getTotalPrice } = useCart()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={item.product.image_url || "/placeholder.svg?height=48&width=48"}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-[#FFD700]">${total.toFixed(2)}</span>
          </div>
        </div>

        {subtotal < 50 && (
          <p className="text-xs text-muted-foreground">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
        )}
      </CardContent>
    </Card>
  )
}
