"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ArrowLeft, Star, Truck, CreditCard, Percent } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/types"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("Gray")
  const { addItem } = useCart()

  const productImages = [
    product.image_url || "/placeholder.svg?height=600&width=600",
    "/product-angle-2.png",
    "/product-angle-3.png",
    "/product-angle-4.png",
  ]

  const originalPrice = product.price * 1.4 // Mock original price
  const rating = 4.8 // Mock rating
  const reviewCount = 6 // Mock review count
  const colors = ["Gray", "Black", "White"]

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={productImages[selectedImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Image thumbnails */}
          <div className="flex gap-2 overflow-x-auto">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImageIndex === index ? "border-orange-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4 leading-tight">{product.name}</h1>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-medium">Nationwide delivery</div>
                  <div className="text-muted-foreground">2-4 days</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-muted-foreground">available</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Percent className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-medium">Online payment 5%</div>
                  <div className="text-muted-foreground">OFF</div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-orange-700">
                <span className="text-lg">🎉</span>
                <span className="font-medium">Get Rs.100 OFF with code</span>
                <Badge variant="secondary" className="bg-black text-white">
                  CHEENA100
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{reviewCount} reviews</span>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">Rs.{product.price.toFixed(2)} PKR</span>
                <span className="text-xl text-muted-foreground line-through">Rs.{originalPrice.toFixed(2)} PKR</span>
              </div>

              {/* Free shipping badge */}
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-orange-500 text-white">📦 Free shipping on 10,000 order</Badge>
              </div>

              <Link href="#" className="text-sm text-blue-600 hover:underline">
                Shipping calculated at checkout.
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-medium">Color:</span>
              <span>{selectedColor}</span>
            </div>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-orange-500" : "border-gray-300"
                  } ${color === "Gray" ? "bg-gray-400" : color === "Black" ? "bg-black" : "bg-white"}`}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium">In stock</span>
          </div>

          {/* Quantity selector */}
          <div className="space-y-3">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-16 text-center font-medium text-lg">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-700">
              <span className="text-lg">⭐</span>
              <span className="font-medium">Get Extra 05% OFF on</span>
              <Badge variant="secondary" className="bg-black text-white">
                Bank Transfer
              </Badge>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white text-lg py-6 rounded-lg"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  )
}
