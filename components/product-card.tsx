"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product, 1)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock <= 10 && product.stock > 0 && (
          <Badge className="absolute top-2 right-2 bg-[#FFD700] text-black">Only {product.stock} left!</Badge>
        )}
        {product.stock === 0 && <Badge className="absolute top-2 right-2 bg-destructive">Out of Stock</Badge>}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#FFD700]">${product.price}</span>
            {product.category && (
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              View Details
            </Button>
          </Link>
          <Button
            className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
