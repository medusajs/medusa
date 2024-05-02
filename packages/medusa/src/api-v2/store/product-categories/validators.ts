import { z } from "zod"
import { optionalBooleanMapper } from "../../../utils/validators/is-boolean"
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
    include_ancestors_tree: z.preprocess(
      (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
      z.boolean().optional()
    ),
    include_descendants_tree: z.preprocess(
      (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
      z.boolean().optional()
    ),
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
    include_ancestors_tree: z.preprocess(
      (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
      z.boolean().optional()
    ),
    include_descendants_tree: z.preprocess(
      (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
      z.boolean().optional()
    ),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => StoreProductCategoriesParams.array()).optional(),
    $or: z.lazy(() => StoreProductCategoriesParams.array()).optional(),
  })
)
