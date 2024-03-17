import { StorePostSwapsReq, StoreSwapsRes } from "@medusajs/medusa"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"

/**
 * This hook creates a Swap for an Order. This will also create a return and associate it with the swap. If a return shipping option is specified, the return will automatically be fulfilled.
 * To complete the swap, you must use the {@link Hooks.Store.Carts.useCompleteCart | useCompleteCart} hook passing it the ID of the swap's cart.
 *
 * An idempotency key will be generated if none is provided in the header `Idempotency-Key` and added to
 * the response. If an error occurs during swap creation or the request is interrupted for any reason, the swap creation can be retried by passing the idempotency
 * key in the `Idempotency-Key` header.
 *
 * @example
 * import React from "react"
 * import { useCreateSwap } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * type CreateData = {
 *   return_items: {
 *     item_id: string
 *     quantity: number
 *   }[]
 *   additional_items: {
 *     variant_id: string
 *     quantity: number
 *   }[]
 *   return_shipping_option: string
 * }
 *
 * const CreateSwap = ({
 *   orderId
 * }: Props) => {
 *   const createSwap = useCreateSwap()
 *   // ...
 *
 *   const handleCreate = (
 *     data: CreateData
 *   ) => {
 *     createSwap.mutate({
 *       ...data,
 *       order_id: orderId
 *     }, {
 *       onSuccess: ({ swap }) => {
 *         console.log(swap.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateSwap
 *
 * @customNamespace Hooks.Store.Swaps
 * @category Mutations
 */
export const useCreateSwap = (
  options?: UseMutationOptions<StoreSwapsRes, Error, StorePostSwapsReq>
) => {
  const { client } = useMedusa()
  return useMutation({
    mutationFn: (data: StorePostSwapsReq) => client.swaps.create(data),
    ...options,
  })
}
