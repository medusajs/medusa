import {
  StoreGetProductTagsParams,
  StoreProductTagsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const PRODUCT_TAGS_QUERY_KEY = `product_tags` as const

export const productTagKeys = queryKeysFactory(PRODUCT_TAGS_QUERY_KEY)

type ProductTypesQueryKeys = typeof productTagKeys

export const useProductTags = (
  query?: StoreGetProductTagsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreProductTagsListRes>,
    Error,
    ReturnType<ProductTypesQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    productTagKeys.list(query),
    () => client.productTags.list(query),
    options
  )
  return { ...data, ...rest } as const
}
