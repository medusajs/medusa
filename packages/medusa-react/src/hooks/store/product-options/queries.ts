import { Response } from "@medusajs/medusa-js"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"
import {
  StoreGetProductOptionsParams,
  StoreProductOptionsListRes,
} from "@medusajs/medusa/dist/api/routes/store/product-options"

const PRODUCT_OPTIONS_QUERY_KEY = `product_options` as const

export const productOptionKeys = queryKeysFactory(PRODUCT_OPTIONS_QUERY_KEY)

type ProductTypesQueryKeys = typeof productOptionKeys

export const useProductOptions = (
  query?: StoreGetProductOptionsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreProductOptionsListRes>,
    Error,
    ReturnType<ProductTypesQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    productOptionKeys.list(query),
    () => client.productOptions.list(query),
    options
  )
  return { ...data, ...rest } as const
}
