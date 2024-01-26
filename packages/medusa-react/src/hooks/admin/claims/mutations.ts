import {
  AdminOrdersRes,
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderClaimsClaimReq,
  AdminPostOrdersOrderClaimsClaimShipmentsReq,
  AdminPostOrdersOrderClaimsReq,
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
import { adminOrderKeys } from "./../orders/queries"

/**
 * This hook creates a claim for an order. If a return shipping method is specified, a return will also be created and associated with the claim. If the claim's type is `refund`,
 * the refund is processed as well.
 * 
 * @example
 * import React from "react"
 * import { useAdminCreateClaim } from "medusa-react"
 * 
 * type Props = {
 *   orderId: string
 * }
 * 
 * const CreateClaim = ({ orderId }: Props) => {
 *   const createClaim = useAdminCreateClaim(orderId)
 *   // ...
 * 
 *   const handleCreate = (itemId: string) => {
 *     createClaim.mutate({
 *       type: "refund",
 *       claim_items: [
 *         {
 *           item_id: itemId,
 *           quantity: 1,
 *         },
 *       ],
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.claims)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default CreateClaim
 * 
 * @customNamespace Hooks.Admin.Claims
 * @category Mutations
 */
export const useAdminCreateClaim = (
  /**
   * The ID of the order the claim is associated with.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderClaimsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrdersOrderClaimsReq) =>
      client.admin.orders.createClaim(orderId, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

export type AdminUpdateClaimReq = AdminPostOrdersOrderClaimsClaimReq & { 
  /**
   * The claim's ID.
   */
  claim_id: string
}

/**
 * This hook updates a claim's details.
 * 
 * @example
 * import React from "react"
 * import { useAdminUpdateClaim } from "medusa-react"
 * 
 * type Props = {
 *   orderId: string
 *   claimId: string
 * }
 * 
 * const Claim = ({ orderId, claimId }: Props) => {
 *   const updateClaim = useAdminUpdateClaim(orderId)
 *   // ...
 * 
 *   const handleUpdate = () => {
 *     updateClaim.mutate({
 *       claim_id: claimId,
 *       no_notification: false
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.claims)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default Claim
 * 
 * @customNamespace Hooks.Admin.Claims
 * @category Mutations
 */
export const useAdminUpdateClaim = (
  /**
   * The ID of the order the claim is associated with.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminUpdateClaimReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      claim_id,
      ...payload
    }: AdminUpdateClaimReq) =>
      client.admin.orders.updateClaim(orderId, claim_id, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

/**
 * This hook cancels a claim and change its status. A claim can't be canceled if it has a refund, if its fulfillments haven't been canceled, 
 * of if its associated return hasn't been canceled.
 * 
 * @typeParamDefinition string - The claim's ID.
 * 
 * @example
 * import React from "react"
 * import { useAdminCancelClaim } from "medusa-react"
 * 
 * type Props = {
 *   orderId: string
 *   claimId: string
 * }
 * 
 * const Claim = ({ orderId, claimId }: Props) => {
 *   const cancelClaim = useAdminCancelClaim(orderId)
 *   // ...
 * 
 *   const handleCancel = () => {
 *     cancelClaim.mutate(claimId)
 *   }
 * 
 *   // ...
 * }
 * 
 * export default Claim
 * 
 * @customNamespace Hooks.Admin.Claims
 * @category Mutations
 */
export const useAdminCancelClaim = (
  /**
   * The ID of the order the claim is associated with.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>, 
    Error, 
    string
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (claimId: string) => client.admin.orders.cancelClaim(orderId, claimId),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

/**
 * The details of the claim's fulfillment.
 */
export type AdminFulfillClaimReq =  AdminPostOrdersOrderClaimsClaimFulfillmentsReq & { 
  /**
   * The claim's ID.
   */
  claim_id: string
}

/**
 * This hook creates a Fulfillment for a Claim, and change its fulfillment status to `partially_fulfilled` or `fulfilled` depending on whether all the items were fulfilled.
 * It may also change the status to `requires_action` if any actions are required.
 * 
 * @example
 * import React from "react"
 * import { useAdminFulfillClaim } from "medusa-react"
 * 
 * type Props = {
 *   orderId: string
 *   claimId: string
 * }
 * 
 * const Claim = ({ orderId, claimId }: Props) => {
 *   const fulfillClaim = useAdminFulfillClaim(orderId)
 *   // ...
 * 
 *   const handleFulfill = () => {
 *     fulfillClaim.mutate({
 *       claim_id: claimId,
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.claims)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default Claim
 * 
 * @customNamespace Hooks.Admin.Claims
 * @category Mutations
 */
export const useAdminFulfillClaim = (
  /**
   * The ID of the order the claim is associated with.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminFulfillClaimReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      claim_id,
      ...payload
    }: AdminFulfillClaimReq) =>
      client.admin.orders.fulfillClaim(orderId, claim_id, payload),
    buildOptions(
      queryClient,
      [
        adminOrderKeys.detail(orderId),
        adminVariantKeys.all,
        adminProductKeys.lists(),
      ],
      options
    )
  )
}

/**
 * The cancelation details.
 */
export type AdminCancelClaimFulfillmentReq = { 
  /**
   * The claim's ID.
   */
  claim_id: string; 
  /**
   * The fulfillment's ID.
   */
  fulfillment_id: string
}

/**
 * This hook cancels a claim's fulfillment and change its fulfillment status to `canceled`.
 * 
 * @example
 * import React from "react"
 * import { useAdminCancelClaimFulfillment } from "medusa-react"
 * 
 * type Props = {
 *   orderId: string
 *   claimId: string
 * }
 * 
 * const Claim = ({ orderId, claimId }: Props) => {
 *   const cancelFulfillment = useAdminCancelClaimFulfillment(
 *     orderId
 *   )
 *   // ...
 * 
 *   const handleCancel = (fulfillmentId: string) => {
 *     cancelFulfillment.mutate({
 *       claim_id: claimId,
 *       fulfillment_id: fulfillmentId,
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.claims)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default Claim
 * 
 * @customNamespace Hooks.Admin.Claims
 * @category Mutations
 */
export const useAdminCancelClaimFulfillment = (
  /**
   * The ID of the order the claim is associated with.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminCancelClaimFulfillmentReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      claim_id,
      fulfillment_id,
    }: AdminCancelClaimFulfillmentReq) =>
      client.admin.orders.cancelClaimFulfillment(
        orderId,
        claim_id,
        fulfillment_id
      ),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

/**
 * This hook creates a shipment for the claim and mark its fulfillment as shipped. If the shipment is created successfully, this changes the claim's fulfillment status
 * to either `partially_shipped` or `shipped`, depending on whether all the items were shipped.
 * 
 * @example
 * import React from "react"
 * import { useAdminCreateClaimShipment } from "medusa-react"
 * 
 * type Props = {
 *   orderId: string
 *   claimId: string
 * }
 * 
 * const Claim = ({ orderId, claimId }: Props) => {
 *   const createShipment = useAdminCreateClaimShipment(orderId)
 *   // ...
 * 
 *   const handleCreateShipment = (fulfillmentId: string) => {
 *     createShipment.mutate({
 *       claim_id: claimId,
 *       fulfillment_id: fulfillmentId,
 *     }, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.claims)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default Claim
 * 
 * @customNamespace Hooks.Admin.Claims
 * @category Mutations
 */
export const useAdminCreateClaimShipment = (
  /**
   * The ID of the order the claim is associated with.
   */
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderClaimsClaimShipmentsReq & { 
      /**
       * The claim's ID.
       */
      claim_id: string
    }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      claim_id,
      ...payload
    }: AdminPostOrdersOrderClaimsClaimShipmentsReq & { claim_id: string }) =>
      client.admin.orders.createClaimShipment(orderId, claim_id, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}
