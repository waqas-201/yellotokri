"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function CartTable() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Your cart</h1>
        <p className="text-muted-foreground mb-8">Your cart is empty</p>
        <Button onClick={() => router.push("/")} className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white px-8 py-3">
          Continue shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your cart</h1>
        <Link href="/" className="text-muted-foreground hover:text-foreground underline">
          Continue shopping
        </Link>
      </div>

      {/* Cart Table */}
      <div className="space-y-6">
        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-4 pb-4 border-b text-sm font-medium text-muted-foreground uppercase tracking-wide">
          <div className="col-span-6">Product</div>
          <div className="col-span-3 text-center">Quantity</div>
          <div className="col-span-3 text-right">Total</div>
        </div>

        {/* Cart Items */}
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.product.id} className="grid grid-cols-12 gap-4 items-center py-4">
              {/* Product Info */}
              <div className="col-span-6 flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.product.image_url || "/placeholder.svg?height=80&width=80"}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg mb-1 line-clamp-2">{item.product.name}</h3>
                  <p className="text-muted-foreground mb-2">Rs.{item.product.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Color: <span className="text-foreground">Gray</span>
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="col-span-3 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive ml-2"
                  onClick={() => removeItem(item.product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Item Total */}
              <div className="col-span-3 text-right">
                <p className="text-lg font-medium">Rs.{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="flex justify-end">
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t">
            <span>Estimated total</span>
            <span>Rs.{getTotalPrice().toFixed(2)} PKR</span>
          </div>
          <p className="text-sm text-muted-foreground text-right">
            Taxes, discounts and{" "}
            <Link href="#" className="underline hover:no-underline">
              shipping
            </Link>{" "}
            calculated at checkout.
          </p>
          <Link href="/checkout" className="block">
            <Button className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white py-6 text-lg font-medium" size="lg">
              Check out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
