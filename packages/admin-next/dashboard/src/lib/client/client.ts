import { apiKeys } from "./api-keys"
import { auth } from "./auth"
import { currencies } from "./currencies"
import { customers } from "./customers"
import { promotions } from "./promotions"
import { regions } from "./regions"
import { salesChannels } from "./sales-channels"
import { stores } from "./stores"
import { users } from "./users"

export const client = {
  auth: auth,
  apiKeys: apiKeys,
  customers: customers,
  currencies: currencies,
  promotions: promotions,
  stores: stores,
  salesChannels: salesChannels,
  users: users,
  regions: regions,
}
