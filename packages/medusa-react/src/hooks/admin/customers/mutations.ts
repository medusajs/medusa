import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import { AdminCustomersRes, AdminPostCustomersReq } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminCustomerKeys } from "./queries"

export const useAdminCreateCustomer = (
  options?: UseMutationOptions<
    Response<AdminCustomersRes>,
    Error,
    AdminPostCustomersReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostCustomersReq) => client.admin.customers.create(payload),
    buildOptions(queryClient, adminCustomerKeys.lists(), options)
  )
}

export const useAdminUpdateCustomer = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomersRes>,
    Error,
    AdminPostCustomersReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostCustomersReq) =>
      client.admin.customers.update(id, payload),
    buildOptions(
      queryClient,
      [adminCustomerKeys.lists(), adminCustomerKeys.detail(id)],
      options
    )
  )
}
