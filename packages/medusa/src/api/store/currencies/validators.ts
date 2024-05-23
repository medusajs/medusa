import { createFindParams, createSelectParams } from "../../utils/validators"
import { z } from "zod"

export const StoreGetCurrencyParams = createSelectParams()

export type StoreGetCurrenciesParamsType = z.infer<
  typeof StoreGetCurrenciesParams
>
export const StoreGetCurrenciesParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    code: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => StoreGetCurrenciesParams.array()).optional(),
    $or: z.lazy(() => StoreGetCurrenciesParams.array()).optional(),
  })
)
