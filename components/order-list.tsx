"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { OrderDetails } from "@/components/order-details"
import { Eye, Search, Calendar, User, DollarSign } from "lucide-react"

interface OrderListProps {
  orders: any[]
  onStatusUpdate: (orderId: string, newStatus: string) => void
}

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "processing", label: "Processing", color: "bg-blue-500" },
  { value: "shipped", label: "Shipped", color: "bg-purple-500" },
  { value: "delivered", label: "Delivered", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
]

export function OrderList({ orders, onStatusUpdate }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      onStatusUpdate(orderId, newStatus)
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("There was an error updating the order status. Please try again.")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUSES.find((s) => s.value === status)
    return (
      <Badge className={`${statusConfig?.color || "bg-gray-500"} text-white`}>{statusConfig?.label || status}</Badge>
    )
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No orders found</p>
            <p className="text-sm text-muted-foreground">Orders will appear here once customers start purchasing!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold text-[#FFD700]">${order.total_amount}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""} • {order.customer_email}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <Select
                    value={order.status}
                    onValueChange={(newStatus) => handleStatusUpdate(order.id, newStatus)}
                    disabled={updatingStatus === order.id}
                  >
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">No orders match your search criteria</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
