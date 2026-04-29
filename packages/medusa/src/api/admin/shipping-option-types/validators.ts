import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export type AdminGetShippingOptionTypeParamsType = z.infer<
  typeof AdminGetShippingOptionTypeParams
>
export const AdminGetShippingOptionTypeParams = createSelectParams()

export const AdminGetShippingOptionTypesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  label: z.union([z.string(), z.array(z.string())]).optional(),
  code: z.union([z.string(), z.array(z.string())]).optional(),
  description: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetShippingOptionTypesParamsType = z.infer<
  typeof AdminGetShippingOptionTypesParams
>
export const AdminGetShippingOptionTypesParams = createFindParams({
  limit: 10,
  offset: 0,
})
  .merge(AdminGetShippingOptionTypesParamsFields)
  .merge(applyAndAndOrOperators(AdminGetShippingOptionTypesParamsFields))

export type AdminCreateShippingOptionTypeType = z.infer<
  typeof AdminCreateShippingOptionType
>
export const AdminCreateShippingOptionType = z
  .object({
    label: z.string(),
    code: z.string(),
    description: z.string().optional(),
  })
  .strict()

export type AdminUpdateShippingOptionTypeType = z.infer<
  typeof AdminUpdateShippingOptionType
>
export const AdminUpdateShippingOptionType = z
  .object({
    label: z.string().optional(),
    code: z.string().optional(),
    description: z.string().optional(),
  })
  .strict()
