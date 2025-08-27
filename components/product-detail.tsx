"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/types"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1) // Reset quantity after adding
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <Image
            src={product.image_url || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.category && (
              <Badge variant="secondary" className="mb-4">
                {product.category}
              </Badge>
            )}
            <p className="text-4xl font-bold text-[#FFD700] mb-4">${product.price}</p>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Stock:</span>
                  <span className={product.stock > 10 ? "text-green-600" : "text-orange-600"}>
                    {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                  </span>
                </div>

                {product.stock > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-[#FFD700]">${(product.price * quantity).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg py-6"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  )
}
