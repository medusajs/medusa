import { z } from "zod"
import { createFindParams } from "../../utils/validators"

export type StoreGetShippingOptionsType = z.infer<
  typeof StoreGetShippingOptions
>
export const StoreGetShippingOptions = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    cart_id: z.string(),
    $and: z.lazy(() => StoreGetShippingOptions.array()).optional(),
    $or: z.lazy(() => StoreGetShippingOptions.array()).optional(),
  })
)
