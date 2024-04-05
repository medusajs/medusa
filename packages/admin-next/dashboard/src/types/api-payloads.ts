/**
 * Temporary types for API payloads until we export them from `@medusajs/types`
 */

import {
  CreateApiKeyDTO,
  CreateCustomerDTO,
  CreateRegionDTO,
  CreateSalesChannelDTO,
  UpdateApiKeyDTO,
  UpdateCustomerDTO,
  UpdateRegionDTO,
  UpdateSalesChannelDTO,
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

// Users
export type UpdateUserReq = Omit<UpdateUserDTO, "id">
