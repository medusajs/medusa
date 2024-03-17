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
 * This hook creates a customer group.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateCustomerGroup } from "medusa-react"
 *
 * const CreateCustomerGroup = () => {
 *   const createCustomerGroup = useAdminCreateCustomerGroup()
 *   // ...
 *
 *   const handleCreate = (name: string) => {
 *     createCustomerGroup.mutate({
 *       name,
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateCustomerGroup
 *
 * @customNamespace Hooks.Admin.Customer Groups
 * @category Mutations
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

  return useMutation({
    mutationFn: (payload: AdminPostCustomerGroupsReq) =>
      client.admin.customerGroups.create(payload),
    ...buildOptions(queryClient, adminCustomerGroupKeys.lists(), options),
  })
}

/**
 * This hook updates a customer group's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateCustomerGroup } from "medusa-react"
 *
 * type Props = {
 *   customerGroupId: string
 * }
 *
 * const CustomerGroup = ({ customerGroupId }: Props) => {
 *   const updateCustomerGroup = useAdminUpdateCustomerGroup(
 *     customerGroupId
 *   )
 *   // ..
 *
 *   const handleUpdate = (name: string) => {
 *     updateCustomerGroup.mutate({
 *       name,
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CustomerGroup
 *
 * @customNamespace Hooks.Admin.Customer Groups
 * @category Mutations
 */
export const useAdminUpdateCustomerGroup = (
  /**
   * The customer group's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomerGroupsRes>,
    Error,
    AdminPostCustomerGroupsGroupReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostCustomerGroupsGroupReq) =>
      client.admin.customerGroups.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminCustomerGroupKeys.lists(), adminCustomerGroupKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a customer group. This doesn't delete the customers associated with the customer group.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteCustomerGroup } from "medusa-react"
 *
 * type Props = {
 *   customerGroupId: string
 * }
 *
 * const CustomerGroup = ({ customerGroupId }: Props) => {
 *   const deleteCustomerGroup = useAdminDeleteCustomerGroup(
 *     customerGroupId
 *   )
 *   // ...
 *
 *   const handleDeleteCustomerGroup = () => {
 *     deleteCustomerGroup.mutate()
 *   }
 *
 *   // ...
 * }
 *
 * export default CustomerGroup
 *
 * @customNamespace Hooks.Admin.Customer Groups
 * @category Mutations
 */
export const useAdminDeleteCustomerGroup = (
  /**
   * The customer group's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomerGroupsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.customerGroups.delete(id),
    ...buildOptions(
      queryClient,
      [adminCustomerGroupKeys.lists(), adminCustomerGroupKeys.detail(id)],
      options
    ),
  })
}

/**
 * The hook adds a list of customers to a customer group.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminAddCustomersToCustomerGroup,
 * } from "medusa-react"
 *
 * type Props = {
 *   customerGroupId: string
 * }
 *
 * const CustomerGroup = ({ customerGroupId }: Props) => {
 *   const addCustomers = useAdminAddCustomersToCustomerGroup(
 *     customerGroupId
 *   )
 *   // ...
 *
 *   const handleAddCustomers= (customerId: string) => {
 *     addCustomers.mutate({
 *       customer_ids: [
 *         {
 *           id: customerId,
 *         },
 *       ],
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CustomerGroup
 *
 * @customNamespace Hooks.Admin.Customer Groups
 * @category Mutations
 */
export const useAdminAddCustomersToCustomerGroup = (
  /**
   * The customer group's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomerGroupsRes>,
    Error,
    AdminPostCustomerGroupsGroupCustomersBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostCustomerGroupsGroupCustomersBatchReq) =>
      client.admin.customerGroups.addCustomers(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminCustomerGroupKeys.lists(),
        adminCustomerGroupKeys.detailCustomer(id),
      ],
      options
    ),
  })
}

/**
 * This hook removes a list of customers from a customer group. This doesn't delete the customer,
 * only the association between the customer and the customer group.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminRemoveCustomersFromCustomerGroup,
 * } from "medusa-react"
 *
 * type Props = {
 *   customerGroupId: string
 * }
 *
 * const CustomerGroup = ({ customerGroupId }: Props) => {
 *   const removeCustomers =
 *     useAdminRemoveCustomersFromCustomerGroup(
 *       customerGroupId
 *     )
 *   // ...
 *
 *   const handleRemoveCustomer = (customerId: string) => {
 *     removeCustomers.mutate({
 *       customer_ids: [
 *         {
 *           id: customerId,
 *         },
 *       ],
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CustomerGroup
 *
 * @customNamespace Hooks.Admin.Customer Groups
 * @category Mutations
 */
export const useAdminRemoveCustomersFromCustomerGroup = (
  /**
   * The customer group's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminCustomerGroupsRes>,
    Error,
    AdminDeleteCustomerGroupsGroupCustomerBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDeleteCustomerGroupsGroupCustomerBatchReq) =>
      client.admin.customerGroups.removeCustomers(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminCustomerGroupKeys.lists(),
        adminCustomerGroupKeys.detailCustomer(id),
      ],
      options
    ),
  })
}
