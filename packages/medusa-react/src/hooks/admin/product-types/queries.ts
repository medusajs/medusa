import {
  AdminProductTypesListRes,
  AdminGetProductTypesParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_PRODUCT_TYPES_QUERY_KEY = `admin_product_types` as const

export const adminProductTypeKeys = queryKeysFactory(
  ADMIN_PRODUCT_TYPES_QUERY_KEY
)

type ProductTypesQueryKeys = typeof adminProductTypeKeys

export const useAdminProductTypes = (
  query?: AdminGetProductTypesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductTypesListRes>,
    Error,
    ReturnType<ProductTypesQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductTypeKeys.list(query),
    () => client.admin.productTypes.list(query),
    options
  )
  return { ...data, ...rest } as const
}
