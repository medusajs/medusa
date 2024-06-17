import Medusa from "@medusajs/js-sdk"
import { apiKeys } from "./api-keys"
import { campaigns } from "./campaigns"
import { categories } from "./categories"
import { currencies } from "./currencies"
import { customerGroups } from "./customer-groups"
import { fulfillmentProviders } from "./fulfillment-providers"
import { fulfillments } from "./fulfillments"
import { invites } from "./invites"
import { payments } from "./payments"
import { priceLists } from "./price-lists"
import { productTypes } from "./product-types"
import { promotions } from "./promotions"
import { reservations } from "./reservations"
import { salesChannels } from "./sales-channels"
import { shippingOptions } from "./shipping-options"
import { shippingProfiles } from "./shipping-profiles"
import { stockLocations } from "./stock-locations"
import { stores } from "./stores"
import { tags } from "./tags"
import { users } from "./users"
import { workflowExecutions } from "./workflow-executions"

export const backendUrl = __BACKEND_URL__ ?? "http://localhost:9000"

export const client = {
  apiKeys: apiKeys,
  campaigns: campaigns,
  categories: categories,
  customerGroups: customerGroups,
  currencies: currencies,
  promotions: promotions,
  payments: payments,
  stores: stores,
  salesChannels: salesChannels,
  shippingOptions: shippingOptions,
  shippingProfiles: shippingProfiles,
  productTags: tags,
  users: users,
  invites: invites,
  reservations: reservations,
  fulfillments: fulfillments,
  fulfillmentProviders: fulfillmentProviders,
  productTypes: productTypes,
  priceLists: priceLists,
  stockLocations: stockLocations,
  workflowExecutions: workflowExecutions,
}

export const sdk = new Medusa({
  baseUrl: backendUrl,
  auth: {
    type: "session",
  },
})
