import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  StorePostCustomersCustomerAcceptClaimReq,
  StorePostCustomersCustomerOrderClaimReq,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { orderKeys } from "./queries"

/**
 * This hook allows the logged-in customer to claim ownership of one or more orders. This generates a token that can be used later on to verify the claim
 * using the {@link useGrantOrderAccess} hook. This also emits the event `order-update-token.created`. So, if you have a notification provider installed
 * that handles this event and sends the customer a notification, such as an email, the customer should receive instructions on how to
 * finalize their claim ownership.
 *
 * @example
 * import React from "react"
 * import { useRequestOrderAccess } from "medusa-react"
 *
 * const ClaimOrder = () => {
 *   const claimOrder = useRequestOrderAccess()
 *
 *   const handleClaimOrder = (
 *     orderIds: string[]
 *   ) => {
 *     claimOrder.mutate({
 *       order_ids: orderIds
 *     }, {
 *       onSuccess: () => {
 *         // successful
 *       },
 *       onError: () => {
 *         // an error occurred.
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ClaimOrder
 *
 * @customNamespace Hooks.Store.Orders
 * @category Mutations
 */
export const useRequestOrderAccess = (
  options?: UseMutationOptions<
    Response<{}>,
    Error,
    StorePostCustomersCustomerOrderClaimReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StorePostCustomersCustomerOrderClaimReq) =>
      client.orders.requestCustomerOrders(payload),
    ...buildOptions(queryClient, [orderKeys.all], options),
  })
}

/**
 * This hook verifies the claim order token provided to the customer when they request ownership of an order.
 *
 * @example
 * import React from "react"
 * import { useGrantOrderAccess } from "medusa-react"
 *
 * const ClaimOrder = () => {
 *   const confirmOrderRequest = useGrantOrderAccess()
 *
 *   const handleOrderRequestConfirmation = (
 *     token: string
 *   ) => {
 *     confirmOrderRequest.mutate({
 *       token
 *     }, {
 *       onSuccess: () => {
 *         // successful
 *       },
 *       onError: () => {
 *         // an error occurred.
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ClaimOrder
 *
 * @customNamespace Hooks.Store.Orders
 * @category Mutations
 */
export const useGrantOrderAccess = (
  options?: UseMutationOptions<
    Response<{}>,
    Error,
    StorePostCustomersCustomerAcceptClaimReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StorePostCustomersCustomerAcceptClaimReq) =>
      client.orders.confirmRequest(payload),
    ...buildOptions(queryClient, [orderKeys.all], options),
  })
}
