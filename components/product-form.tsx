"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { productSchema, type ProductFormData } from "@/lib/validations/product"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product?: Product
  onSuccess: (product: Product) => void
  onCancel?: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || "",
          price: product.price,
          category: product.category || "",
          stock: product.stock,
          image_url: product.image_url || "",
        }
      : {
          name: "",
          description: "",
          price: 0,
          category: "",
          stock: 0,
          image_url: "",
        },
  })

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save product")
      }

      const savedProduct = await response.json()
      onSuccess(savedProduct)

      if (!product) {
        reset()
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("There was an error saving the product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register("category")} />
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>

        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" type="url" {...register("image_url")} />
        {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
