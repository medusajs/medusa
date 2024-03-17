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
import { adminOrderKeys, adminProductKeys, adminVariantKeys } from ".."
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminSwapKeys } from "./queries"

/**
 * This hook creates a swap for an order. This includes creating a return that is associated with the swap.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateSwap } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const CreateSwap = ({ orderId }: Props) => {
 *   const createSwap = useAdminCreateSwap(orderId)
 *   // ...
 *
 *   const handleCreate = (
 *     returnItems: {
 *       item_id: string,
 *       quantity: number
 *     }[]
 *   ) => {
 *     createSwap.mutate({
 *       return_items: returnItems
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.swaps)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateSwap
 *
 * @customNamespace Hooks.Admin.Swaps
 * @category Mutations
 */
export const useAdminCreateSwap = (
  /**
   * The associated order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderSwapsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostOrdersOrderSwapsReq) =>
      client.admin.orders.createSwap(orderId, payload),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.detail(orderId), adminSwapKeys.lists()],
      options
    ),
  })
}

/**
 * This hook cancels a swap and change its status.
 *
 * @typeParamDefinition string - The swap's ID.
 *
 * @example
 * import React from "react"
 * import { useAdminCancelSwap } from "medusa-react"
 *
 * type Props = {
 *   orderId: string,
 *   swapId: string
 * }
 *
 * const Swap = ({
 *   orderId,
 *   swapId
 * }: Props) => {
 *   const cancelSwap = useAdminCancelSwap(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleCancel = () => {
 *     cancelSwap.mutate(swapId, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.swaps)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Swap
 *
 * @customNamespace Hooks.Admin.Swaps
 * @category Mutations
 */
export const useAdminCancelSwap = (
  /**
   * The associated order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (swapId: string) =>
      client.admin.orders.cancelSwap(orderId, swapId),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.detail(orderId), adminSwapKeys.lists()],
      options
    ),
  })
}

export type AdminFulfillSwapReq =
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq & {
    /**
     * The swap's ID.
     */
    swap_id: string
  }

/**
 * This hook creates a Fulfillment for a Swap and change its fulfillment status to `fulfilled`. If it requires any additional actions,
 * its fulfillment status may change to `requires_action`.
 *
 * @example
 * import React from "react"
 * import { useAdminFulfillSwap } from "medusa-react"
 *
 * type Props = {
 *   orderId: string,
 *   swapId: string
 * }
 *
 * const Swap = ({
 *   orderId,
 *   swapId
 * }: Props) => {
 *   const fulfillSwap = useAdminFulfillSwap(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleFulfill = () => {
 *     fulfillSwap.mutate({
 *       swap_id: swapId,
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.swaps)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Swap
 *
 * @customNamespace Hooks.Admin.Swaps
 * @category Mutations
 */
export const useAdminFulfillSwap = (
  /**
   * The associated order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminFulfillSwapReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ swap_id, ...payload }: AdminFulfillSwapReq) =>
      client.admin.orders.fulfillSwap(orderId, swap_id, payload),
    ...buildOptions(
      queryClient,
      [
        adminOrderKeys.detail(orderId),
        adminSwapKeys.lists(),
        adminVariantKeys.all,
        adminProductKeys.lists(),
      ],
      options
    ),
  })
}

export type AdminCreateSwapShipmentReq =
  AdminPostOrdersOrderSwapsSwapShipmentsReq & {
    /**
     * The swap's ID.
     */
    swap_id: string
  }

/**
 * This hook creates a shipment for a swap and mark its fulfillment as shipped. This changes the swap's fulfillment status
 * to either `shipped` or `partially_shipped`, depending on whether all the items were shipped.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateSwapShipment } from "medusa-react"
 *
 * type Props = {
 *   orderId: string,
 *   swapId: string
 * }
 *
 * const Swap = ({
 *   orderId,
 *   swapId
 * }: Props) => {
 *   const createShipment = useAdminCreateSwapShipment(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleCreateShipment = (
 *     fulfillmentId: string
 *   ) => {
 *     createShipment.mutate({
 *       swap_id: swapId,
 *       fulfillment_id: fulfillmentId,
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.swaps)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Swap
 *
 * @customNamespace Hooks.Admin.Swaps
 * @category Mutations
 */
export const useAdminCreateSwapShipment = (
  /**
   * The associated order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminCreateSwapShipmentReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ swap_id, ...payload }: AdminCreateSwapShipmentReq) =>
      client.admin.orders.createSwapShipment(orderId, swap_id, payload),
    ...buildOptions(queryClient, adminOrderKeys.detail(orderId), options),
  })
}

/**
 * This hook process a swap's payment either by refunding or issuing a payment. This depends on the `difference_due`
 * of the swap. If `difference_due` is negative, the amount is refunded. If `difference_due` is positive, the amount is captured.
 *
 * @typeParamDefinition string - The swap's ID.
 *
 * @example
 * import React from "react"
 * import { useAdminProcessSwapPayment } from "medusa-react"
 *
 * type Props = {
 *   orderId: string,
 *   swapId: string
 * }
 *
 * const Swap = ({
 *   orderId,
 *   swapId
 * }: Props) => {
 *   const processPayment = useAdminProcessSwapPayment(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleProcessPayment = () => {
 *     processPayment.mutate(swapId, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.swaps)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Swap
 *
 * @customNamespace Hooks.Admin.Swaps
 * @category Mutations
 */
export const useAdminProcessSwapPayment = (
  /**
   * The associated order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (swapId: string) =>
      client.admin.orders.processSwapPayment(orderId, swapId),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.detail(orderId), adminSwapKeys.lists()],
      options
    ),
  })
}

/**
 * The details of the swap's fulfillment to cancel.
 */
export type AdminCancelSwapFulfillmentReq = {
  /**
   * The swap's ID.
   */
  swap_id: string
  /**
   * The fulfillment's ID.
   */
  fulfillment_id: string
}

/**
 * This hook cancels a swap's fulfillment and change its fulfillment status to `canceled`.
 *
 * @example
 * import React from "react"
 * import { useAdminCancelSwapFulfillment } from "medusa-react"
 *
 * type Props = {
 *   orderId: string,
 *   swapId: string
 * }
 *
 * const Swap = ({
 *   orderId,
 *   swapId
 * }: Props) => {
 *   const cancelFulfillment = useAdminCancelSwapFulfillment(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleCancelFulfillment = (
 *     fulfillmentId: string
 *   ) => {
 *     cancelFulfillment.mutate({
 *       swap_id: swapId,
 *       fulfillment_id: fulfillmentId,
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Swap
 *
 * @customNamespace Hooks.Admin.Swaps
 * @category Mutations
 */
export const useAdminCancelSwapFulfillment = (
  /**
   * The associated order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    { swap_id: string; fulfillment_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
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
    ...buildOptions(
      queryClient,
      [adminOrderKeys.detail(orderId), adminSwapKeys.lists()],
      options
    ),
  })
}
