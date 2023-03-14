import { AdminGetVariantsParams, AdminVariantsListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_VARIANT_QUERY_KEY = `admin_variants` as const

export const adminVariantKeys = queryKeysFactory(ADMIN_VARIANT_QUERY_KEY)

type VariantQueryKeys = typeof adminVariantKeys

export const useAdminVariants = (
  query?: AdminGetVariantsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminVariantsListRes>,
    Error,
    ReturnType<VariantQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminVariantKeys.list(query),
    () => client.admin.variants.list(query),
    options
  )
  return { ...data, ...rest } as const
}
