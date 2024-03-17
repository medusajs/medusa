import {
  AdminCustomerGroupsListRes,
  AdminCustomerGroupsRes,
  AdminCustomersListRes,
  AdminGetCustomerGroupsGroupParams,
  AdminGetCustomerGroupsParams,
  AdminGetCustomersParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"

import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_CUSTOMER_GROUPS_QUERY_KEY = `admin_customer_groups` as const

/**
 * @ignore
 */
export const adminCustomerGroupKeys = {
  ...queryKeysFactory(ADMIN_CUSTOMER_GROUPS_QUERY_KEY),
  detailCustomer(id: string, query?: AdminGetCustomersParams) {
    return [...this.detail(id), "customers", { ...(query || {}) }]
  },
}

type CustomerGroupQueryKeys = typeof adminCustomerGroupKeys

/**
 * This hook retrieves a customer group by its ID. You can expand the customer group's relations or
 * select the fields that should be returned.
 *
 * @example
 * import React from "react"
 * import { useAdminCustomerGroup } from "medusa-react"
 *
 * type Props = {
 *   customerGroupId: string
 * }
 *
 * const CustomerGroup = ({ customerGroupId }: Props) => {
 *   const { customer_group, isLoading } = useAdminCustomerGroup(
 *     customerGroupId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {customer_group && <span>{customer_group.name}</span>}
 *     </div>
 *   )
 * }
 *
 * export default CustomerGroup
 *
 * @customNamespace Hooks.Admin.Customer Groups
 * @category Queries
 */
export const useAdminCustomerGroup = (
  /**
   * The customer group's ID.
   */
  id: string,
  /**
   * Configurations to apply on the retrieved customer group.
   */
  query?: AdminGetCustomerGroupsGroupParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomerGroupsRes>,
    Error,
    ReturnType<CustomerGroupQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminCustomerGroupKeys.detail(id),
    queryFn: () => client.admin.customerGroups.retrieve(id, query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of customer groups. The customer groups can be filtered by fields such as `name` or `id`.
 * The customer groups can also be sorted or paginated.
 *
 * @example
 * To list customer groups:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminCustomerGroups } from "medusa-react"
 *
 * const CustomerGroups = () => {
 *   const {
 *     customer_groups,
 *     isLoading,
 *   } = useAdminCustomerGroups()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {customer_groups && !customer_groups.length && (
 *         <span>No Customer Groups</span>
 *       )}
 *       {customer_groups && customer_groups.length > 0 && (
 *         <ul>
 *           {customer_groups.map(
 *             (customerGroup) => (
 *               <li key={customerGroup.id}>
 *                 {customerGroup.name}
 *               </li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default CustomerGroups
 * ```
 *
 * To specify relations that should be retrieved within the customer groups:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminCustomerGroups } from "medusa-react"
 *
 * const CustomerGroups = () => {
 *   const {
 *     customer_groups,
 *     isLoading,
 *   } = useAdminCustomerGroups({
 *     expand: "customers"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {customer_groups && !customer_groups.length && (
 *         <span>No Customer Groups</span>
 *       )}
 *       {customer_groups && customer_groups.length > 0 && (
 *         <ul>
 *           {customer_groups.map(
 *             (customerGroup) => (
 *               <li key={customerGroup.id}>
 *                 {customerGroup.name}
 *               </li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default CustomerGroups
 * ```
 *
 * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminCustomerGroups } from "medusa-react"
 *
 * const CustomerGroups = () => {
 *   const {
 *     customer_groups,
 *     limit,
 *     offset,
 *     isLoading,
 *   } = useAdminCustomerGroups({
 *     expand: "customers",
 *     limit: 15,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {customer_groups && !customer_groups.length && (
 *         <span>No Customer Groups</span>
 *       )}
 *       {customer_groups && customer_groups.length > 0 && (
 *         <ul>
 *           {customer_groups.map(
 *             (customerGroup) => (
 *               <li key={customerGroup.id}>
 *                 {customerGroup.name}
 *               </li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default CustomerGroups
 * ```
 *
 * @customNamespace Hooks.Admin.Customer Groups
 * @category Queries
 */
export const useAdminCustomerGroups = (
  /**
   * Filters and pagination configurations to apply on the retrieved customer groups.
   */
  query?: AdminGetCustomerGroupsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomerGroupsListRes>,
    Error,
    ReturnType<CustomerGroupQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminCustomerGroupKeys.list(query),
    queryFn: () => client.admin.customerGroups.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of customers in a customer group. The customers can be filtered
 * by the `query` field. The customers can also be paginated.
 *
 * @example
 * import React from "react"
 * import { useAdminCustomerGroupCustomers } from "medusa-react"
 *
 * type Props = {
 *   customerGroupId: string
 * }
 *
 * const CustomerGroup = ({ customerGroupId }: Props) => {
 *   const {
 *     customers,
 *     isLoading,
 *   } = useAdminCustomerGroupCustomers(
 *     customerGroupId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {customers && !customers.length && (
 *         <span>No customers</span>
 *       )}
 *       {customers && customers.length > 0 && (
 *         <ul>
 *           {customers.map((customer) => (
 *             <li key={customer.id}>{customer.first_name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default CustomerGroup
 *
 * @customNamespace Hooks.Admin.Customer Groups
 * @category Queries
 */
export const useAdminCustomerGroupCustomers = (
  /**
   * The customer group's ID.
   */
  id: string,
  /**
   * Filters and pagination configurations to apply on the retrieved customers.
   */
  query?: AdminGetCustomersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomersListRes>,
    Error,
    ReturnType<CustomerGroupQueryKeys["detailCustomer"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminCustomerGroupKeys.detailCustomer(id, query),
    queryFn: () => client.admin.customerGroups.listCustomers(id, query),
    ...options,
  })
  return { ...data, ...rest } as const
}
