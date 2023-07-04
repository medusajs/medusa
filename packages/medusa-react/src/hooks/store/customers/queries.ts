import {
  StoreCustomersListOrdersRes,
  StoreCustomersRes,
  StoreGetCustomersCustomerOrdersParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const CUSTOMERS_QUERY_KEY = `customers` as const

export const customerKeys = {
  ...queryKeysFactory(CUSTOMERS_QUERY_KEY),
  orders: (id: string) => [...customerKeys.detail(id), "orders"] as const,
}

type CustomerQueryKey = typeof customerKeys

export const useMeCustomer = (
  options?: UseQueryOptionsWrapper<
    Response<StoreCustomersRes>,
    Error,
    ReturnType<CustomerQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    customerKeys.detail("me"),
    () => client.customers.retrieve(),
    options
  )
  return { ...data, ...rest } as const
}

export const useCustomerOrders = (
  query: StoreGetCustomersCustomerOrdersParams = { limit: 10, offset: 0 },
  options?: UseQueryOptionsWrapper<
    Response<StoreCustomersListOrdersRes>,
    Error,
    ReturnType<CustomerQueryKey["orders"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    customerKeys.orders("me"),
    () => client.customers.listOrders(query),
    options
  )

  return { ...data, ...rest } as const
}
