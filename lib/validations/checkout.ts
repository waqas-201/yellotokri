import { z } from "zod"

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  shippingAddress: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(2, "Country is required"),
  }),
  billingAddress: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(2, "Country is required"),
  }),
  sameAsShipping: z.boolean().default(true),
  paymentMethod: z.enum(["card", "paypal", "bank"], {
    required_error: "Please select a payment method",
  }),
  cardDetails: z
    .object({
      cardNumber: z.string().min(16, "Card number must be 16 digits"),
      expiryDate: z.string().min(5, "Please enter expiry date (MM/YY)"),
      cvv: z.string().min(3, "CVV must be 3-4 digits"),
      cardholderName: z.string().min(2, "Cardholder name is required"),
    })
    .optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
