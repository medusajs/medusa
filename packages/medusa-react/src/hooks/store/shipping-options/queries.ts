import {
  StoreGetShippingOptionsParams,
  StoreShippingOptionsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const SHIPPING_OPTION_QUERY_KEY = `shipping_options` as const

const shippingOptionKey = {
  ...queryKeysFactory(SHIPPING_OPTION_QUERY_KEY),
  cart: (cartId: string) => [...shippingOptionKey.all, "cart", cartId] as const,
}

type ShippingOptionQueryKey = typeof shippingOptionKey

export const useShippingOptions = (
  query?: StoreGetShippingOptionsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreShippingOptionsListRes>,
    Error,
    ReturnType<ShippingOptionQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    shippingOptionKey.list(query),
    async () => client.shippingOptions.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useCartShippingOptions = (
  cartId: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreShippingOptionsListRes>,
    Error,
    ReturnType<ShippingOptionQueryKey["cart"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    shippingOptionKey.cart(cartId),
    async () => client.shippingOptions.listCartOptions(cartId),
    options
  )
  return { ...data, ...rest } as const
}
