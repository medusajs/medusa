import {
  AdminCustomerGroupsRes,
  AdminPostCustomerGroupsGroupReq,
  AdminPostCustomerGroupsReq,
} from "@medusajs/medusa"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminCustomerGroupKeys } from "./queries"

export const useAdminCreateCustomerGroup = (
  options?: UseMutationOptions<
    Response<AdminCustomerGroupsRes>,
    Error,
    AdminPostCustomerGroupsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostCustomerGroupsReq) =>
      client.admin.customerGroups.create(payload),
    buildOptions(queryClient, adminCustomerGroupKeys.lists(), options)
  )
}

export const useAdminUpdateCustomerGroup = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomerGroupsRes>,
    Error,
    AdminPostCustomerGroupsGroupReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostCustomerGroupsGroupReq) =>
      client.admin.customerGroups.update(id, payload),
    buildOptions(
      queryClient,
      [adminCustomerGroupKeys.lists(), adminCustomerGroupKeys.detail(id)],
      options
    )
  )
}
