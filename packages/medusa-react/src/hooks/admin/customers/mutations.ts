import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  AdminCustomersRes,
  AdminPostCustomersCustomerReq,
  AdminPostCustomersReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminCustomerKeys } from "./queries"

/**
 * This hook creates a customer as an admin.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateCustomer } from "medusa-react"
 *
 * type CustomerData = {
 *   first_name: string
 *   last_name: string
 *   email: string
 *   password: string
 * }
 *
 * const CreateCustomer = () => {
 *   const createCustomer = useAdminCreateCustomer()
 *   // ...
 *
 *   const handleCreate = (customerData: CustomerData) => {
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
 * export default CreateCustomer
 *
 * @customNamespace Hooks.Admin.Customers
 * @category Mutations
 */
export const useAdminCreateCustomer = (
  options?: UseMutationOptions<
    Response<AdminCustomersRes>,
    Error,
    AdminPostCustomersReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostCustomersReq) =>
      client.admin.customers.create(payload),
    ...buildOptions(queryClient, adminCustomerKeys.lists(), options),
  })
}

/**
 * This hook updates a customer's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateCustomer } from "medusa-react"
 *
 * type CustomerData = {
 *   first_name: string
 *   last_name: string
 *   email: string
 *   password: string
 * }
 *
 * type Props = {
 *   customerId: string
 * }
 *
 * const Customer = ({ customerId }: Props) => {
 *   const updateCustomer = useAdminUpdateCustomer(customerId)
 *   // ...
 *
 *   const handleUpdate = (customerData: CustomerData) => {
 *     updateCustomer.mutate(customerData)
 *   }
 *
 *   // ...
 * }
 *
 * export default Customer
 *
 * @customNamespace Hooks.Admin.Customers
 * @category Mutations
 */
export const useAdminUpdateCustomer = (
  /**
   * The customer's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomersRes>,
    Error,
    AdminPostCustomersCustomerReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostCustomersCustomerReq) =>
      client.admin.customers.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminCustomerKeys.lists(), adminCustomerKeys.detail(id)],
      options
    ),
  })
}
