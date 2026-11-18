import { defineRouteConfig } from "@medusajs/admin-sdk"
import { LayoutComposer } from "@medusajs/dashboard/components"
import { PermissionGuard } from "@medusajs/dashboard/hooks"
import { Toaster } from "@medusajs/ui"
import GiftCardIcon from "../../components/icons/gift-card-icon"
import GiftCardProductsSection from "./components/gift-card-products-section"
import { GiftCardsTable } from "./components/gift-cards-table/gift-cards-table"

const GiftCardsPage = () => {
  return (
    <>
      <LayoutComposer
        widgetsZonePrefix="gift_card.list"
        preferredLayoutId="core:two-column"
        sections={{
          main: (
            <LayoutComposer.Entry id="GiftCardsTable">
              <GiftCardsTable />
            </LayoutComposer.Entry>
          ),
          side: (
            <LayoutComposer.Entry id="GiftCardProductsSection">
              <PermissionGuard permission="product:read">
                <GiftCardProductsSection />
              </PermissionGuard>
            </LayoutComposer.Entry>
          ),
        }}
      />

      <Toaster />
    </>
  )
}

export const config = defineRouteConfig({
  label: "Gift Cards",
  icon: GiftCardIcon,
  permissions: ["gift_card:read"],
})

export default GiftCardsPage
