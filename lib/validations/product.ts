import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(2, "Category is required"),
  stock: z.number().int().min(0, "Stock must be 0 or greater"),
  image_url: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
})

export type ProductFormData = z.infer<typeof productSchema>
