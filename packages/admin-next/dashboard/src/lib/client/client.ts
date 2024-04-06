import { apiKeys } from "./api-keys"
import { auth } from "./auth"
import { campaigns } from "./campaigns"
import { categories } from "./categories"
import { collections } from "./collections"
import { currencies } from "./currencies"
import { customers } from "./customers"
import { invites } from "./invites"
import { priceLists } from "./price-lists"
import { productTypes } from "./product-types"
import { products } from "./products"
import { promotions } from "./promotions"
import { regions } from "./regions"
import { salesChannels } from "./sales-channels"
import { stockLocations } from "./stock-locations"
import { stores } from "./stores"
import { tags } from "./tags"
import { users } from "./users"
import { workflowExecutions } from "./workflow-executions"

export const client = {
  auth: auth,
  apiKeys: apiKeys,
  campaigns: campaigns,
  categories: categories,
  customers: customers,
  currencies: currencies,
  collections: collections,
  promotions: promotions,
  stores: stores,
  salesChannels: salesChannels,
  tags: tags,
  users: users,
  regions: regions,
  invites: invites,
  products: products,
  productTypes: productTypes,
  priceLists: priceLists,
  stockLocations: stockLocations,
  workflowExecutions: workflowExecutions,
}
