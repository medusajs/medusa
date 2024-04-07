import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export const AdminCustomerParams = createSelectParams()
export const AdminCustomerGroupParams = createSelectParams()

export const AdminCustomerGroupInCustomerParams = z.object({
  id: z.union([z.string(), z.array(z.string())]),
  name: z.union([z.string(), z.array(z.string())]),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export const AdminCustomersParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string(),
    id: z.union([z.string(), z.array(z.string())]),
    email: z.union([z.string(), z.array(z.string())]),
    groups: z.union([
      AdminCustomerGroupInCustomerParams,
      z.string(),
      z.array(z.string()),
    ]),
    company_name: z.union([z.string(), z.array(z.string())]),
    first_name: z.union([z.string(), z.array(z.string())]),
    last_name: z.union([z.string(), z.array(z.string())]),
    created_by: z.union([z.string(), z.array(z.string())]),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminCustomersParams.array()).optional(),
    $or: z.lazy(() => AdminCustomersParams.array()).optional(),
  })
)

export const AdminCreateCustomer = z.object({
  company_name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
})

export const AdminUpdateCustomer = AdminCreateCustomer

export const AdminCreateCustomerAddress = z.object({
  address_name: z.string(),
  is_default_shipping: z.boolean(),
  is_default_billing: z.boolean(),
  company: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  address_1: z.string(),
  address_2: z.string(),
  city: z.string(),
  country_code: z.string(),
  province: z.string(),
  postal_code: z.string(),
  phone: z.string(),
  metadata: z.record(z.unknown()),
})

export const AdminUpdateCustomerAddress = AdminCreateCustomerAddress

export const AdminCustomerAdressesParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    address_name: z.union([z.string(), z.array(z.string())]),
    is_default_shipping: z.boolean(),
    is_default_billing: z.boolean(),
    company: z.union([z.string(), z.array(z.string())]),
    first_name: z.union([z.string(), z.array(z.string())]),
    last_name: z.union([z.string(), z.array(z.string())]),
    address_1: z.union([z.string(), z.array(z.string())]),
    address_2: z.union([z.string(), z.array(z.string())]),
    city: z.union([z.string(), z.array(z.string())]),
    country_code: z.union([z.string(), z.array(z.string())]),
    province: z.union([z.string(), z.array(z.string())]),
    postal_code: z.union([z.string(), z.array(z.string())]),
    phone: z.union([z.string(), z.array(z.string())]),
    metadata: z.record(z.unknown()),
  })
)

export type AdminCustomerParamsType = z.infer<typeof AdminCustomerParams>
export type AdminCustomerGroupParamsType = z.infer<
  typeof AdminCustomerGroupParams
>
export type AdminCustomerGroupInCustomerParamsType = z.infer<
  typeof AdminCustomerGroupInCustomerParams
>
export type AdminCustomersParamsType = z.infer<typeof AdminCustomersParams>
export type AdminCreateCustomerType = z.infer<typeof AdminCreateCustomer>
export type AdminUpdateCustomerType = z.infer<typeof AdminUpdateCustomer>
export type AdminCreateCustomerAddressType = z.infer<
  typeof AdminCreateCustomerAddress
>
