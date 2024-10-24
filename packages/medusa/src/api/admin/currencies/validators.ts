import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export const AdminGetCurrencyParams = createSelectParams()

export const AdminGetCurrenciesParamsFields = z.object({
  q: z.string().optional(),
  code: z.union([z.string(), z.array(z.string())]).optional(),
})

export type AdminGetCurrenciesParamsType = z.infer<
  typeof AdminGetCurrenciesParams
>
export const AdminGetCurrenciesParams = createFindParams({
  offset: 0,
  limit: 200,
})
  .merge(AdminGetCurrenciesParamsFields)
  .merge(applyAndAndOrOperators(AdminGetCurrenciesParamsFields))
