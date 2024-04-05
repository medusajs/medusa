/**
 * Temporary types for API payloads until we export them from `@medusajs/types`
 */

import {
  CreateApiKeyDTO,
  CreateCustomerDTO,
  CreateInviteDTO,
  CreateRegionDTO,
  CreateSalesChannelDTO,
  CreateStockLocationInput,
  UpdateApiKeyDTO,
  UpdateCustomerDTO,
  UpdateRegionDTO,
  UpdateSalesChannelDTO,
  UpdateStockLocationInput,
  UpdateStoreDTO,
  UpdateUserDTO,
} from "@medusajs/types"

// Auth
export type EmailPassReq = { email: string; password: string }

// Regions
export type CreateRegionReq = CreateRegionDTO
export type UpdateRegionReq = UpdateRegionDTO

// Stores
export type UpdateStoreReq = UpdateStoreDTO

// API Keys
export type CreateApiKeyReq = CreateApiKeyDTO
export type UpdateApiKeyReq = UpdateApiKeyDTO

// Customers
export type CreateCustomerReq = CreateCustomerDTO
export type UpdateCustomerReq = UpdateCustomerDTO

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
