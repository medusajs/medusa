import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderClaimDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { deleteOrderShippingMethods } from "../../steps"
import { deleteOrderChangeActionsStep } from "../../steps/delete-order-change-actions"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * The data to validate that a claim's shipping method can be removed.
 */
export type RemoveClaimShippingMethodValidationStepInput = {
  /**
   * The order claim's details.
   */
  orderClaim: OrderClaimDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The details of removing the shipping method.
   */
  input: Pick<OrderWorkflow.DeleteClaimShippingMethodWorkflowInput, "claim_id" | "action_id">
}

/**
 * This step validates that a claim's shipping method can be removed.
 * If the claim or order change is canceled, the shipping method doesn't
 * exist in the claim, or the action is not adding a shipping method, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve an order claim and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = removeClaimShippingMethodValidationStep({
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderClaim: {
 *     id: "claim_123",
 *     // other order claim details...
 *   },
 *   input: {
 *     claim_id: "claim_123",
 *     action_id: "orchact_123",
 *   }
 * })
 */
export const removeClaimShippingMethodValidationStep = createStep(
  "validate-remove-claim-shipping-method",
  async function ({
    orderChange,
    orderClaim,
    input,
  }: RemoveClaimShippingMethodValidationStepInput) {
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No shipping method found for claim ${input.claim_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.SHIPPING_ADD) {
      throw new Error(
        `Action ${associatedAction.id} is not adding a shipping method`
      )
    }
  }
)

export const removeClaimShippingMethodWorkflowId =
  "remove-claim-shipping-method"
/**
 * This workflow removes an inbound (return) or outbound (delivery of new items) shipping method of a claim.
 * It's used by the [Remove Inbound Shipping Method](https://docs.medusajs.com/api/admin/claims/remove-inbound-shipping-method),
 * or [Remove Outbound Shipping Method](https://docs.medusajs.com/api/admin/claims/remove-outbound-shipping-method) Admin API Routes.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to remove shipping methods from a claim
 * in your own custom flows.
 * 
 * @example
 * const { result } = await removeClaimShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     claim_id: "claim_123",
 *     action_id: "orchact_123",
 *   }
 * })
 * 
 * @summary
 * 
 * Remove an inbound or outbound shipping method from a claim.
 */
export const removeClaimShippingMethodWorkflow = createWorkflow(
  removeClaimShippingMethodWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteClaimShippingMethodWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderClaim: OrderClaimDTO = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    })

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

    removeClaimShippingMethodValidationStep({ orderClaim, orderChange, input })

    const dataToRemove = transform(
      { orderChange, input },
      ({ orderChange, input }) => {
        const associatedAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        return {
          actionId: associatedAction.id,
          shippingMethodId: associatedAction.reference_id,
        }
      }
    )

    parallelize(
      deleteOrderChangeActionsStep({ ids: [dataToRemove.actionId] }),
      deleteOrderShippingMethods({ ids: [dataToRemove.shippingMethodId] })
    )

    return new WorkflowResponse(previewOrderChangeStep(orderClaim.order_id))
  }
)
