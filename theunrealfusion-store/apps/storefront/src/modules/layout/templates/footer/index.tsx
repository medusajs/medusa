import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@modules/common/components/ui"
import CashfreeIcon from "@modules/common/icons/cashfree"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 text-neutral-800 w-full">
      <div className="content-container flex flex-col w-full py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-200">
          {/* Brand Info */}
          <div className="flex flex-col gap-y-4">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-neutral-900 tracking-wider font-extrabold uppercase flex items-center gap-x-2"
            >
              <span className="w-6 h-6 rounded bg-neutral-950 text-white flex items-center justify-center text-xs font-black">
                U
              </span>
              <span>THE UNREAL FUSION</span>
            </LocalizedClientLink>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
              Curated luxury e-commerce for contemporary living, audiophile acoustics, and high-performance lifestyle essentials in India.
            </p>
            <div className="flex items-center gap-x-2 pt-2 text-xs text-neutral-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Headquartered in Bengaluru & Mumbai, India</span>
            </div>
          </div>

          {/* Collections */}
          <div className="flex flex-col gap-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-900">
              Featured Collections
            </span>
            <ul className="flex flex-col gap-y-2 text-sm text-neutral-600">
              {collections?.map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    className="hover:text-neutral-900 transition-colors"
                    href={`/collections/${c.handle}`}
                  >
                    {c.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & India Policies */}
          <div className="flex flex-col gap-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-900">
              Customer Support
            </span>
            <ul className="flex flex-col gap-y-2 text-sm text-neutral-600">
              <li>
                <LocalizedClientLink href="/customer-service" className="hover:text-neutral-900">
                  Track Your Order
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/customer-service" className="hover:text-neutral-900">
                  Pan-India Shipping Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/customer-service" className="hover:text-neutral-900">
                  Returns & Refunds (7 Days)
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/customer-service" className="hover:text-neutral-900">
                  Cash on Delivery (COD) FAQ
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="flex flex-col gap-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-900">
              Payment & Security
            </span>
            <p className="text-xs text-neutral-500">
              All transactions are secured with 256-bit SSL encryption.
            </p>
            <div className="flex items-center gap-x-3 pt-2">
              <div className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 shadow-sm text-xs font-semibold text-[#002970]">
                <CashfreeIcon className="w-4 h-4" />
                <span>Cashfree Payments</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-neutral-500 font-medium">
              <span className="bg-neutral-200/60 px-2 py-0.5 rounded">UPI</span>
              <span className="bg-neutral-200/60 px-2 py-0.5 rounded">GPay</span>
              <span className="bg-neutral-200/60 px-2 py-0.5 rounded">PhonePe</span>
              <span className="bg-neutral-200/60 px-2 py-0.5 rounded">Paytm</span>
              <span className="bg-neutral-200/60 px-2 py-0.5 rounded">RuPay</span>
              <span className="bg-neutral-200/60 px-2 py-0.5 rounded">Cards</span>
              <span className="bg-neutral-200/60 px-2 py-0.5 rounded">COD</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row w-full mt-8 justify-between items-center text-xs text-neutral-500 gap-y-4">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} The Unreal Fusion Inc. All rights reserved. Operating in India with INR (₹) pricing.
          </Text>
          <div className="flex items-center gap-x-4">
            <span>GST Compliant</span>
            <span>•</span>
            <span>Made with Medusa v2 Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
