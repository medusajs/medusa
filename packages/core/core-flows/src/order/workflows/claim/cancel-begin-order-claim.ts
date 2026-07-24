import {
  OrderChangeDTO,
  OrderClaimDTO,
  OrderDTO,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  deleteClaimsStep,
  deleteOrderChangesStep,
  deleteOrderShippingMethods,
  deleteReturnsStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * The data to validate the cancelation of a requested order claim.
 */
export type CancelBeginOrderClaimValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order claim's details.
   */
  orderClaim: OrderClaimDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that the requested claim can be canceled by checking that it's not canceled,
 * its order isn't canceled, and it hasn't been confirmed. If not valid, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve an order, order claim, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = cancelBeginOrderClaimValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderClaim: {
 *     id: "claim_123",
 *     // other order claim details...
 *   }
 * })
 */
export const cancelBeginOrderClaimValidationStep = createStep(
  "validate-cancel-begin-order-claim",
  async function ({
    order,
    orderChange,
    orderClaim,
  }: CancelBeginOrderClaimValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

/**
 * The data to cancel a requested order claim.
 */
export type CancelBeginOrderClaimWorkflowInput = {
  /**
   * The ID of the claim to cancel.
   */
  claim_id: string
}

export const cancelBeginOrderClaimWorkflowId = "cancel-begin-order-claim"
/**
 * This workflow cancels a requested order claim. It's used by the
 * [Cancel Claim Request Admin API Route](https://docs.medusajs.com/api/admin/claims/cancel-claim-request).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to cancel a claim
 * for an order in your custom flows.
 * 
 * @example
 * const { result } = await cancelBeginOrderClaimWorkflow(container)
 * .run({
 *   input: {
 *     claim_id: "claim_123",
 *   }
 * })
 * 
 * @summary
 * 
 * Cancel a requested order claim.
 */
export const cancelBeginOrderClaimWorkflow = createWorkflow(
  cancelBeginOrderClaimWorkflowId,
  function (input: CancelBeginOrderClaimWorkflowInput): WorkflowData<void> {
    const orderClaim: OrderClaimDTO = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "status", "order_id", "return_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "canceled_at"],
      variables: { id: orderClaim.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    cancelBeginOrderClaimValidationStep({ order, orderClaim, orderChange })

    const shippingToRemove = transform(
      { orderChange, input },
      ({ orderChange, input }) => {
        return (orderChange.actions ?? [])
          .filter((a) => a.action === ChangeActionType.SHIPPING_ADD)
          .map(({ id }) => id)
      }
    )

    parallelize(
      deleteReturnsStep({ ids: [orderClaim.return_id!] }),
      deleteClaimsStep({ ids: [orderClaim.id] }),
      deleteOrderChangesStep({ ids: [orderChange.id] }),
      deleteOrderShippingMethods({ ids: shippingToRemove })
    )
  }
)
