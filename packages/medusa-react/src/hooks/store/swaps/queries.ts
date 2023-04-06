import { StoreSwapsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const SWAPS_QUERY_KEY = `swaps` as const

const swapKey = {
  ...queryKeysFactory(SWAPS_QUERY_KEY),
  cart: (cartId: string) => [...swapKey.all, "cart", cartId] as const,
}

type SwapQueryKey = typeof swapKey

export const useCartSwap = (
  cartId: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreSwapsRes>,
    Error,
    ReturnType<SwapQueryKey["cart"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    swapKey.cart(cartId),
    () => client.swaps.retrieveByCartId(cartId),
    options
  )

  return { ...data, ...rest } as const
}
