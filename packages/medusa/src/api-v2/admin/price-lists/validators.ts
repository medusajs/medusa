import { PriceListStatus, PriceListType } from "@medusajs/types"
import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export const AdminGetPriceListPricesParams = createSelectParams()
export const AdminGetPriceListsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    starts_at: createOperatorMap().optional(),
    ends_at: createOperatorMap().optional(),
    status: z.array(z.nativeEnum(PriceListStatus)).optional(),
    rules_count: z.array(z.number()).optional(),
    $and: z.lazy(() => AdminGetPriceListsParams.array()).optional(),
    $or: z.lazy(() => AdminGetPriceListsParams.array()).optional(),
  })
)

export const AdminGetPriceListParams = createSelectParams()

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

export const AdminCreatePriceList = z.object({
  title: z.string(),
  description: z.string(),
  starts_at: z.union([z.string(), z.null()]).optional(),
  ends_at: z.union([z.string(), z.null()]).optional(),
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
