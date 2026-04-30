import { z } from "@medusajs/framework/zod"
import {
  applyAndAndOrOperators,
  booleanString,
} from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type StoreProductOptionParamsType = z.infer<
  typeof StoreProductOptionParams
>

export const StoreProductOptionParams = createSelectParams().merge(z.object({}))

export const StoreProductOptionsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  title: z.union([z.string(), z.array(z.string())]).optional(),
  is_exclusive: booleanString().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type StoreProductOptionsParamsType = z.infer<
  typeof StoreProductOptionsParams
>

export const StoreProductOptionsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(StoreProductOptionsParamsFields)
  .merge(applyAndAndOrOperators(StoreProductOptionsParamsFields))
