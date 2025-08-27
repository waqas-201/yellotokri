import { Header } from "@/components/header"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your order and spread the happiness!</p>
          </div>
          <CheckoutForm />
        </div>
      </main>
    </div>
  )
}
