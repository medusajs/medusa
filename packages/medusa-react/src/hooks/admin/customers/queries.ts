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

export const useAdminCustomers = (
  query?: AdminGetCustomersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomersListRes>,
    Error,
    ReturnType<CustomerQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminCustomerKeys.list(query),
    () => client.admin.customers.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminCustomer = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomersRes>,
    Error,
    ReturnType<CustomerQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminCustomerKeys.detail(id),
    () => client.admin.customers.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
