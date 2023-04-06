import {
  StoreGetProductTypesParams,
  StoreProductTypesListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const PRODUCT_TYPES_QUERY_KEY = `product_types` as const

export const productTypeKeys = queryKeysFactory(PRODUCT_TYPES_QUERY_KEY)

type ProductTypesQueryKeys = typeof productTypeKeys

export const useProductTypes = (
  query?: StoreGetProductTypesParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreProductTypesListRes>,
    Error,
    ReturnType<ProductTypesQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    productTypeKeys.list(query),
    () => client.productTypes.list(query),
    options
  )
  return { ...data, ...rest } as const
}
