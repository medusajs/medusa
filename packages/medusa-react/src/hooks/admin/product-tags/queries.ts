import {
  AdminGetProductTagsParams,
  AdminProductTagsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_PRODUCT_TAGS_QUERY_KEY = `admin_product_tags` as const

export const adminProductTagKeys = queryKeysFactory(
  ADMIN_PRODUCT_TAGS_QUERY_KEY
)

type ProductQueryKeys = typeof adminProductTagKeys

export const useAdminProductTags = (
  query?: AdminGetProductTagsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductTagsListRes>,
    Error,
    ReturnType<ProductQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductTagKeys.list(query),
    () => client.admin.productTags.list(query),
    options
  )
  return { ...data, ...rest } as const
}
