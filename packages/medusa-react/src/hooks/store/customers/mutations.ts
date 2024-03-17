import {
  StoreCustomersRes,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
} from "@medusajs/medusa"
import { UseMutationOptions, useMutation } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"

/**
 * This hook registers a new customer. This will also automatically authenticate the customer and set their login session in the response Cookie header.
 * Subsequent requests sent with other hooks are sent with the Cookie session automatically.
 *
 * @example
 * import React from "react"
 * import { useCreateCustomer } from "medusa-react"
 *
 * const RegisterCustomer = () => {
 *   const createCustomer = useCreateCustomer()
 *   // ...
 *
 *   const handleCreate = (
 *     customerData: {
 *       first_name: string
 *       last_name: string
 *       email: string
 *       password: string
 *     }
 *   ) => {
 *     // ...
 *     createCustomer.mutate(customerData, {
 *       onSuccess: ({ customer }) => {
 *         console.log(customer.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default RegisterCustomer
 *
 * @customNamespace Hooks.Store.Customers
 * @category Mutations
 */
export const useCreateCustomer = (
  options?: UseMutationOptions<StoreCustomersRes, Error, StorePostCustomersReq>
) => {
  const { client } = useMedusa()
  return useMutation({
    mutationFn: (data: StorePostCustomersReq) => client.customers.create(data),
    ...options,
  })
}

export type UpdateMeReq = StorePostCustomersCustomerReq & {
  /**
   * The customer's ID.
   */
  id: string
}

/**
 * This hook updates the logged-in customer's details. This hook requires [customer authentication](https://docs.medusajs.com/medusa-react/overview#customer-authentication).
 *
 * @example
 * import React from "react"
 * import { useUpdateMe } from "medusa-react"
 *
 * type Props = {
 *   customerId: string
 * }
 *
 * const Customer = ({ customerId }: Props) => {
 *   const updateCustomer = useUpdateMe()
 *   // ...
 *
 *   const handleUpdate = (
 *     firstName: string
 *   ) => {
 *     // ...
 *     updateCustomer.mutate({
 *       id: customerId,
 *       first_name: firstName,
 *     }, {
 *       onSuccess: ({ customer }) => {
 *         console.log(customer.first_name)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Customer
 *
 * @customNamespace Hooks.Store.Customers
 * @category Mutations
 */
export const useUpdateMe = (
  options?: UseMutationOptions<StoreCustomersRes, Error, UpdateMeReq>
) => {
  const { client } = useMedusa()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateMeReq) => client.customers.update(data),
    ...options,
  })
}
