import { createFindParams, createSelectParams } from "../../utils/validators"
import { z } from "zod"
import { AddressPayload } from "../../utils/common-validators"

export const StoreGetCustomerParams = createSelectParams()

export const StoreCreateCustomer = z.object({
  email: z.string().email().optional(),
  company_name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
})

export const StoreUpdateCustomer = z.object({
  company_name: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
})

export const StoreGetCustomerAddressParams = createSelectParams()

export const StoreCreateCustomerAddress = AddressPayload.merge(
  z.object({
    address_name: z.string().optional(),
    is_default_shipping: z.boolean().optional(),
    is_default_billing: z.boolean().optional(),
  })
)

export const StoreUpdateCustomerAddress = StoreCreateCustomerAddress

export const StoreGetCustomerAddressesParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    city: z.union([z.string(), z.array(z.string())]).optional(),
    country_code: z.union([z.string(), z.array(z.string())]).optional(),
    postal_code: z.union([z.string(), z.array(z.string())]).optional(),
  })
)

export type StoreGetCustomerParamsType = z.infer<typeof StoreGetCustomerParams>
export type StoreCreateCustomerType = z.infer<typeof StoreCreateCustomer>
export type StoreUpdateCustomerType = z.infer<typeof StoreUpdateCustomer>
export type StoreGetCustomerAddressParamsType = z.infer<
  typeof StoreGetCustomerAddressParams
>
export type StoreGetCustomerAddressesParamsType = z.infer<
  typeof StoreCreateCustomerAddress
>
export type StoreCreateCustomerAddressType = z.infer<
  typeof StoreCreateCustomerAddress
>
export type StoreUpdateCustomerAddressType = z.infer<
  typeof StoreUpdateCustomerAddress
>
