import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderClaimDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  PromotionDTO,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  previewOrderChangeStep,
  updateOrderChangeActionsStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { computeAdjustmentsForPreviewWorkflow } from "../compute-adjustments-for-preview"
import { fieldsToComputeAdjustmentsForPreview } from "../order-edit/utils/fields"
import { refreshClaimShippingWorkflow } from "./refresh-shipping"

/**
 * The data to validate that a claim's outbound item can be updated.
 */
export type UpdateClaimAddNewItemValidationStepInput = {
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
  /**
   * The details of updating the outbound item.
   */
  input: OrderWorkflow.UpdateClaimAddNewItemWorkflowInput
}

/**
 * This step validates that a claim's new or outbound item can be updated.
 * If the order, claim, or order change is canceled, no action is adding the item,
 *  or the action is not adding an outbound item, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, order claim, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = updateClaimAddItemValidationStep({
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
 *   },
 *   input: {
 *     claim_id: "claim_123",
 *     action_id: "orchact_123",
 *     data: {
 *       quantity: 1,
 *     }
 *   }
 * })
 */
export const updateClaimAddItemValidationStep = createStep(
  "update-claim-add-item-validation",
  async function (
    {
      order,
      orderChange,
      orderClaim,
      input,
    }: UpdateClaimAddNewItemValidationStepInput,
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No request to add item for claim ${input.claim_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.ITEM_ADD) {
      throw new Error(`Action ${associatedAction.id} is not adding an item`)
    }
  }
)

export const updateClaimAddItemWorkflowId = "update-claim-add-item"
/**
 * This workflow updates a claim's new or outbound item. It's used by the
 * [Update Outbound Item API Route](https://docs.medusajs.com/api/admin#claims_postclaimsidoutbounditemsaction_id).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to update a claim's new or outbound item
 * in your custom flows.
 *
 * @example
 * const { result } = await updateClaimAddItemWorkflow(container)
 * .run({
 *   input: {
 *     claim_id: "claim_123",
 *     action_id: "orchact_123",
 *     data: {
 *       quantity: 1,
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update a claim's new or outbound item.
 */
export const updateClaimAddItemWorkflow = createWorkflow(
  updateClaimAddItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateClaimAddNewItemWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderClaim: OrderClaimDTO = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: [
        ...fieldsToComputeAdjustmentsForPreview,
        "status",
        "canceled_at",
      ],
      variables: { id: orderClaim.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*", "claim_id", "carry_over_promotions"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    updateClaimAddItemValidationStep({ order, input, orderClaim, orderChange })

    const updateData = transform(
      { orderChange, input },
      ({ input, orderChange }) => {
        const originalAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        const data = input.data
        return {
          id: input.action_id,
          details: {
            quantity: data.quantity ?? originalAction.details?.quantity,
          },
          internal_note: data.internal_note,
        }
      }
    )

    updateOrderChangeActionsStep([updateData])

    const orderWithPromotions = transform({ order }, ({ order }) => {
      return {
        ...order,
        promotions: (order as any).promotions ?? [],
      } as OrderDTO & { promotions: PromotionDTO[] }
    })

    computeAdjustmentsForPreviewWorkflow.runAsStep({
      input: {
        order: orderWithPromotions,
        orderChange,
      },
    })

    const refreshArgs = transform(
      { orderChange, orderClaim },
      ({ orderChange, orderClaim }) => {
        return {
          order_change_id: orderChange.id,
          claim_id: orderClaim.id,
          order_id: orderClaim.order_id,
        }
      }
    )

    refreshClaimShippingWorkflow.runAsStep({
      input: refreshArgs,
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
