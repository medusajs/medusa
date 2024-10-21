import { z } from "zod"
import {
  applyAndAndOrOperators,
  booleanString,
} from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type StoreProductCategoryParamsType = z.infer<
  typeof StoreProductCategoryParams
>
export const StoreProductCategoryParams = createSelectParams().merge(
  z.object({
    include_ancestors_tree: booleanString().optional(),
    include_descendants_tree: booleanString().optional(),
  })
)

export const StoreProductCategoriesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
  description: z.union([z.string(), z.array(z.string())]).optional(),
  handle: z.union([z.string(), z.array(z.string())]).optional(),
  parent_category_id: z.union([z.string(), z.array(z.string())]).optional(),
  include_ancestors_tree: booleanString().optional(),
  include_descendants_tree: booleanString().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type StoreProductCategoriesParamsType = z.infer<
  typeof StoreProductCategoriesParams
>
export const StoreProductCategoriesParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(StoreProductCategoriesParamsFields)
  .merge(applyAndAndOrOperators(StoreProductCategoriesParamsFields))
