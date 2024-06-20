import { z } from "zod"
import { OptionalBooleanValidator } from "../../utils/common-validators"
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
    include_ancestors_tree: OptionalBooleanValidator,
    include_descendants_tree: OptionalBooleanValidator,
  })
)

export type StoreProductCategoriesParamsType = z.infer<
  typeof StoreProductCategoriesParams
>
export const StoreProductCategoriesParams = createFindParams({
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
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => StoreProductCategoriesParams.array()).optional(),
    $or: z.lazy(() => StoreProductCategoriesParams.array()).optional(),
  })
)
