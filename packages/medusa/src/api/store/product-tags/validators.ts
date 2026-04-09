import { z } from "@medusajs/framework/zod"
import { applyAndAndOrOperators } from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type StoreProductTagParamsType = z.infer<typeof StoreProductTagParams>

export const StoreProductTagParams = createSelectParams().merge(z.object({}))

export const StoreProductTagsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  value: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type StoreProductTagsParamsType = z.infer<typeof StoreProductTagsParams>
export const StoreProductTagsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(StoreProductTagsParamsFields)
  .merge(applyAndAndOrOperators(StoreProductTagsParamsFields))
