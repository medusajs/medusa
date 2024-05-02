import { createFindParams, createSelectParams } from "../../utils/validators"
import { z } from "zod"

export const AdminGetCurrencyParams = createSelectParams()

export type AdminGetCurrenciesParamsType = z.infer<
  typeof AdminGetCurrenciesParams
>
export const AdminGetCurrenciesParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    code: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => AdminGetCurrenciesParams.array()).optional(),
    $or: z.lazy(() => AdminGetCurrenciesParams.array()).optional(),
  })
)
