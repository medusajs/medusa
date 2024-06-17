import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetStockLocationParamsType = z.infer<
  typeof AdminGetStockLocationParams
>
export const AdminGetStockLocationParams = createSelectParams()

export type AdminGetStockLocationsParamsType = z.infer<
  typeof AdminGetStockLocationsParams
>
export const AdminGetStockLocationsParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    name: z.union([z.string(), z.array(z.string())]).optional(),
    address_id: z.union([z.string(), z.array(z.string())]).optional(),
    sales_channel_id: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetStockLocationsParams.array()).optional(),
    $or: z.lazy(() => AdminGetStockLocationsParams.array()).optional(),
  })
)

export type AdminUpsertStockLocationAddressType = z.infer<
  typeof AdminUpsertStockLocationAddress
>
export const AdminUpsertStockLocationAddress = z.object({
  address_1: z.string(),
  address_2: z.string().optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  country_code: z.string(),
  phone: z.string().optional(),
  postal_code: z.string().optional(),
  province: z.string().optional(),
})

export type AdminCreateStockLocationType = z.infer<
  typeof AdminCreateStockLocation
>
export const AdminCreateStockLocation = z.object({
  name: z.preprocess((val: any) => val.trim(), z.string()),
  address: AdminUpsertStockLocationAddress.optional(),
  address_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminUpdateStockLocationType = z.infer<
  typeof AdminUpdateStockLocation
>
export const AdminUpdateStockLocation = z.object({
  name: z
    .preprocess((val: any) => val.trim(), z.string().optional())
    .optional(),
  address: AdminUpsertStockLocationAddress.optional(),
  address_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminCreateStockLocationFulfillmentSetType = z.infer<
  typeof AdminCreateStockLocationFulfillmentSet
>
export const AdminCreateStockLocationFulfillmentSet = z
  .object({
    name: z.string(),
    type: z.string(),
  })
  .strict()
