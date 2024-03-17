import {
  StoreCustomersListOrdersRes,
  StoreCustomersRes,
  StoreGetCustomersCustomerOrdersParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const CUSTOMERS_QUERY_KEY = `customers` as const

export const customerKeys = {
  ...queryKeysFactory(CUSTOMERS_QUERY_KEY),
  orders: (id: string) => [...customerKeys.detail(id), "orders"] as const,
}

type CustomerQueryKey = typeof customerKeys

/**
 * This hook retrieves the logged-in customer's details. It requires [customer authentication](https://docs.medusajs.com/medusa-react/overview#customer-authentication).
 *
 * @example
 * import React from "react"
 * import { useMeCustomer } from "medusa-react"
 *
 * const Customer = () => {
 *   const { customer, isLoading } = useMeCustomer()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {customer && (
 *         <span>{customer.first_name} {customer.last_name}</span>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Customer
 *
 * @customNamespace Hooks.Store.Customers
 * @category Queries
 */
export const useMeCustomer = (
  options?: UseQueryOptionsWrapper<
    Response<StoreCustomersRes>,
    Error,
    ReturnType<CustomerQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: customerKeys.detail("me"),
    queryFn: () => client.customers.retrieve(),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of the logged-in customer's orders. The orders can be filtered by fields such as `status` or `fulfillment_status`. The orders can also be paginated.
 * This hook requires [customer authentication](https://docs.medusajs.com/medusa-react/overview#customer-authentication).
 *
 * @example
 * import React from "react"
 * import { useCustomerOrders } from "medusa-react"
 *
 * const Orders = () => {
 *   // refetch a function that can be used to
 *   // re-retrieve orders after the customer logs in
 *   const { orders, isLoading } = useCustomerOrders()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading orders...</span>}
 *       {orders?.length && (
 *         <ul>
 *           {orders.map((order) => (
 *             <li key={order.id}>{order.display_id}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Orders
 *
 * @customNamespace Hooks.Store.Customers
 * @category Queries
 */
export const useCustomerOrders = (
  /**
   * Filters and pagination configurations to apply on the retrieved orders.
   */
  query: StoreGetCustomersCustomerOrdersParams = { limit: 10, offset: 0 },
  options?: UseQueryOptionsWrapper<
    Response<StoreCustomersListOrdersRes>,
    Error,
    ReturnType<CustomerQueryKey["orders"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: customerKeys.orders("me"),
    queryFn: () => client.customers.listOrders(query),
    ...options,
  })

  return { ...data, ...rest } as const
}
