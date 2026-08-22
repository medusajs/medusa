import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Top Notification Announcement Bar */}
      <div className="bg-neutral-950 text-neutral-300 text-xs py-1.5 px-4 text-center border-b border-neutral-800 font-medium flex items-center justify-center gap-x-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>⚡ Free Pan-India Express Delivery on all orders above ₹999 • Cashfree Instant UPI & Cards Live</span>
      </div>

      <header className="relative h-16 mx-auto border-b duration-200 bg-white/95 backdrop-blur-md border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center gap-x-4">
            <div className="h-full flex items-center">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            <div className="hidden medium:flex items-center gap-x-6">
              <LocalizedClientLink
                href="/store"
                className="hover:text-ui-fg-base transition-colors font-medium"
              >
                Store
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/collections/tech-audio"
                className="hover:text-ui-fg-base transition-colors font-medium"
              >
                Tech
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/collections/designer-apparel"
                className="hover:text-ui-fg-base transition-colors font-medium"
              >
                Apparel
              </LocalizedClientLink>
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base tracking-widest font-extrabold uppercase flex items-center gap-x-2"
              data-testid="nav-store-link"
            >
              <span className="w-6 h-6 rounded-lg bg-neutral-950 text-white flex items-center justify-center text-xs font-black shadow-sm">
                U
              </span>
              <span>THE UNREAL FUSION</span>
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <div className="flex items-center gap-x-1.5 text-xs text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
                <span className="font-semibold text-neutral-900">INR (₹)</span>
                <span>• India</span>
              </div>
              <LocalizedClientLink
                className="hover:text-ui-fg-base font-medium transition-colors"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
