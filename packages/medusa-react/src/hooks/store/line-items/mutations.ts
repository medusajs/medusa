import {
  StoreCartsRes,
  StorePostCartsCartLineItemsItemReq,
  StorePostCartsCartLineItemsReq,
} from "@medusajs/medusa"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"

export const useCreateLineItem = (
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

export const useUpdateLineItem = (
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
    }: StorePostCartsCartLineItemsItemReq & { lineId: string }) =>
      client.carts.lineItems.update(cartId, lineId, data),
    options
  )
}

export const useDeleteLineItem = (
  cartId: string,
  options?: UseMutationOptions<StoreCartsRes, Error, { lineId: string }>
) => {
  const { client } = useMedusa()
  return useMutation(
    ({ lineId }: { lineId: string }) =>
      client.carts.lineItems.delete(cartId, lineId),
    options
  )
}
