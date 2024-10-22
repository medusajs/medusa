import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export const StoreGetOrderParams = createSelectParams()
export type StoreGetOrderParamsType = z.infer<typeof StoreGetOrderParams>

export const StoreGetOrdersParamsFields = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  status: z.union([z.string(), z.array(z.string())]).optional(),
})

export const StoreGetOrdersParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(StoreGetOrdersParamsFields)
  .merge(applyAndAndOrOperators(StoreGetOrdersParamsFields))

export type StoreGetOrdersParamsType = z.infer<typeof StoreGetOrdersParams>
