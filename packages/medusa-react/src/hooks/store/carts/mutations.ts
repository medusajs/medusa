import {
  StoreCartsRes,
  StoreCompleteCartRes,
  StorePostCartReq,
  StorePostCartsCartPaymentSessionReq,
  StorePostCartsCartPaymentSessionUpdateReq,
  StorePostCartsCartReq,
  StorePostCartsCartShippingMethodReq,
} from "@medusajs/medusa"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"

export const useCreateCart = (
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    StorePostCartReq | undefined
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    (data?: StorePostCartReq | undefined) => client.carts.create(data),
    options
  )
}

export const useUpdateCart = (
  cartId: string,
  options?: UseMutationOptions<StoreCartsRes, Error, StorePostCartsCartReq>
) => {
  const { client } = useMedusa()
  return useMutation(
    (data: StorePostCartsCartReq) => client.carts.update(cartId, data),
    options
  )
}

export const useCompleteCart = (
  cartId: string,
  options?: UseMutationOptions<StoreCompleteCartRes, Error>
) => {
  const { client } = useMedusa()
  return useMutation(() => client.carts.complete(cartId), options)
}

export const useCreatePaymentSession = (
  cartId: string,
  options?: UseMutationOptions<StoreCartsRes, Error>
) => {
  const { client } = useMedusa()
  return useMutation(() => client.carts.createPaymentSessions(cartId), options)
}

export const useUpdatePaymentSession = (
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    { provider_id: string } & StorePostCartsCartPaymentSessionUpdateReq
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    ({ data, provider_id }) =>
      client.carts.updatePaymentSession(cartId, provider_id, { data }),
    options
  )
}

type RefreshPaymentSessionMutationData = {
  provider_id: string
}

export const useRefreshPaymentSession = (
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    RefreshPaymentSessionMutationData
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    ({ provider_id }: RefreshPaymentSessionMutationData) =>
      client.carts.refreshPaymentSession(cartId, provider_id),
    options
  )
}

type SetPaymentSessionMutationData = { provider_id: string }

export const useSetPaymentSession = (
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    SetPaymentSessionMutationData
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    (data: StorePostCartsCartPaymentSessionReq) =>
      client.carts.setPaymentSession(cartId, data),
    options
  )
}

export const useAddShippingMethodToCart = (
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    StorePostCartsCartShippingMethodReq
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    (data: StorePostCartsCartShippingMethodReq) =>
      client.carts.addShippingMethod(cartId, data),
    options
  )
}

type DeletePaymentSessionMutationData = {
  provider_id: string
}

export const useDeletePaymentSession = (
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    DeletePaymentSessionMutationData
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    ({ provider_id }: DeletePaymentSessionMutationData) =>
      client.carts.deletePaymentSession(cartId, provider_id),
    options
  )
}

export const useStartCheckout = (
  options?: UseMutationOptions<StoreCartsRes["cart"], Error, StorePostCartReq>
) => {
  const { client } = useMedusa()
  const mutation = useMutation(async (data?: StorePostCartReq) => {
    const { cart } = await client.carts.create(data)
    const res = await client.carts.createPaymentSessions(cart.id)
    return res.cart
  }, options)

  return mutation
}
