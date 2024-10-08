import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetProductTagParamsType = z.infer<
  typeof AdminGetProductTagParams
>
export const AdminGetProductTagParams = createSelectParams()

export type AdminGetProductTagsParamsType = z.infer<
  typeof AdminGetProductTagsParams
>
export const AdminGetProductTagsParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    value: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetProductTagsParams.array()).optional(),
    $or: z.lazy(() => AdminGetProductTagsParams.array()).optional(),
  })
)

export type AdminCreateProductTagType = z.infer<typeof AdminCreateProductTag>
export const AdminCreateProductTag = z
  .object({
    value: z.string(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateProductTagType = z.infer<typeof AdminUpdateProductTag>
export const AdminUpdateProductTag = z
  .object({
    value: z.string().optional(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()
