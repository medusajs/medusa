import {
  AdminGetProductsParams,
  AdminProductsListRes,
  AdminProductsListTagsRes,
  AdminProductsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_PRODUCTS_QUERY_KEY = `admin_products` as const

export const adminProductKeys = queryKeysFactory(ADMIN_PRODUCTS_QUERY_KEY)

type ProductQueryKeys = typeof adminProductKeys

export const useAdminProducts = (
  query?: AdminGetProductsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListRes>,
    Error,
    ReturnType<ProductQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductKeys.list(query),
    () => client.admin.products.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminProduct = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsRes>,
    Error,
    ReturnType<ProductQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductKeys.detail(id),
    () => client.admin.products.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminProductTagUsage = (
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListTagsRes>,
    Error,
    ReturnType<ProductQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductKeys.detail("tags"),
    () => client.admin.products.listTags(),
    options
  )
  return { ...data, ...rest } as const
}
