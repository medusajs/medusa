import {
  AdminGetVariantParams,
  AdminGetVariantsParams,
  AdminGetVariantsVariantInventoryRes,
  AdminVariantsListRes,
  AdminVariantsRes,
} from "@medusajs/medusa"
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

export const useAdminVariant = (
  id: string,
  query?: AdminGetVariantParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminVariantsRes>,
    Error,
    ReturnType<VariantQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminVariantKeys.detail(id),
    () => client.admin.variants.retrieve(id, query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminVariantsInventory = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminGetVariantsVariantInventoryRes>,
    Error,
    ReturnType<VariantQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminVariantKeys.detail(id),
    () => client.admin.variants.getInventory(id),
    options
  )
  return { ...data, ...rest } as const
}
