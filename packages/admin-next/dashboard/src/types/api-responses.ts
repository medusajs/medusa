/**
 * Temporary types for API responses until we export them from `@medusajs/types`
 */

import {
  ApiKeyDTO,
  CurrencyDTO,
  CustomerDTO,
  InviteDTO,
  ProductCategoryDTO,
  ProductCollectionDTO,
  ProductDTO,
  ProductTypeDTO,
  ProductVariantDTO,
  PromotionDTO,
  RegionDTO,
  SalesChannelDTO,
  StockLocationAddressDTO,
  StockLocationDTO,
  StoreDTO,
  UserDTO,
} from "@medusajs/types"
import { WorkflowExecutionDTO } from "../v2-routes/workflow-executions/types"

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
export type UserDeleteRes = DeleteRes

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
export type ExtendedApiKeyDTO = ApiKeyDTO & {
  sales_channels: SalesChannelDTO[] | null
}
export type ApiKeyRes = { apiKey: ExtendedApiKeyDTO }
export type ApiKeyListRes = { apiKeys: ExtendedApiKeyDTO[] } & ListRes
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

// Invites
export type InviteRes = { invite: InviteDTO }
export type InviteListRes = { invites: InviteDTO[] } & ListRes
export type InviteDeleteRes = DeleteRes

// Products
export type ExtendedProductDTO = ProductDTO & {
  variants: ProductVariantDTO[] | null
  sales_channels: SalesChannelDTO[] | null
  collections: ProductCollectionDTO[] | null
  categories: ProductCategoryDTO[] | null
}
export type ProductRes = { product: ExtendedProductDTO }
export type ProductListRes = { products: ExtendedProductDTO[] } & ListRes
export type ProductDeleteRes = DeleteRes

// Product Types
export type ProductTypeRes = { product_type: ProductTypeDTO }
export type ProductTypeListRes = { product_types: ProductTypeDTO[] } & ListRes

// Stock Locations
export type ExtendedStockLocationDTO = StockLocationDTO & {
  address: StockLocationAddressDTO | null
  sales_channels: SalesChannelDTO[] | null
}
export type StockLocationRes = { stock_location: ExtendedStockLocationDTO }
export type StockLocationListRes = {
  stock_locations: ExtendedStockLocationDTO[]
} & ListRes
export type StockLocationDeleteRes = DeleteRes

// Worfklow Executions
export type WorkflowExecutionRes = { workflow_execution: WorkflowExecutionDTO }
export type WorkflowExecutionListRes = {
  workflow_executions: WorkflowExecutionDTO[]
} & ListRes

// Product Collections
export type ProductCollectionRes = { collection: ProductCollectionDTO }
export type ProductCollectionListRes = {
  collections: ProductCollectionDTO[]
} & ListRes
export type ProductCollectionDeleteRes = DeleteRes
