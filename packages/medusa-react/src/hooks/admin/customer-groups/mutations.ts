import {
  AdminCustomerGroupsDeleteRes,
  AdminCustomerGroupsRes,
  AdminDeleteCustomerGroupsGroupCustomerBatchReq,
  AdminPostCustomerGroupsGroupCustomersBatchReq,
  AdminPostCustomerGroupsGroupReq,
  AdminPostCustomerGroupsReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminCustomerGroupKeys } from "./queries"

/**
 * Hook returns functions for creating customer groups.
 *
 * @param options
 */
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

/**
 * Hook return functions for updating a customer group.
 *
 * @param id - id of the customer group that is being updated
 * @param options
 */
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

/**
 * Hook return functions for deleting a customer group.
 *
 * @param id - id of the customer group that is being deleted
 * @param options
 */
export const useAdminDeleteCustomerGroup = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomerGroupsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.customerGroups.delete(id),
    buildOptions(
      queryClient,
      [adminCustomerGroupKeys.lists(), adminCustomerGroupKeys.detail(id)],
      options
    )
  )
}

/**
 * Hook returns functions for addition of multiple customers to a customer group.
 *
 * @param id - id of the customer group in which customers are being added
 * @param options
 */
export const useAdminAddCustomersToCustomerGroup = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomerGroupsRes>,
    Error,
    AdminPostCustomerGroupsGroupCustomersBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostCustomerGroupsGroupCustomersBatchReq) =>
      client.admin.customerGroups.addCustomers(id, payload),
    buildOptions(
      queryClient,
      [
        adminCustomerGroupKeys.lists(),
        adminCustomerGroupKeys.detailCustomer(id),
      ],
      options
    )
  )
}

/**
 * Hook returns function for removal of multiple customers from a customer group.
 *
 * @param id - id of a group from which customers will be removed
 * @param options
 */
export const useAdminRemoveCustomersFromCustomerGroup = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomerGroupsRes>,
    Error,
    AdminDeleteCustomerGroupsGroupCustomerBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDeleteCustomerGroupsGroupCustomerBatchReq) =>
      client.admin.customerGroups.removeCustomers(id, payload),
    buildOptions(
      queryClient,
      [
        adminCustomerGroupKeys.lists(),
        adminCustomerGroupKeys.detailCustomer(id),
      ],
      options
    )
  )
}
