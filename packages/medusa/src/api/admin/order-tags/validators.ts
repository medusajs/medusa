import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export type AdminGetOrderTagParamsType = z.infer<typeof AdminGetOrderTagParams>
export const AdminGetOrderTagParams = createSelectParams()

export const AdminGetOrderTagsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  value: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetOrderTagsParamsType = z.infer<
  typeof AdminGetOrderTagsParams
>
export const AdminGetOrderTagsParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(AdminGetOrderTagsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetOrderTagsParamsFields))

export type AdminCreateOrderTagType = z.infer<typeof AdminCreateOrderTag>
export const AdminCreateOrderTag = z
  .object({
    value: z.string(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateOrderTagType = z.infer<typeof AdminUpdateOrderTag>
export const AdminUpdateOrderTag = z
  .object({
    value: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()
