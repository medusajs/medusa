import Medusa from "@medusajs/js-sdk"
import { campaigns } from "./campaigns"
import { categories } from "./categories"
import { customerGroups } from "./customer-groups"
import { fulfillmentProviders } from "./fulfillment-providers"
import { promotions } from "./promotions"
import { reservations } from "./reservations"
import { stockLocations } from "./stock-locations"

export const backendUrl = __BACKEND_URL__ ?? "http://localhost:9000"

export const client = {
  campaigns: campaigns,
  categories: categories,
  customerGroups: customerGroups,
  promotions: promotions,
  reservations: reservations,
  fulfillmentProviders: fulfillmentProviders,
  stockLocations: stockLocations,
}

export const sdk = new Medusa({
  baseUrl: backendUrl,
  auth: {
    type: "session",
  },
})

// useful when you want to call the BE from the console and try things out quickly
if (typeof window !== "undefined") {
  ;(window as any).__sdk = sdk
}
