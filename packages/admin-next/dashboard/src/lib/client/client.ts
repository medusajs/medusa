import { apiKeys } from "./api-keys"
import { auth } from "./auth"
import { campaigns } from "./campaigns"
import { categories } from "./categories"
import { collections } from "./collections"
import { currencies } from "./currencies"
import { customerGroups } from "./customer-groups"
import { customers } from "./customers"
import { invites } from "./invites"
import { payments } from "./payments"
import { productTypes } from "./product-types"
import { products } from "./products"
import { promotions } from "./promotions"
import { regions } from "./regions"
import { salesChannels } from "./sales-channels"
import { stockLocations } from "./stock-locations"
import { stores } from "./stores"
import { tags } from "./tags"
import { taxes } from "./taxes"
import { users } from "./users"
import { workflowExecutions } from "./workflow-executions"

export const client = {
  auth: auth,
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
  tags: tags,
  users: users,
  regions: regions,
  taxes: taxes,
  invites: invites,
  products: products,
  productTypes: productTypes,
  stockLocations: stockLocations,
  workflowExecutions: workflowExecutions,
}
