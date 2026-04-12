import {
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
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { computeAdjustmentsForPreviewWorkflow } from "../compute-adjustments-for-preview"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"
import { fieldsToComputeAdjustmentsForPreview } from "../order-edit/utils/fields"

/**
 * The data to validate that claim items can be added to a claim.
 */
export type OrderClaimItemValidationStepInput = {
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
 * This step validates that claim items can be added to a claim. If the
 * order or claim is canceled, or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, order claim, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = orderClaimItemValidationStep({
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
export const orderClaimItemValidationStep = createStep(
  "claim-item-validation",
  async function ({
    order,
    orderChange,
    orderClaim,
  }: {
    order: OrderDTO
    orderClaim: OrderClaimDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const orderClaimItemWorkflowId = "claim-item"
/**
 * This workflow adds order items to a claim as claim items. It's used by the
 * [Add Claim Items Admin API Route](https://docs.medusajs.com/api/admin#claims_postclaimsidclaimitems).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to add items to a claim
 * for an order in your custom flows.
 *
 * @example
 * const { result } = await orderClaimItemWorkflow(container)
 * .run({
 *   input: {
 *     claim_id: "claim_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Add order items to a claim as claim items.
 */
export const orderClaimItemWorkflow = createWorkflow(
  orderClaimItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderClaimItemWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderClaim = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "order_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "claim-query" })

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
      fields: ["id", "status", "version", "claim_id", "carry_over_promotions"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    orderClaimItemValidationStep({
      order,
      orderClaim,
      orderChange,
    })

    const orderChangeActionInput = transform(
      { order, orderChange, orderClaim, items: input.items },
      ({ order, orderChange, orderClaim, items }) => {
        return items.map((item, index) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          claim_id: orderClaim.id,
          version: orderChange.version,
          action: ChangeActionType.WRITE_OFF_ITEM,
          internal_note: item.internal_note,
          reference: "order_claim",
          reference_id: orderClaim.id,
          details: {
            reference_id: item.id,
            reason: item.reason,
            quantity: item.quantity,
            metadata: item.metadata,
          },
        }))
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

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

    return new WorkflowResponse(previewOrderChangeStep(orderClaim.order_id))
  }
)
