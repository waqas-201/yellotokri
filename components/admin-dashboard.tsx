"use client"

import { useState } from "react"
import { ProductForm } from "@/components/product-form"
import { ProductList } from "@/components/product-list"
import { OrderList } from "@/components/order-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, ShoppingCart, DollarSign, ClipboardList } from "lucide-react"
import type { Product } from "@/lib/types"

interface AdminDashboardProps {
  products: Product[]
  orders: any[] // We'll type this properly later
}

export function AdminDashboard({ products: initialProducts, orders: initialOrders }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleProductAdded = (newProduct: Product) => {
    setProducts([newProduct, ...products])
    setShowAddForm(false)
  }

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setEditingProduct(null)
  }

  const handleProductDeleted = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const handleOrderStatusUpdated = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const lowStockProducts = products.filter((product) => product.stock <= 10).length
  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FFD700]">{pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add-product">Add Product</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Order Management</h2>
          </div>
          <OrderList orders={orders} onStatusUpdate={handleOrderStatusUpdated} />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Product Management</h2>
            <Button onClick={() => setShowAddForm(true)} className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          <ProductList products={products} onEdit={setEditingProduct} onDelete={handleProductDeleted} />
        </TabsContent>

        <TabsContent value="add-product">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm onSuccess={handleProductAdded} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm onSuccess={handleProductAdded} onCancel={() => setShowAddForm(false)} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Edit Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                product={editingProduct}
                onSuccess={handleProductUpdated}
                onCancel={() => setEditingProduct(null)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
