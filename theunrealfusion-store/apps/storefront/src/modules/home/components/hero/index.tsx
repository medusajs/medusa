import { Button, Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CashfreeIcon from "@modules/common/icons/cashfree"
import CashOnDeliveryIcon from "@modules/common/icons/cash-on-delivery"

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden bg-neutral-950 text-white border-b border-neutral-800">
      {/* Background Gradient & Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 small:py-28 flex flex-col items-center text-center">
        {/* Top India Launch Pill */}
        <div className="inline-flex items-center gap-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-emerald-400 mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>India Flagship Store Live • Pan-India Free Delivery Active</span>
        </div>

        {/* Heading */}
        <Heading
          level="h1"
          className="text-4xl small:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight mb-6"
        >
          Elevated Living, Curated For{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Discerning Modern Taste.
          </span>
        </Heading>

        {/* Subtitle */}
        <p className="text-lg small:text-xl text-neutral-400 max-w-2xl font-light leading-relaxed mb-10">
          Discover hand-crafted tech, luxury apparel, sculptural home decor, and timeless accessories.
          Engineered for excellence and delivered seamlessly across India.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col small:flex-row items-center gap-4 mb-16 w-full small:w-auto">
          <LocalizedClientLink href="/store" className="w-full small:w-auto">
            <Button
              size="large"
              className="w-full small:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20"
            >
              Explore Full Collection
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/collections/tech-audio" className="w-full small:w-auto">
            <Button
              variant="secondary"
              size="large"
              className="w-full small:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold rounded-full backdrop-blur-sm transition-all"
            >
              Tech & Audio Lineup
            </Button>
          </LocalizedClientLink>
        </div>

        {/* Feature / Trust Badges Bar */}
        <div className="w-full grid grid-cols-2 medium:grid-cols-4 gap-4 pt-8 border-t border-neutral-800/80 text-left">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Free Pan-India Delivery</p>
              <p className="text-xs text-neutral-400">On all orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
              <CashfreeIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Instant UPI & Cards</p>
              <p className="text-xs text-neutral-400">Powered by Cashfree Payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
              <CashOnDeliveryIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Cash on Delivery</p>
              <p className="text-xs text-neutral-400">Doorstep payment available</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">7-Day Easy Returns</p>
              <p className="text-xs text-neutral-400">100% Genuine guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
