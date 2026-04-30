import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import {
  applyAndAndOrOperators,
  booleanString,
} from "../../utils/common-validators"

export type AdminGetProductOptionParamsType = z.infer<
  typeof AdminGetProductOptionParams
>
export const AdminGetProductOptionParams = createSelectParams()

export const AdminGetProductOptionsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  title: z.union([z.string(), z.array(z.string())]).optional(),
  is_exclusive: booleanString().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export const AdminGetProductOptionsParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(AdminGetProductOptionsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetProductOptionsParamsFields))

export const AdminCreateProductOption = z
  .object({
    title: z.string(),
    values: z.array(z.string()),
    ranks: z.record(z.string(), z.number()).optional(),
    is_exclusive: z.boolean().optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateProductOptionType = z.infer<
  typeof AdminUpdateProductOption
>
export const AdminUpdateProductOption = z
  .object({
    title: z.string().optional(),
    values: z.array(z.string()).optional(),
    ranks: z.record(z.string(), z.number()).optional(),
    is_exclusive: z.boolean().optional(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()
