import Medusa from "@medusajs/js-sdk"
import { campaigns } from "./campaigns"
import { categories } from "./categories"
import { promotions } from "./promotions"

export const backendUrl = __BACKEND_URL__ ?? "http://localhost:9000"

export const client = {
  campaigns: campaigns,
  categories: categories,
  promotions: promotions,
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
