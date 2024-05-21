import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export const StoreGetOrderParams = createSelectParams()
export type StoreGetOrderParamsType = z.infer<typeof StoreGetOrderParams>

export const StoreGetOrdersParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => StoreGetOrdersParams.array()).optional(),
    $or: z.lazy(() => StoreGetOrdersParams.array()).optional(),
  })
)
export type StoreGetOrdersParamsType = z.infer<typeof StoreGetOrdersParams>
