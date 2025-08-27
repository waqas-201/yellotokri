"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, User, Mail, Phone, Package } from "lucide-react"
import Image from "next/image"

interface OrderDetailsProps {
  order: any
  onClose: () => void
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</h2>
          <p className="text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(order.status)} text-white`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Customer Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{order.customer_email}</span>
            </div>
            {order.customer_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer_phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items ({order.order_items.length})</span>
              <span>${order.total_amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-[#FFD700]">${order.total_amount}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Items
        </h3>
        <div className="space-y-3">
          {order.order_items.map((item: any) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={item.products.image_url || "/placeholder.svg?height=64&width=64"}
                  alt={item.products.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.products.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.products.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">Quantity: {item.quantity}</span>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose} className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          Close
        </Button>
      </div>
    </div>
  )
}
