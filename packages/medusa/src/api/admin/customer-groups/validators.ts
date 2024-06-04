import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetCustomerGroupParamsType = z.infer<
  typeof AdminGetCustomerGroupParams
>
export const AdminGetCustomerGroupParams = createSelectParams()

export const AdminCustomerInGroupFilters = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  email: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  default_billing_address_id: z
    .union([z.string(), z.array(z.string())])
    .optional(),
  default_shipping_address_id: z
    .union([z.string(), z.array(z.string())])
    .optional(),
  company_name: z.union([z.string(), z.array(z.string())]).optional(),
  first_name: z.union([z.string(), z.array(z.string())]).optional(),
  last_name: z.union([z.string(), z.array(z.string())]).optional(),
  created_by: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetCustomerGroupsParamsType = z.infer<
  typeof AdminGetCustomerGroupsParams
>
export const AdminGetCustomerGroupsParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    name: z.union([z.string(), z.array(z.string())]).optional(),
    customers: z
      .union([z.string(), z.array(z.string()), AdminCustomerInGroupFilters])
      .optional(),
    created_by: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetCustomerGroupsParams.array()).optional(),
    $or: z.lazy(() => AdminGetCustomerGroupsParams.array()).optional(),
  })
)

export type AdminCreateCustomerGroupType = z.infer<
  typeof AdminCreateCustomerGroup
>
export const AdminCreateCustomerGroup = z.object({
  name: z.string(),
  metadata: z.record(z.any()).optional(),
})

export type AdminUpdateCustomerGroupType = z.infer<
  typeof AdminUpdateCustomerGroup
>
export const AdminUpdateCustomerGroup = z.object({
  name: z.string(),
  metadata: z.record(z.any()).optional(),
})
