"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, AlertTriangle } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return
    }

    setDeletingId(product.id)

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      onDelete(product.id)
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("There was an error deleting the product. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No products found</p>
            <p className="text-sm text-muted-foreground">Add your first product to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <Image
              src={product.image_url || "/placeholder.svg?height=200&width=200"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.stock <= 10 && product.stock > 0 && (
              <Badge className="absolute top-2 right-2 bg-orange-500">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Low Stock
              </Badge>
            )}
            {product.stock === 0 && <Badge className="absolute top-2 right-2 bg-destructive">Out of Stock</Badge>}
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold line-clamp-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#FFD700]">${product.price}</span>
                {product.category && (
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Stock: {product.stock}</span>
                <span className="text-muted-foreground">{new Date(product.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit(product)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive bg-transparent"
                  onClick={() => handleDelete(product)}
                  disabled={deletingId === product.id}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {deletingId === product.id ? "..." : "Delete"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
