import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export const StoreGetCurrencyParams = createSelectParams()

export const StoreGetCurrenciesParamsFields = z.object({
  q: z.string().optional(),
  code: z.union([z.string(), z.array(z.string())]).optional(),
})

export type StoreGetCurrenciesParamsType = z.infer<
  typeof StoreGetCurrenciesParams
>
export const StoreGetCurrenciesParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(StoreGetCurrenciesParamsFields)
  .merge(applyAndAndOrOperators(StoreGetCurrenciesParamsFields))
