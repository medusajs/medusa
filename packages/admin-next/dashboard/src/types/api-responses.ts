/**
 * Temporary types for API responses until we export them from `@medusajs/types`
 */

import {
  CampaignDTO,
  CurrencyDTO,
  InviteDTO,
  PaymentProviderDTO,
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
import { ProductTagDTO } from "@medusajs/types/dist/product"
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

// Promotions
export type PromotionRes = { promotion: PromotionDTO }
export type PromotionListRes = { promotions: PromotionDTO[] } & ListRes
export type PromotionRuleAttributesListRes = { attributes: Record<any, any>[] }
export type PromotionRuleOperatorsListRes = { operators: Record<any, any>[] }
export type PromotionRuleValuesListRes = { values: Record<any, any>[] }
export type PromotionRulesListRes = { rules: Record<any, any>[] }
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

// Campaigns
export type CampaignRes = { campaign: CampaignDTO }
export type CampaignListRes = { campaigns: CampaignDTO[] } & ListRes
export type CampaignDeleteRes = DeleteRes

// API Keys
export type ApiKeyDeleteRes = DeleteRes

// Sales Channels
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

// Categories
export type CategoryRes = { category: ProductCategoryDTO }
export type CategoriesListRes = { categories: ProductCategoryDTO[] } & ListRes

// Tags
export type TagRes = { tag: ProductTagDTO }
export type TagsListRes = { tags: ProductTagDTO[] } & ListRes

// Product Types
export type ProductTypeRes = { product_type: ProductTypeDTO }
export type ProductTypeListRes = { product_types: ProductTypeDTO[] } & ListRes

// Payments

export type PaymentProvidersListRes = {
  payment_providers: PaymentProviderDTO[]
}

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
