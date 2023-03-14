import {
  AdminOrdersRes,
  AdminPostOrdersOrderSwapsReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapShipmentsReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { adminOrderKeys } from ".."
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminSwapKeys } from "./queries"

export const useAdminCreateSwap = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderSwapsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostOrdersOrderSwapsReq) =>
      client.admin.orders.createSwap(orderId, payload),
    buildOptions(
      queryClient,
      [adminOrderKeys.detail(orderId), adminSwapKeys.lists()],
      options
    )
  )
}

export const useAdminCancelSwap = (
  orderId: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (swapId: string) => client.admin.orders.cancelSwap(orderId, swapId),
    buildOptions(
      queryClient,
      [adminOrderKeys.detail(orderId), adminSwapKeys.lists()],
      options
    )
  )
}

export const useAdminFulfillSwap = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderSwapsSwapFulfillmentsReq & { swap_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      swap_id,
      ...payload
    }: AdminPostOrdersOrderSwapsSwapFulfillmentsReq & { swap_id: string }) =>
      client.admin.orders.fulfillSwap(orderId, swap_id, payload),
    buildOptions(
      queryClient,
      [adminOrderKeys.detail(orderId), adminSwapKeys.lists()],
      options
    )
  )
}

export const useAdminCreateSwapShipment = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderSwapsSwapShipmentsReq & { swap_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      swap_id,
      ...payload
    }: AdminPostOrdersOrderSwapsSwapShipmentsReq & { swap_id: string }) =>
      client.admin.orders.createSwapShipment(orderId, swap_id, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

export const useAdminProcessSwapPayment = (
  orderId: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (swapId: string) => client.admin.orders.processSwapPayment(orderId, swapId),
    buildOptions(
      queryClient,
      [adminOrderKeys.detail(orderId), adminSwapKeys.lists()],
      options
    )
  )
}

export const useAdminCancelSwapFulfillment = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    { swap_id: string; fulfillment_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      swap_id,
      fulfillment_id,
    }: {
      swap_id: string
      fulfillment_id: string
    }) =>
      client.admin.orders.cancelSwapFulfillment(
        orderId,
        swap_id,
        fulfillment_id
      ),
    buildOptions(
      queryClient,
      [adminOrderKeys.detail(orderId), adminSwapKeys.lists()],
      options
    )
  )
}
