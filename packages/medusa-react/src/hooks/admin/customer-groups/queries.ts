import {
  AdminCustomerGroupsListRes,
  AdminCustomerGroupsRes,
  AdminGetCustomerGroupsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "react-query"

import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_CUSTOMER_GROUPS_QUERY_KEY = `admin_customer_groups` as const

export const adminCustomerGroupKeys = queryKeysFactory(
  ADMIN_CUSTOMER_GROUPS_QUERY_KEY
)

type CustomerGroupQueryKeys = typeof adminCustomerGroupKeys

/**
 * Hook retrieves a customer group by id.
 *
 * @param id - customer group id
 * @param options
 */
export const useAdminCustomerGroup = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminCustomerGroupsRes>,
    Error,
    ReturnType<CustomerGroupQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminCustomerGroupKeys.detail(id),
    () => client.admin.customerGroups.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * Hook retrieves a list of customer gorups.
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
