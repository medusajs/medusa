import { z } from "@medusajs/framework/zod"
import { applyAndAndOrOperators } from "../../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../../utils/validators"

export type AdminGetRbacPolicyParamsType = z.infer<
  typeof AdminGetRbacPolicyParams
>
export const AdminGetRbacPolicyParams = createSelectParams()

export const AdminGetRbacPoliciesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  key: z.union([z.string(), z.array(z.string())]).optional(),
  resource: z.union([z.string(), z.array(z.string())]).optional(),
  operation: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetRbacPoliciesParamsType = z.infer<
  typeof AdminGetRbacPoliciesParams
>
export const AdminGetRbacPoliciesParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .merge(AdminGetRbacPoliciesParamsFields)
  .merge(applyAndAndOrOperators(AdminGetRbacPoliciesParamsFields))

export type AdminCreateRbacPolicyType = z.infer<typeof AdminCreateRbacPolicy>
export const AdminCreateRbacPolicy = z
  .object({
    key: z.string(),
    resource: z.string(),
    operation: z.string(),
    name: z.string().nullish(),
    description: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateRbacPolicyType = z.infer<typeof AdminUpdateRbacPolicy>
export const AdminUpdateRbacPolicy = z
  .object({
    key: z.string().optional(),
    resource: z.string().optional(),
    operation: z.string().optional(),
    name: z.string().nullish(),
    description: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()
