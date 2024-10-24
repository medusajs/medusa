import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export type AdminGetProductTypeParamsType = z.infer<
  typeof AdminGetProductTypeParams
>
export const AdminGetProductTypeParams = createSelectParams()

export const AdminGetProductTypesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  value: z.union([z.string(), z.array(z.string())]).optional(),
  // TODO: To be added in next iteration, when coming from a different module, it should be separated from the direct fields
  // discount_condition_id: z.string().nullish(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetProductTypesParamsType = z.infer<
  typeof AdminGetProductTypesParams
>
export const AdminGetProductTypesParams = createFindParams({
  limit: 10,
  offset: 0,
})
  .merge(AdminGetProductTypesParamsFields)
  .merge(applyAndAndOrOperators(AdminGetProductTypesParamsFields))

export type AdminCreateProductTypeType = z.infer<typeof AdminCreateProductType>
export const AdminCreateProductType = z
  .object({
    value: z.string(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateProductTypeType = z.infer<typeof AdminUpdateProductType>
export const AdminUpdateProductType = z
  .object({
    value: z.string().optional(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()
