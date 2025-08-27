"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartDrawer() {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, isOpen, setIsOpen } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent relative">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#FFD700] text-black text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({getTotalItems()})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 p-3 border rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.product.image_url || "/placeholder.svg?height=64&width=64"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-[#FFD700] font-semibold">${item.product.price}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <p className="text-sm font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-[#FFD700]">${getTotalPrice().toFixed(2)}</span>
                </div>

                <Link href="/checkout" className="block">
                  <Button
                    className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg py-6"
                    onClick={() => setIsOpen(false)}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
