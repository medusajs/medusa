import {
  StoreGetProductsParams,
  StoreProductsListRes,
  StoreProductsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const PRODUCTS_QUERY_KEY = `products` as const

export const productKeys = queryKeysFactory<
  typeof PRODUCTS_QUERY_KEY,
  StoreGetProductsParams
>(PRODUCTS_QUERY_KEY)
type ProductQueryKey = typeof productKeys

export const useProducts = (
  query?: StoreGetProductsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreProductsListRes>,
    Error,
    ReturnType<ProductQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    productKeys.list(query),
    () => client.products.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useProduct = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreProductsRes>,
    Error,
    ReturnType<ProductQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    productKeys.detail(id),
    () => client.products.retrieve(id),
    options
  )

  return { ...data, ...rest } as const
}
