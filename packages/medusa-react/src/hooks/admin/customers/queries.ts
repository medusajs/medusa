import {
  AdminCustomersListRes,
  AdminCustomersRes,
  AdminGetCustomersParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_CUSTOMERS_QUERY_KEY = `admin_customers` as const

export const adminCustomerKeys = queryKeysFactory(ADMIN_CUSTOMERS_QUERY_KEY)

type CustomerQueryKeys = typeof adminCustomerKeys

/**
 * This hook retrieves a list of Customers. The customers can be filtered by fields such as
 * `q` or `groups`. The customers can also be paginated.
 *
 * @example
 * To list customers:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminCustomers } from "medusa-react"
 *
 * const Customers = () => {
 *   const { customers, isLoading } = useAdminCustomers()
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
 * export default Customers
 * ```
 *
 * You can specify relations to be retrieved within each customer. In addition, by default, only the first `50` records are retrieved.
 * You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminCustomers } from "medusa-react"
 *
 * const Customers = () => {
 *   const {
 *     customers,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminCustomers({
 *     expand: "billing_address",
 *     limit: 20,
 *     offset: 0
 *   })
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
 * export default Customers
 * ```
 *
 * @customNamespace Hooks.Admin.Customers
 * @category Queries
 */
export const useAdminCustomers = (
  /**
   * Filters and pagination configurations to apply on the retrieved customers.
   */
  query?: AdminGetCustomersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomersListRes>,
    Error,
    ReturnType<CustomerQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminCustomerKeys.list(query),
    queryFn: () => client.admin.customers.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves the details of a customer.
 *
 * @example
 * import React from "react"
 * import { useAdminCustomer } from "medusa-react"
 *
 * type Props = {
 *   customerId: string
 * }
 *
 * const Customer = ({ customerId }: Props) => {
 *   const { customer, isLoading } = useAdminCustomer(
 *     customerId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {customer && <span>{customer.first_name}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Customer
 *
 * @customNamespace Hooks.Admin.Customers
 * @category Queries
 */
export const useAdminCustomer = (
  /**
   * The customer's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomersRes>,
    Error,
    ReturnType<CustomerQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminCustomerKeys.detail(id),
    queryFn: () => client.admin.customers.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
