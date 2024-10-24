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

export type AdminProductCategoryParamsType = z.infer<
  typeof AdminProductCategoryParams
>
export const AdminProductCategoryParams = createSelectParams().merge(
  z.object({
    include_ancestors_tree: booleanString().optional(),
    include_descendants_tree: booleanString().optional(),
  })
)

export const AdminProductCategoriesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  description: z.union([z.string(), z.array(z.string())]).optional(),
  handle: z.union([z.string(), z.array(z.string())]).optional(),
  parent_category_id: z.union([z.string(), z.array(z.string())]).optional(),
  include_ancestors_tree: booleanString().optional(),
  include_descendants_tree: booleanString().optional(),
  is_internal: booleanString().optional(),
  is_active: booleanString().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminProductCategoriesParamsType = z.infer<
  typeof AdminProductCategoriesParams
>
export const AdminProductCategoriesParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(AdminProductCategoriesParamsFields)
  .merge(applyAndAndOrOperators(AdminProductCategoriesParamsFields))

export const AdminCreateProductCategory = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    handle: z.string().optional(),
    is_internal: z.boolean().optional(),
    is_active: z.boolean().optional(),
    parent_category_id: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
    rank: z.number().nonnegative().optional(),
  })
  .strict()

export type AdminCreateProductCategoryType = z.infer<
  typeof AdminCreateProductCategory
>

export const AdminUpdateProductCategory = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    handle: z.string().optional(),
    is_internal: z.boolean().optional(),
    is_active: z.boolean().optional(),
    parent_category_id: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
    rank: z.number().nonnegative().optional(),
  })
  .strict()

export type AdminUpdateProductCategoryType = z.infer<
  typeof AdminUpdateProductCategory
>
