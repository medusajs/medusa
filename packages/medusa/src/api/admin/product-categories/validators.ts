import { z } from "zod"
import { OptionalBooleanValidator } from "../../utils/common-validators"
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
    include_ancestors_tree: OptionalBooleanValidator,
    include_descendants_tree: OptionalBooleanValidator,
  })
)

export type AdminProductCategoriesParamsType = z.infer<
  typeof AdminProductCategoriesParams
>
export const AdminProductCategoriesParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    description: z.union([z.string(), z.array(z.string())]).optional(),
    handle: z.union([z.string(), z.array(z.string())]).optional(),
    parent_category_id: z.union([z.string(), z.array(z.string())]).optional(),
    include_ancestors_tree: OptionalBooleanValidator,
    include_descendants_tree: OptionalBooleanValidator,
    is_internal: OptionalBooleanValidator,
    is_active: OptionalBooleanValidator,
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminProductCategoriesParams.array()).optional(),
    $or: z.lazy(() => AdminProductCategoriesParams.array()).optional(),
  })
)

export const AdminCreateProductCategory = z
  .object({
    name: z.string(),
    description: z.string().nullish(),
    handle: z.string().nullish(),
    is_internal: z.boolean().nullish(),
    is_active: z.boolean().nullish(),
    parent_category_id: z.string().nullish(),
    metadata: z.record(z.unknown()).optional(),
    rank: z.number().nonnegative().nullish(),
  })
  .strict()

export type AdminCreateProductCategoryType = z.infer<
  typeof AdminCreateProductCategory
>

export const AdminUpdateProductCategory = z
  .object({
    name: z.string().nullish(),
    description: z.string().nullish(),
    handle: z.string().nullish(),
    is_internal: z.boolean().nullish(),
    is_active: z.boolean().nullish(),
    parent_category_id: z.string().nullable().nullish(),
    metadata: z.record(z.unknown()).optional(),
    rank: z.number().nonnegative().nullish(),
  })
  .strict()

export type AdminUpdateProductCategoryType = z.infer<
  typeof AdminUpdateProductCategory
>
