import {
  StoreCartsRes,
  StorePostCartsCartLineItemsItemReq,
  StorePostCartsCartLineItemsReq,
} from "@medusajs/medusa"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"

/**
 * This hook generates a Line Item with a given Product Variant and adds it to the Cart.
 *
 * @example
 * import React from "react"
 * import { useCreateLineItem } from "medusa-react"
 *
 * type Props = {
 *   cartId: string
 * }
 *
 * const Cart = ({ cartId }: Props) => {
 *   const createLineItem = useCreateLineItem(cartId)
 *
 *   const handleAddItem = (
 *     variantId: string,
 *     quantity: number
 *   ) => {
 *     createLineItem.mutate({
 *       variant_id: variantId,
 *       quantity,
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.items)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Cart
 *
 * @customNamespace Hooks.Store.Line Items
 * @category Mutations
 */
export const useCreateLineItem = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    StorePostCartsCartLineItemsReq
  >
) => {
  const { client } = useMedusa()
  return useMutation({
    mutationFn: (data: StorePostCartsCartLineItemsReq) =>
      client.carts.lineItems.create(cartId, data),
    ...options,
  })
}

export type UpdateLineItemReq = StorePostCartsCartLineItemsItemReq & {
  /**
   * The line item's ID.
   */
  lineId: string
}

/**
 * This hook updates a line item's data.
 *
 * @example
 * import React from "react"
 * import { useUpdateLineItem } from "medusa-react"
 *
 * type Props = {
 *   cartId: string
 * }
 *
 * const Cart = ({ cartId }: Props) => {
 *   const updateLineItem = useUpdateLineItem(cartId)
 *
 *   const handleUpdateItem = (
 *     lineItemId: string,
 *     quantity: number
 *   ) => {
 *     updateLineItem.mutate({
 *       lineId: lineItemId,
 *       quantity,
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.items)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Cart
 *
 * @customNamespace Hooks.Store.Line Items
 * @category Mutations
 */
export const useUpdateLineItem = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<StoreCartsRes, Error, UpdateLineItemReq>
) => {
  const { client } = useMedusa()
  return useMutation({
    mutationFn: ({ lineId, ...data }: UpdateLineItemReq) =>
      client.carts.lineItems.update(cartId, lineId, data),
    ...options,
  })
}

/**
 * This hook deletes a line item from a cart. The payment sessions will be updated and the totals will be recalculated.
 *
 * @example
 * import React from "react"
 * import { useDeleteLineItem } from "medusa-react"
 *
 * type Props = {
 *   cartId: string
 * }
 *
 * const Cart = ({ cartId }: Props) => {
 *   const deleteLineItem = useDeleteLineItem(cartId)
 *
 *   const handleDeleteItem = (
 *     lineItemId: string
 *   ) => {
 *     deleteLineItem.mutate({
 *       lineId: lineItemId,
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.items)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Cart
 *
 * @customNamespace Hooks.Store.Line Items
 * @category Mutations
 */
export const useDeleteLineItem = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    {
      /**
       * The line item's ID.
       */
      lineId: string
    }
  >
) => {
  const { client } = useMedusa()
  return useMutation({
    mutationFn: ({ lineId }: { lineId: string }) =>
      client.carts.lineItems.delete(cartId, lineId),
    ...options,
  })
}
