import { createFindParams, createSelectParams } from "../../utils/validators"
import { z } from "zod"

export type StoreGetRegionParamsType = z.infer<typeof StoreGetRegionParams>
export const StoreGetRegionParams = createSelectParams()

export type StoreGetRegionsParamsType = z.infer<typeof StoreGetRegionsParams>
export const StoreGetRegionsParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    code: z.union([z.string(), z.array(z.string())]).optional(),
    name: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => StoreGetRegionsParams.array()).optional(),
    $or: z.lazy(() => StoreGetRegionsParams.array()).optional(),
  })
)
