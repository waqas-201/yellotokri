import { Header } from "@/components/header"
import { CartTable } from "@/components/cart-table"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <CartTable />
        </div>
      </main>
    </div>
  )
}
