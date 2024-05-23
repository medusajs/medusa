import Medusa from "@medusajs/js-sdk"
import { apiKeys } from "./api-keys"
import { campaigns } from "./campaigns"
import { categories } from "./categories"
import { collections } from "./collections"
import { currencies } from "./currencies"
import { customerGroups } from "./customer-groups"
import { customers } from "./customers"
import { fulfillmentProviders } from "./fulfillment-providers"
import { fulfillments } from "./fulfillments"
import { inventoryItems } from "./inventory"
import { invites } from "./invites"
import { orders } from "./orders"
import { payments } from "./payments"
import { priceLists } from "./price-lists"
import { productTypes } from "./product-types"
import { products } from "./products"
import { promotions } from "./promotions"
import { reservations } from "./reservations"
import { salesChannels } from "./sales-channels"
import { shippingOptions } from "./shipping-options"
import { shippingProfiles } from "./shipping-profiles"
import { stockLocations } from "./stock-locations"
import { stores } from "./stores"
import { tags } from "./tags"
import { taxes } from "./taxes"
import { users } from "./users"
import { workflowExecutions } from "./workflow-executions"

export const backendUrl = __BACKEND_URL__ ?? "http://localhost:9000"

export const client = {
  apiKeys: apiKeys,
  campaigns: campaigns,
  categories: categories,
  customers: customers,
  customerGroups: customerGroups,
  currencies: currencies,
  collections: collections,
  promotions: promotions,
  payments: payments,
  stores: stores,
  salesChannels: salesChannels,
  shippingOptions: shippingOptions,
  shippingProfiles: shippingProfiles,
  tags: tags,
  users: users,
  orders: orders,
  taxes: taxes,
  invites: invites,
  inventoryItems: inventoryItems,
  reservations: reservations,
  fulfillments: fulfillments,
  fulfillmentProviders: fulfillmentProviders,
  products: products,
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
