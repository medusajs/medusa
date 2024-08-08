import { z, ZodObject } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
  WithAdditionalData,
} from "../../utils/validators"

export const AdminCustomerParams = createSelectParams()

export const AdminCustomerGroupInCustomerParams = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export const AdminCustomersParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    email: z.union([z.string(), z.array(z.string())]).optional(),
    groups: z
      .union([
        AdminCustomerGroupInCustomerParams,
        z.string(),
        z.array(z.string()),
      ])
      .optional(),
    company_name: z.union([z.string(), z.array(z.string())]).optional(),
    first_name: z.union([z.string(), z.array(z.string())]).optional(),
    last_name: z.union([z.string(), z.array(z.string())]).optional(),
    created_by: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminCustomersParams.array()).optional(),
    $or: z.lazy(() => AdminCustomersParams.array()).optional(),
  })
)

export const CreateCustomer = z.object({
  email: z.string().email().nullish(),
  company_name: z.string().nullish(),
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  phone: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish(),
})
export const AdminCreateCustomer = WithAdditionalData(CreateCustomer)

export const UpdateCustomer = z.object({
  email: z.string().email().nullish(),
  company_name: z.string().nullish(),
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  phone: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish(),
})
export const AdminUpdateCustomer = WithAdditionalData(UpdateCustomer)

export const CreateCustomerAddress = z.object({
  address_name: z.string().nullish(),
  is_default_shipping: z.boolean().optional(),
  is_default_billing: z.boolean().optional(),
  company: z.string().nullish(),
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  address_1: z.string().nullish(),
  address_2: z.string().nullish(),
  city: z.string().nullish(),
  country_code: z.string().nullish(),
  province: z.string().nullish(),
  postal_code: z.string().nullish(),
  phone: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish(),
})
export const AdminCreateCustomerAddress = WithAdditionalData(
  CreateCustomerAddress
)

export const AdminUpdateCustomerAddress = AdminCreateCustomerAddress

export const AdminCustomerAddressesParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    company: z.union([z.string(), z.array(z.string())]).optional(),
    city: z.union([z.string(), z.array(z.string())]).optional(),
    country_code: z.union([z.string(), z.array(z.string())]).optional(),
    province: z.union([z.string(), z.array(z.string())]).optional(),
    postal_code: z.union([z.string(), z.array(z.string())]).optional(),
  })
)

export type AdminCustomerParamsType = z.infer<typeof AdminCustomerParams>
export type AdminCustomersParamsType = z.infer<typeof AdminCustomersParams>
export type AdminCreateCustomerType = z.infer<typeof CreateCustomer>
export type AdminUpdateCustomerType = z.infer<typeof UpdateCustomer>
export type AdminCreateCustomerAddressType = z.infer<
  typeof CreateCustomerAddress
>
