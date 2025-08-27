import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#FFD700] to-[#FFA500] py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 text-balance">Spread Happiness Every Day</h1>
          <p className="text-lg md:text-xl text-black/80 mb-8 text-pretty">
            Discover our collection of cheerful products designed to bring smiles to your everyday life. From happy mugs
            to sunshine apparel, we've got everything you need to brighten your world.
          </p>
          <Button size="lg" className="bg-black text-white hover:bg-black/90 text-lg px-8 py-3">
            Shop Now
          </Button>
        </div>
      </div>

      {/* Decorative smiley faces */}
      <div className="absolute top-10 left-10 text-6xl opacity-20">😊</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-20">😄</div>
      <div className="absolute top-1/2 left-20 text-3xl opacity-15">😃</div>
    </section>
  )
}
