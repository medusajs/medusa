import { createFindParams, createSelectParams } from "../../utils/validators"
import { z } from "zod"

export type AdminGetStoreParamsType = z.infer<typeof AdminGetStoreParams>
export const AdminGetStoreParams = createSelectParams()

export type AdminGetStoresParamsType = z.infer<typeof AdminGetStoresParams>
export const AdminGetStoresParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    name: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => AdminGetStoresParams.array()).optional(),
    $or: z.lazy(() => AdminGetStoresParams.array()).optional(),
  })
)

export type AdminUpdateStoreType = z.infer<typeof AdminUpdateStore>
export const AdminUpdateStore = z.object({
  name: z.string().optional(),
  supported_currency_codes: z.array(z.string()).optional(),
  default_currency_code: z.string().optional(),
  default_sales_channel_id: z.string().optional(),
  default_region_id: z.string().optional(),
  default_location_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})
