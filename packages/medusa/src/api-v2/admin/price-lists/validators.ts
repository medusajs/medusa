import { PriceListStatus, PriceListType } from "@medusajs/types"
import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export const AdminGetPriceListPricesParams = createSelectParams()
export const AdminGetPriceListsParams = createFindParams({
  offset: 0,
  limit: 50,
})

export const AdminGetPriceListParams = createFindParams({
  offset: 0,
  limit: 50,
})

export const AdminCreatePriceListPrice = z.object({
  currency_code: z.string(),
  amount: z.number(),
  variant_id: z.string(),
  min_quantity: z.number().optional(),
  max_quantity: z.number().optional(),
  rules: z.record(z.string(), z.string()).optional(),
})

export type AdminCreatePriceListPriceType = z.infer<
  typeof AdminCreatePriceListPrice
>

export const AdminUpdatePriceListPrice = z.object({
  id: z.string(),
  currency_code: z.string().optional(),
  amount: z.number().optional(),
  variant_id: z.string(),
  min_quantity: z.number().optional(),
  max_quantity: z.number().optional(),
  rules: z.record(z.string(), z.string()).optional(),
})

export type AdminUpdatePriceListPriceType = z.infer<
  typeof AdminUpdatePriceListPrice
>

export const AdminBatchPriceListPrices = z.object({
  create: z.array(AdminCreatePriceListPrice).optional(),
  update: z.array(AdminUpdatePriceListPrice).optional(),
  delete: z.array(z.string()).optional(),
  product_id: z.array(z.string()).optional(),
})

export type AdminBatchPriceListPricesType = z.infer<
  typeof AdminBatchPriceListPrices
>

export const AdminCreatePriceList = z.object({
  title: z.string(),
  description: z.string(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  status: z.nativeEnum(PriceListStatus).optional(),
  type: z.nativeEnum(PriceListType).optional(),
  rules: z.record(z.string(), z.array(z.string())).optional(),
  prices: z.array(AdminCreatePriceListPrice).optional(),
})

export type AdminCreatePriceListType = z.infer<typeof AdminCreatePriceList>

export const AdminUpdatePriceList = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  status: z.nativeEnum(PriceListStatus).optional(),
  type: z.nativeEnum(PriceListType).optional(),
  rules: z.record(z.string(), z.array(z.string())).optional(),
})

export type AdminUpdatePriceListType = z.infer<typeof AdminUpdatePriceList>
