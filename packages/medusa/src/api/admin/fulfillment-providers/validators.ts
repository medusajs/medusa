import { z } from "zod"
import { OptionalBooleanValidator } from "../../utils/common-validators"
import { createFindParams } from "../../utils/validators"

export type AdminFulfillmentProvidersParamsType = z.infer<
  typeof AdminFulfillmentProvidersParams
>
export const AdminFulfillmentProvidersParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .merge(
    z.object({
      id: z.union([z.string(), z.array(z.string())]).optional(),
      stock_location_id: z.union([z.string(), z.array(z.string())]).optional(),
      is_enabled: OptionalBooleanValidator,
      q: z.string().optional(),
    })
  )
  .strict()
