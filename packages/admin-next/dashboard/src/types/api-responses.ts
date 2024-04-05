/**
 * Temporary types for API responses until we export them from `@medusajs/types`
 */

import {
  ApiKeyDTO,
  CurrencyDTO,
  CustomerDTO,
  PromotionDTO,
  RegionDTO,
  SalesChannelDTO,
  StoreDTO,
  UserDTO,
} from "@medusajs/types"

type ListRes = {
  count: number
  offset: number
  limit: number
}

type DeleteRes = {
  id: string
  object: string
  deleted: true
}

// Auth
export type EmailPassRes = { token: string }

// Customers
export type CustomerRes = { customer: CustomerDTO }
export type CustomerListRes = { customers: CustomerDTO[] } & ListRes

// Promotions
export type PromotionRes = { promotion: PromotionDTO }
export type PromotionListRes = { promotions: PromotionDTO[] } & ListRes
export type PromotionDeleteRes = DeleteRes

// Users
export type UserRes = { user: UserDTO }
export type UserListRes = { users: UserDTO[] } & ListRes

// Stores
export type ExtendedStoreDTO = StoreDTO & {
  default_currency: CurrencyDTO | null
}

export type StoreRes = { store: ExtendedStoreDTO }
export type StoreListRes = { stores: ExtendedStoreDTO[] } & ListRes

// Regions
export type RegionRes = { region: RegionDTO }
export type RegionListRes = { regions: RegionDTO[] } & ListRes
export type RegionDeleteRes = DeleteRes

// API Keys
export type ApiKeyRes = { api_key: ApiKeyDTO }
export type ApiKeyListRes = { api_keys: ApiKeyDTO[] } & ListRes
export type ApiKeyDeleteRes = DeleteRes

// Sales Channels
export type SalesChannelRes = { sales_channel: SalesChannelDTO }
export type SalesChannelListRes = {
  sales_channels: SalesChannelDTO[]
} & ListRes
export type SalesChannelDeleteRes = DeleteRes

// Currencies
export type CurrencyRes = { currency: CurrencyDTO }
export type CurrencyListRes = { currencies: CurrencyDTO[] } & ListRes
