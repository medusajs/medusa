import { StoreSwapsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const SWAPS_QUERY_KEY = `swaps` as const

const swapKey = {
  ...queryKeysFactory(SWAPS_QUERY_KEY),
  cart: (cartId: string) => [...swapKey.all, "cart", cartId] as const,
}

type SwapQueryKey = typeof swapKey

/**
 * This hook retrieves a Swap's details by the ID of its cart.
 *
 * @example
 * import React from "react"
 * import { useCartSwap } from "medusa-react"
 *
 * type Props = {
 *   cartId: string
 * }
 *
 * const Swap = ({ cartId }: Props) => {
 *   const {
 *     swap,
 *     isLoading,
 *   } = useCartSwap(cartId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {swap && <span>{swap.id}</span>}
 *
 *     </div>
 *   )
 * }
 *
 * export default Swap
 *
 * @customNamespace Hooks.Store.Swaps
 * @category Queries
 */
export const useCartSwap = (
  /**
   * The ID of the swap's cart.
   */
  cartId: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreSwapsRes>,
    Error,
    ReturnType<SwapQueryKey["cart"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: swapKey.cart(cartId),
    queryFn: () => client.swaps.retrieveByCartId(cartId),
    ...options,
  })

  return { ...data, ...rest } as const
}
