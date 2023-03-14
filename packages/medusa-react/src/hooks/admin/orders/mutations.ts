import {
  AdminOrdersRes,
  AdminPostOrdersOrderFulfillmentsReq,
  AdminPostOrdersOrderRefundsReq,
  AdminPostOrdersOrderReq,
  AdminPostOrdersOrderReturnsReq,
  AdminPostOrdersOrderShipmentReq,
  AdminPostOrdersOrderShippingMethodsReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminOrderKeys } from "./queries"

export const useAdminUpdateOrder = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrdersOrderReq) =>
      client.admin.orders.update(id, payload),
    buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    )
  )
}

export const useAdminCancelOrder = (
  id: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.orders.cancel(id),
    buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    )
  )
}

export const useAdminCompleteOrder = (
  id: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.orders.complete(id),
    buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    )
  )
}

export const useAdminCapturePayment = (
  id: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.orders.capturePayment(id),
    buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    )
  )
}

export const useAdminRefundPayment = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderRefundsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrdersOrderRefundsReq) =>
      client.admin.orders.refundPayment(id, payload),
    buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    )
  )
}

export const useAdminCreateFulfillment = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderFulfillmentsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrdersOrderFulfillmentsReq) =>
      client.admin.orders.createFulfillment(orderId, payload),
    buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(orderId)],
      options
    )
  )
}

export const useAdminCancelFulfillment = (
  orderId: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (fulfillmentId: string) =>
      client.admin.orders.cancelFulfillment(orderId, fulfillmentId),
    buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(orderId)],
      options
    )
  )
}

export const useAdminCreateShipment = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderShipmentReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrdersOrderShipmentReq) =>
      client.admin.orders.createShipment(orderId, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

export const useAdminRequestReturn = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderReturnsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrdersOrderReturnsReq) =>
      client.admin.orders.requestReturn(orderId, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

export const useAdminAddShippingMethod = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderShippingMethodsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrdersOrderShippingMethodsReq) =>
      client.admin.orders.addShippingMethod(orderId, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

export const useAdminArchiveOrder = (
  id: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.orders.archive(id),
    buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    )
  )
}
