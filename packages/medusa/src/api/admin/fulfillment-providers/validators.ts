import { z } from "zod"
import { OptionalBooleanValidator } from "../../utils/common-validators"
import { createFindParams } from "../../utils/validators"

export type AdminGetFulfillmentProvidersParamsType = z.infer<
  typeof AdminGetFulfillmentProvidersParams
>
export const AdminGetFulfillmentProvidersParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    is_enabled: OptionalBooleanValidator,
    $and: z.lazy(() => AdminGetFulfillmentProvidersParams.array()).optional(),
    $or: z.lazy(() => AdminGetFulfillmentProvidersParams.array()).optional(),
  })
)
