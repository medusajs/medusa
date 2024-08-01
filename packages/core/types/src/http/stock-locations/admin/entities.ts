import { AdminFulfillmentProvider } from "../../fulfillment-provider"
import { AdminFulfillmentSet } from "../../fulfillment-set"
import { AdminSalesChannel } from "../../sales-channel"

export interface AdminStockLocationAddress {
  id: string
  address_1: string
  address_2: string | null
  company: string | null
  country_code: string
  city: string | null
  phone: string | null
  postal_code: string | null
  province: string | null
}

export interface AdminStockLocation {
  id: string
  name: string
  address_id: string
  address?: AdminStockLocationAddress
  sales_channels?: AdminSalesChannel[]
  fulfillment_providers?: AdminFulfillmentProvider[]
  fulfillment_sets?: AdminFulfillmentSet[]
}
