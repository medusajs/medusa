/**
 * Temporary types for API payloads until we export them from `@medusajs/types`
 */

import {
  CreateApiKeyDTO,
  CreateCampaignDTO,
  CreateFulfillmentSetDTO,
  CreateInviteDTO,
  CreatePriceListDTO,
  CreatePromotionDTO,
  CreatePromotionRuleDTO,
  CreateSalesChannelDTO,
  CreateServiceZoneDTO,
  CreateShippingOptionDTO,
  CreateShippingProfileDTO,
  CreateStockLocationInput,
  InventoryNext,
  UpdateApiKeyDTO,
  UpdateCampaignDTO,
  UpdatePriceListDTO,
  UpdatePromotionDTO,
  UpdatePromotionRuleDTO,
  UpdateSalesChannelDTO,
  UpdateServiceZoneDTO,
  UpdateShippingOptionDTO,
  UpdateStockLocationInput,
  UpdateStoreDTO,
  UpdateUserDTO,
} from "@medusajs/types"

// Auth
export type EmailPassReq = { email: string; password: string }

// Stores
export type UpdateStoreReq = UpdateStoreDTO

// API Keys
export type CreateApiKeyReq = CreateApiKeyDTO
export type UpdateApiKeyReq = UpdateApiKeyDTO

// Sales Channels
export type CreateSalesChannelReq = CreateSalesChannelDTO
export type UpdateSalesChannelReq = UpdateSalesChannelDTO
export type AddProductsSalesChannelReq = { product_ids: string[] }
export type RemoveProductsSalesChannelReq = { product_ids: string[] }

// Users
export type UpdateUserReq = Omit<UpdateUserDTO, "id">

// Invites
export type CreateInviteReq = CreateInviteDTO

// Stock Locations
export type CreateStockLocationReq = CreateStockLocationInput
export type UpdateStockLocationReq = UpdateStockLocationInput
export type UpdateStockLocationSalesChannelsReq = {
  add?: string[]
  remove?: string[]
}
export type CreateFulfillmentSetReq = CreateFulfillmentSetDTO
export type CreateServiceZoneReq = CreateServiceZoneDTO
export type UpdateServiceZoneReq =
  | UpdateServiceZoneDTO

  // Shipping Options
  | { region_id: string; amount: number }
export type CreateShippingOptionReq = CreateShippingOptionDTO & {
  /**
   * The shipping option pricing
   */
  prices: (
    | { currency_code: string; amount: number }
    | { region_id: string; amount: number }
  )[]
}
export type UpdateShippingOptionReq = UpdateShippingOptionDTO & {
  /**
   * The shipping option pricing
   */
  prices: (
    | { currency_code: string; amount: number; id?: string }
    | { region_id: string; amount: number; id?: string }
  )[]
}

// Shipping Profile
export type CreateShippingProfileReq = CreateShippingProfileDTO

// Price Lists
export type CreatePriceListReq = CreatePriceListDTO
export type UpdatePriceListReq = Omit<UpdatePriceListDTO, "id">
export type AddPriceListPricesReq = {
  prices: {
    currency_code: string
    amount: number
    variant_id: string
  }[]
}
export type DeletePriceListPricesReq = { ids: string[] }

// Promotion
export type CreatePromotionReq = CreatePromotionDTO
export type UpdatePromotionReq = Omit<UpdatePromotionDTO, "id">
export type BatchAddPromotionRulesReq = { rules: CreatePromotionRuleDTO[] }
export type BatchRemovePromotionRulesReq = { rule_ids: string[] }
export type BatchUpdatePromotionRulesReq = { rules: UpdatePromotionRuleDTO[] }

// Campaign
export type CreateCampaignReq = CreateCampaignDTO
export type UpdateCampaignReq = UpdateCampaignDTO

// Reservations
export type UpdateReservationReq = Omit<
  InventoryNext.UpdateReservationItemInput,
  "id"
>
export type CreateReservationReq = InventoryNext.CreateReservationItemInput
