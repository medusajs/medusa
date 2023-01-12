import {
  AdminGetShippingOptionsParams,
  AdminShippingOptionsListRes,
  AdminShippingOptionsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_SHIPPING_OPTIONS_QUERY_KEY = `admin_shipping_options` as const

export const adminShippingOptionKeys = queryKeysFactory(
  ADMIN_SHIPPING_OPTIONS_QUERY_KEY
)

type ShippingOptionQueryKeys = typeof adminShippingOptionKeys

export const useAdminShippingOptions = (
  query?: AdminGetShippingOptionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminShippingOptionsListRes>,
    Error,
    ReturnType<ShippingOptionQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminShippingOptionKeys.list(query),
    () => client.admin.shippingOptions.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminShippingOption = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminShippingOptionsRes>,
    Error,
    ReturnType<ShippingOptionQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminShippingOptionKeys.detail(id),
    () => client.admin.shippingOptions.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
