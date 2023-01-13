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

export const adminCustomerGroupKeys = {
  ...queryKeysFactory(ADMIN_CUSTOMER_GROUPS_QUERY_KEY),
  detailCustomer(id: string, query?: AdminGetCustomersParams) {
    return [...this.detail(id), "customers", { ...(query || {}) }]
  },
}

type CustomerGroupQueryKeys = typeof adminCustomerGroupKeys

/**
 * Hook retrieves a customer group by id.
 *
 * @param id - customer group id
 * @param query - query params
 * @param options
 */
export const useAdminCustomerGroup = (
  id: string,
  query?: AdminGetCustomerGroupsGroupParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomerGroupsRes>,
    Error,
    ReturnType<CustomerGroupQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminCustomerGroupKeys.detail(id),
    () => client.admin.customerGroups.retrieve(id, query),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * Hook retrieves a list of customer groups.
 *
 * @param query - pagination/filtering params
 * @param options
 */
export const useAdminCustomerGroups = (
  query?: AdminGetCustomerGroupsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomerGroupsListRes>,
    Error,
    ReturnType<CustomerGroupQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminCustomerGroupKeys.list(query),
    () => client.admin.customerGroups.list(query),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * Hook retrieves a list of customers that belong to provided groups.
 *
 * @param id - customer group id
 * @param query - pagination/filtering params
 * @param options
 */
export const useAdminCustomerGroupCustomers = (
  id: string,
  query?: AdminGetCustomersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomersListRes>,
    Error,
    ReturnType<CustomerGroupQueryKeys["detailCustomer"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminCustomerGroupKeys.detailCustomer(id, query),
    () => client.admin.customerGroups.listCustomers(id, query),
    options
  )
  return { ...data, ...rest } as const
}
