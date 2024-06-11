/**
 * Temporary types for API responses until we export them from `@medusajs/types`
 */

import {
  CampaignDTO,
  CurrencyDTO,
  CustomerGroupDTO,
  FulfillmentDTO,
  FulfillmentProviderDTO,
  InventoryNext,
  InviteDTO,
  OrderDTO,
  PaymentProviderDTO,
  PriceListDTO,
  PromotionDTO,
  PromotionRuleDTO,
  SalesChannelDTO,
  ShippingOptionDTO,
  ShippingProfileDTO,
  StockLocationAddressDTO,
  StockLocationDTO,
  StoreDTO,
  UserDTO,
  HttpTypes,
} from "@medusajs/types"

import { WorkflowExecutionDTO } from "../routes/workflow-executions/types"

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
export type PromotionRulesListRes = { rules: PromotionRuleDTO[] }
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

// Fulfillments
export type FulfillmentRes = { fulfillment: FulfillmentDTO }
export type FulfillmentListRes = { fulfillments: FulfillmentDTO[] } & ListRes
export type FulfillmentDeleteRes = DeleteRes

// Reservations
export type ReservationRes = { reservation: InventoryNext.ReservationItemDTO }
export type ReservationListRes = {
  reservations: InventoryNext.ReservationItemDTO[]
} & ListRes
export type ReservationDeleteRes = DeleteRes

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

// Orders
export type OrderRes = { order: OrderDTO }
export type OrderListRes = { orders: OrderDTO[] } & ListRes

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
export type FulfillmentSetDeleteRes = DeleteRes
export type ServiceZoneDeleteRes = DeleteRes

// Fulfillment providers
export type FulfillmentProvidersListRes = {
  fulfillment_providers: FulfillmentProviderDTO
} & ListRes

// Shipping options
export type ShippingOptionRes = { shipping_option: ShippingOptionDTO }
export type ShippingOptionDeleteRes = DeleteRes
export type ShippingOptionListRes = {
  shipping_options: ShippingOptionDTO[]
} & ListRes

// Shipping profile
export type ShippingProfileRes = { shipping_profile: ShippingProfileDTO }
export type ShippingProfileListRes = {
  shipping_profiles: ShippingProfileDTO[]
} & ListRes
export type ShippingProfileDeleteRes = DeleteRes

// Workflow Executions
export type WorkflowExecutionRes = { workflow_execution: WorkflowExecutionDTO }
export type WorkflowExecutionListRes = {
  workflow_executions: WorkflowExecutionDTO[]
} & ListRes

// Taxes
export type TaxRegionDeleteRes = DeleteRes
export type TaxRateDeleteRes = DeleteRes

// Reservations
export type ReservationItemDeleteRes = DeleteRes

export type ReservationItemListRes = {
  reservations: InventoryNext.ReservationItemDTO[]
} & ListRes

export type ReservationItemRes = {
  reservation: InventoryNext.ReservationItemDTO
}
// Price Lists
export type PriceListRes = { price_list: PriceListDTO }
export type PriceListListRes = { price_lists: PriceListDTO[] } & ListRes
export type PriceListDeleteRes = DeleteRes

// Customer Groups
export type CustomerGroupRes = { customer_group: CustomerGroupDTO }
export type CustomerGroupListRes = {
  customer_groups: CustomerGroupDTO[]
} & ListRes
export type CustomerGroupDeleteRes = DeleteRes
