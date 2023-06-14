import {
  AdminGetPriceListPaginationParams,
  AdminGetPriceListsPriceListProductsParams,
  AdminPriceListRes,
  AdminPriceListsListRes,
  AdminProductsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_PRICE_LISTS_QUERY_KEY = `admin_price_lists` as const

export const adminPriceListKeys = {
  ...queryKeysFactory(ADMIN_PRICE_LISTS_QUERY_KEY),
  detailProducts(id: string, query?: any) {
    return [
      ...this.detail(id),
      "products" as const,
      { ...(query || {}) },
    ] as const
  },
}

type PriceListQueryKeys = typeof adminPriceListKeys

export const useAdminPriceLists = (
  query?: AdminGetPriceListPaginationParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminPriceListsListRes>,
    Error,
    ReturnType<PriceListQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminPriceListKeys.list(query),
    () => client.admin.priceLists.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminPriceListProducts = (
  id: string,
  query?: AdminGetPriceListsPriceListProductsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListRes>,
    Error,
    ReturnType<PriceListQueryKeys["detailProducts"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminPriceListKeys.detailProducts(id, query),
    () => client.admin.priceLists.listProducts(id, query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminPriceList = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminPriceListRes>,
    Error,
    ReturnType<PriceListQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminPriceListKeys.detail(id),
    () => client.admin.priceLists.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
