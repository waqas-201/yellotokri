"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/checkout"
import { OrderSummary } from "@/components/order-summary"
import { useRouter } from "next/navigation"
import { CreditCard, Smartphone, Building } from "lucide-react"

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
      paymentMethod: "card",
      shippingAddress: {
        country: "United States",
      },
      billingAddress: {
        country: "United States",
      },
    },
  })

  const sameAsShipping = watch("sameAsShipping")
  const paymentMethod = watch("paymentMethod")

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      alert("Your cart is empty!")
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        total_amount: getTotalPrice(),
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shipping_address: data.shippingAddress,
        billing_address: sameAsShipping ? data.shippingAddress : data.billingAddress,
        payment_method: data.paymentMethod,
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
      <div className="lg:col-span-2 space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name</Label>
                <Input id="customerName" {...register("customerName")} />
                {errors.customerName && <p className="text-sm text-destructive">{errors.customerName.message}</p>}
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input id="customerPhone" type="tel" {...register("customerPhone")} />
                {errors.customerPhone && <p className="text-sm text-destructive">{errors.customerPhone.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="customerEmail">Email Address</Label>
              <Input id="customerEmail" type="email" {...register("customerEmail")} />
              {errors.customerEmail && <p className="text-sm text-destructive">{errors.customerEmail.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="shippingStreet">Street Address</Label>
              <Input id="shippingStreet" {...register("shippingAddress.street")} />
              {errors.shippingAddress?.street && (
                <p className="text-sm text-destructive">{errors.shippingAddress.street.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="shippingCity">City</Label>
                <Input id="shippingCity" {...register("shippingAddress.city")} />
                {errors.shippingAddress?.city && (
                  <p className="text-sm text-destructive">{errors.shippingAddress.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="shippingState">State</Label>
                <Input id="shippingState" {...register("shippingAddress.state")} />
                {errors.shippingAddress?.state && (
                  <p className="text-sm text-destructive">{errors.shippingAddress.state.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="shippingZip">ZIP Code</Label>
                <Input id="shippingZip" {...register("shippingAddress.zipCode")} />
                {errors.shippingAddress?.zipCode && (
                  <p className="text-sm text-destructive">{errors.shippingAddress.zipCode.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="shippingCountry">Country</Label>
                <Input id="shippingCountry" {...register("shippingAddress.country")} />
                {errors.shippingAddress?.country && (
                  <p className="text-sm text-destructive">{errors.shippingAddress.country.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAsShipping"
                checked={sameAsShipping}
                onCheckedChange={(checked) => setValue("sameAsShipping", checked as boolean)}
              />
              <Label htmlFor="sameAsShipping">Same as shipping address</Label>
            </div>

            {!sameAsShipping && (
              <>
                <div>
                  <Label htmlFor="billingStreet">Street Address</Label>
                  <Input id="billingStreet" {...register("billingAddress.street")} />
                  {errors.billingAddress?.street && (
                    <p className="text-sm text-destructive">{errors.billingAddress.street.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="billingCity">City</Label>
                    <Input id="billingCity" {...register("billingAddress.city")} />
                    {errors.billingAddress?.city && (
                      <p className="text-sm text-destructive">{errors.billingAddress.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="billingState">State</Label>
                    <Input id="billingState" {...register("billingAddress.state")} />
                    {errors.billingAddress?.state && (
                      <p className="text-sm text-destructive">{errors.billingAddress.state.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="billingZip">ZIP Code</Label>
                    <Input id="billingZip" {...register("billingAddress.zipCode")} />
                    {errors.billingAddress?.zipCode && (
                      <p className="text-sm text-destructive">{errors.billingAddress.zipCode.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="billingCountry">Country</Label>
                    <Input id="billingCountry" {...register("billingAddress.country")} />
                    {errors.billingAddress?.country && (
                      <p className="text-sm text-destructive">{errors.billingAddress.country.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setValue("paymentMethod", value as "card" | "paypal" | "bank")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  PayPal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input id="cardholderName" {...register("cardDetails.cardholderName")} />
                    {errors.cardDetails?.cardholderName && (
                      <p className="text-sm text-destructive">{errors.cardDetails.cardholderName.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" {...register("cardDetails.cardNumber")} />
                    {errors.cardDetails?.cardNumber && (
                      <p className="text-sm text-destructive">{errors.cardDetails.cardNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" placeholder="MM/YY" {...register("cardDetails.expiryDate")} />
                    {errors.cardDetails?.expiryDate && (
                      <p className="text-sm text-destructive">{errors.cardDetails.expiryDate.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" {...register("cardDetails.cvv")} />
                    {errors.cardDetails?.cvv && (
                      <p className="text-sm text-destructive">{errors.cardDetails.cvv.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <OrderSummary />
        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Complete Order"}
        </Button>
      </div>
    </form>
  )
}
