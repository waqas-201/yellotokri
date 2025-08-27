"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/checkout"
import { OrderSummary } from "@/components/order-summary"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import Link from "next/link"

export function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsShipping: true,
      paymentMethod: "cod", // Default to Cash on Delivery
      shippingMethod: "free", // Added shipping method
      shippingAddress: {
        country: "Pakistan", // Default to Pakistan
      },
      billingAddress: {
        country: "Pakistan",
      },
      saveInfo: false, // Added save info option
      emailOffers: false, // Added email offers option
    },
  })

  const sameAsShipping = watch("sameAsShipping")
  const paymentMethod = watch("paymentMethod")
  const shippingMethod = watch("shippingMethod")

  const subtotal = getTotalPrice()
  const shippingCost = shippingMethod === "free" && subtotal >= 10000 ? 0 : shippingMethod === "standard" ? 249 : 0
  const total = subtotal + shippingCost

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      alert("Your cart is empty!")
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        customer_name: `${data.firstName} ${data.lastName}`, // Combine first and last name
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        total_amount: total, // Use calculated total with shipping
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shipping_address: data.shippingAddress,
        billing_address: sameAsShipping ? data.shippingAddress : data.billingAddress,
        payment_method: data.paymentMethod,
        shipping_method: data.shippingMethod, // Include shipping method
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const order = await response.json()
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("There was an error processing your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button onClick={() => router.push("/")} className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Contact</h2>
            <Link href="/login" className="text-blue-600 hover:underline text-sm">
              Log in
            </Link>
          </div>
          <div className="space-y-4">
            <div>
              <Input placeholder="Email or mobile phone number" {...register("customerEmail")} className="w-full" />
              {errors.customerEmail && <p className="text-sm text-destructive mt-1">{errors.customerEmail.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="emailOffers" {...register("emailOffers")} />
              <Label htmlFor="emailOffers" className="text-sm">
                Email me with news and offers
              </Label>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="country">Country/Region</Label>
              <Select defaultValue="Pakistan">
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pakistan">Pakistan</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input placeholder="First name (optional)" {...register("firstName")} />
                {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Input placeholder="Last name" {...register("lastName")} />
                {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <Input placeholder="Address" {...register("shippingAddress.street")} />
              {errors.shippingAddress?.street && (
                <p className="text-sm text-destructive mt-1">{errors.shippingAddress.street.message}</p>
              )}
            </div>

            <div>
              <Input placeholder="Apartment, suite, etc. (optional)" {...register("shippingAddress.apartment")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input placeholder="City" {...register("shippingAddress.city")} />
                {errors.shippingAddress?.city && (
                  <p className="text-sm text-destructive mt-1">{errors.shippingAddress.city.message}</p>
                )}
              </div>
              <div>
                <Input placeholder="Postal code (optional)" {...register("shippingAddress.zipCode")} />
              </div>
            </div>

            <div className="relative">
              <Input placeholder="Phone" {...register("customerPhone")} className="pr-8" />
              <Info className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {errors.customerPhone && <p className="text-sm text-destructive mt-1">{errors.customerPhone.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="saveInfo" {...register("saveInfo")} />
              <Label htmlFor="saveInfo" className="text-sm">
                Save this information for next time
              </Label>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping method</h2>
          <RadioGroup
            value={shippingMethod}
            onValueChange={(value) => setValue("shippingMethod", value)}
            className="space-y-3"
          >
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free Shipping Above Rs. 10,000/-</Label>
              </div>
              <span className="font-semibold">FREE</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">Standard Delivery</Label>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500 line-through">Rs.249.00</span>
                <span className="font-semibold ml-2">FREE</span>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setValue("paymentMethod", value)}
            className="space-y-3"
          >
            <div className="border rounded-lg">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-t-lg">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="font-medium">
                  Cash on Delivery (COD)
                </Label>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank">Bank Deposit</Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="easypaisa" id="easypaisa" />
              <Label htmlFor="easypaisa">Easypaisa</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Billing address</h2>
          <RadioGroup
            value={sameAsShipping ? "same" : "different"}
            onValueChange={(value) => setValue("sameAsShipping", value === "same")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg bg-blue-50">
              <RadioGroupItem value="same" id="same" />
              <Label htmlFor="same">Same as shipping address</Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="different" id="different" />
              <Label htmlFor="different">Use a different billing address</Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Complete order"}
        </Button>
      </div>

      <div className="space-y-6">
        <OrderSummary showShipping={true} shippingCost={shippingCost} />
      </div>
    </form>
  )
}
