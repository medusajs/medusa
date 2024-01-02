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
 * @namespaceAsCategory Hooks.Store.Line Items
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
  return useMutation(
    (data: StorePostCartsCartLineItemsReq) =>
      client.carts.lineItems.create(cartId, data),
    options
  )
}

/**
 * This hook updates a line item's data.
 * 
 * @example
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
 * @namespaceAsCategory Hooks.Store.Line Items
 * @category Mutations
 */
export const useUpdateLineItem = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    StorePostCartsCartLineItemsItemReq & { lineId: string }
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    ({
      lineId,
      ...data
    }: StorePostCartsCartLineItemsItemReq & { 
      /**
       * The line item's ID.
       */
      lineId: string
    }) =>
      client.carts.lineItems.update(cartId, lineId, data),
    options
  )
}

/**
 * This hook deletes a line item from a cart. The payment sessions will be updated and the totals will be recalculated.
 * 
 * @example
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
 * @namespaceAsCategory Hooks.Store.Line Items
 * @category Mutations
 */
export const useDeleteLineItem = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<StoreCartsRes, Error, { 
    /**
     * The line item's ID.
     */
    lineId: string
  }>
) => {
  const { client } = useMedusa()
  return useMutation(
    ({ lineId }: { lineId: string }) =>
      client.carts.lineItems.delete(cartId, lineId),
    options
  )
}
