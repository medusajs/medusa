import { z } from "zod"
import { optionalBooleanMapper } from "../../../utils/validators/is-boolean"
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
    include_ancestors_tree: z.preprocess(
      (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
      z.boolean().optional()
    ),
    include_descendants_tree: z.preprocess(
      (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
      z.boolean().optional()
    ),
    is_internal: z.preprocess(
      (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
      z.boolean().optional()
    ),
    is_active: z.preprocess(
      (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
      z.boolean().optional()
    ),
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
    description: z.string().optional(),
    handle: z.string().optional(),
    is_internal: z.boolean().optional(),
    is_active: z.boolean().optional(),
    parent_category_id: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
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
    parent_category_id: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
    rank: z.number().nonnegative().optional(),
  })
  .strict()

export type AdminUpdateProductCategoryType = z.infer<
  typeof AdminUpdateProductCategory
>
