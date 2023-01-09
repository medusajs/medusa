import {
  AdminGetOrdersParams,
  AdminOrdersListRes,
  AdminOrdersRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { FindParams } from "@medusajs/medusa/dist/types/common"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_ORDERS_QUERY_KEY = `admin_orders` as const

export const adminOrderKeys = {
  ...queryKeysFactory(ADMIN_ORDERS_QUERY_KEY),
  detailOrder(id: string, query?: FindParams) {
    return [...this.detail(id), { ...(query || {}) }]
  },
}

type OrderQueryKeys = typeof adminOrderKeys

export const useAdminOrders = (
  query?: AdminGetOrdersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminOrdersListRes>,
    Error,
    ReturnType<OrderQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminOrderKeys.list(query),
    () => client.admin.orders.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminOrder = (
  id: string,
  query?: FindParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminOrdersRes>,
    Error,
    ReturnType<OrderQueryKeys["detailOrder"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminOrderKeys.detailOrder(id, query),
    () => client.admin.orders.retrieve(id, query),
    options
  )
  return { ...data, ...rest } as const
}
