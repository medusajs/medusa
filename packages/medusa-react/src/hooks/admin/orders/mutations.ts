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
import { adminProductKeys } from "../products"
import { adminVariantKeys } from "../variants"
import { adminOrderKeys } from "./queries"

/**
 * This hook updates an order's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateOrder } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const updateOrder = useAdminUpdateOrder(
 *     orderId
 *   )
 *
 *   const handleUpdate = (
 *     email: string
 *   ) => {
 *     updateOrder.mutate({
 *       email,
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.email)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminUpdateOrder = (
  /**
   * The order's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostOrdersOrderReq) =>
      client.admin.orders.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook cancels an order and change its status. This will also cancel any associated fulfillments and payments,
 * and it may fail if the payment or fulfillment Provider is unable to cancel the payment/fulfillment.
 *
 * @example
 * import React from "react"
 * import { useAdminCancelOrder } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const cancelOrder = useAdminCancelOrder(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleCancel = () => {
 *     cancelOrder.mutate(void 0, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.status)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminCancelOrder = (
  /**
   * The order's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.orders.cancel(id),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook completes an order and change its status. A canceled order can't be completed.
 *
 * @example
 * import React from "react"
 * import { useAdminCompleteOrder } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const completeOrder = useAdminCompleteOrder(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleComplete = () => {
 *     completeOrder.mutate(void 0, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.status)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminCompleteOrder = (
  /**
   * The order's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.orders.complete(id),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook captures all the payments associated with an order. The payment of canceled orders can't be captured.
 *
 * @example
 * import React from "react"
 * import { useAdminCapturePayment } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const capturePayment = useAdminCapturePayment(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleCapture = () => {
 *     capturePayment.mutate(void 0, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.status)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminCapturePayment = (
  /**
   * The order's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.orders.capturePayment(id),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook refunds an amount for an order. The amount must be less than or equal the `refundable_amount` of the order.
 *
 * @example
 * import React from "react"
 * import { useAdminRefundPayment } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const refundPayment = useAdminRefundPayment(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleRefund = (
 *     amount: number,
 *     reason: string
 *   ) => {
 *     refundPayment.mutate({
 *       amount,
 *       reason,
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.refunds)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminRefundPayment = (
  /**
   * The order's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderRefundsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostOrdersOrderRefundsReq) =>
      client.admin.orders.refundPayment(id, payload),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook creates a Fulfillment of an Order using the fulfillment provider, and change the order's
 * fulfillment status to either `partially_fulfilled` or `fulfilled`, depending on
 * whether all the items were fulfilled.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateFulfillment } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const createFulfillment = useAdminCreateFulfillment(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleCreateFulfillment = (
 *     itemId: string,
 *     quantity: number
 *   ) => {
 *     createFulfillment.mutate({
 *       items: [
 *         {
 *           item_id: itemId,
 *           quantity,
 *         },
 *       ],
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.fulfillments)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminCreateFulfillment = (
  /**
   * The order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderFulfillmentsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostOrdersOrderFulfillmentsReq) =>
      client.admin.orders.createFulfillment(orderId, payload),
    ...buildOptions(
      queryClient,
      [
        adminOrderKeys.lists(),
        adminOrderKeys.detail(orderId),
        adminVariantKeys.all,
        adminProductKeys.lists(),
      ],
      options
    ),
  })
}

/**
 * This hook cancels an order's fulfillment and change its fulfillment status to `canceled`.
 *
 * @typeParamDefinition string - The fulfillment's ID.
 *
 * @example
 * import React from "react"
 * import { useAdminCancelFulfillment } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const cancelFulfillment = useAdminCancelFulfillment(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleCancel = (
 *     fulfillmentId: string
 *   ) => {
 *     cancelFulfillment.mutate(fulfillmentId, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.fulfillments)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminCancelFulfillment = (
  /**
   * The order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fulfillmentId: string) =>
      client.admin.orders.cancelFulfillment(orderId, fulfillmentId),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(orderId)],
      options
    ),
  })
}

/**
 * This hook creates a shipment and mark a fulfillment as shipped. This changes the order's fulfillment status to either
 * `partially_shipped` or `shipped`, depending on whether all the items were shipped.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateShipment } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const createShipment = useAdminCreateShipment(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleCreate = (
 *     fulfillmentId: string
 *   ) => {
 *     createShipment.mutate({
 *       fulfillment_id: fulfillmentId,
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.fulfillment_status)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminCreateShipment = (
  /**
   * The order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderShipmentReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostOrdersOrderShipmentReq) =>
      client.admin.orders.createShipment(orderId, payload),
    ...buildOptions(queryClient, adminOrderKeys.detail(orderId), options),
  })
}

/**
 * This hook requests and create a return for items in an order. If the return shipping method is specified, it will be automatically fulfilled.
 *
 * @example
 * import React from "react"
 * import { useAdminRequestReturn } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const requestReturn = useAdminRequestReturn(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleRequestingReturn = (
 *     itemId: string,
 *     quantity: number
 *   ) => {
 *     requestReturn.mutate({
 *       items: [
 *         {
 *           item_id: itemId,
 *           quantity
 *         }
 *       ]
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.returns)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminRequestReturn = (
  /**
   * The order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderReturnsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostOrdersOrderReturnsReq) =>
      client.admin.orders.requestReturn(orderId, payload),
    ...buildOptions(queryClient, adminOrderKeys.detail(orderId), options),
  })
}

/**
 * This hook adds a shipping method to an order. If another shipping method exists with the same shipping profile, the previous shipping method will be replaced.
 *
 * @example
 * import React from "react"
 * import { useAdminAddShippingMethod } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const addShippingMethod = useAdminAddShippingMethod(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleAddShippingMethod = (
 *     optionId: string,
 *     price: number
 *   ) => {
 *     addShippingMethod.mutate({
 *       option_id: optionId,
 *       price
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.shipping_methods)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminAddShippingMethod = (
  /**
   * The order's ID.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderShippingMethodsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostOrdersOrderShippingMethodsReq) =>
      client.admin.orders.addShippingMethod(orderId, payload),
    ...buildOptions(queryClient, adminOrderKeys.detail(orderId), options),
  })
}

/**
 * The hook archives an order and change its status.
 *
 * @example
 * import React from "react"
 * import { useAdminArchiveOrder } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const archiveOrder = useAdminArchiveOrder(
 *     orderId
 *   )
 *   // ...
 *
 *   const handleArchivingOrder = () => {
 *     archiveOrder.mutate(void 0, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.status)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Mutations
 */
export const useAdminArchiveOrder = (
  /**
   * The order's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.orders.archive(id),
    ...buildOptions(
      queryClient,
      [adminOrderKeys.lists(), adminOrderKeys.detail(id)],
      options
    ),
  })
}
