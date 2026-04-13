import {
  BigNumber,
  ChangeActionType,
  MathBN,
  OrderChangeStatus,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { useRemoteQueryStep } from "../../common"
import {
  createOrderChangeActionsWorkflow,
  previewOrderChangeStep,
} from "../../order"
import { getDraftOrderPromotionContextStep } from "../steps/get-draft-order-promotion-context"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { computeDraftOrderAdjustmentsWorkflow } from "./compute-draft-order-adjustments"

export const updateDraftOrderItemWorkflowId = "update-draft-order-item"

/**
 * This workflow updates an item in a draft order edit. It's used by the
 * [Update Item in Draft Order Edit Admin API Route](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedititemsitemitem_id).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * updating an item in a draft order edit.
 *
 * @example
 * const { result } = await updateDraftOrderItemWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     items: [{ id: "orli_123", quantity: 2 }],
 *   }
 * })
 *
 * @summary
 *
 * Update an item in a draft order edit.
 */
export const updateDraftOrderItemWorkflow = createWorkflow(
  updateDraftOrderItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderEditUpdateItemQuantityWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: draftOrderFieldsForRefreshSteps,
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderChangeStep({ order, orderChange })

    const orderChangeActionInput = transform(
      { order, orderChange, items: input.items },
      ({ order, orderChange, items }) => {
        return items.map((item) => {
          const existing = order?.items?.find(
            (exItem) => exItem.id === item.id
          )!

          const quantityDiff = new BigNumber(
            MathBN.sub(item.quantity, existing.quantity)
          )

          return {
            order_change_id: orderChange.id,
            order_id: order.id,
            version: orderChange.version,
            action: ChangeActionType.ITEM_UPDATE,
            internal_note: item.internal_note,
            details: {
              reference_id: item.id,
              quantity: item.quantity,
              unit_price: item.unit_price,
              compare_at_unit_price: item.compare_at_unit_price,
              quantity_diff: quantityDiff,
              metadata: item.metadata,
            },
          }
        })
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

    const context = getDraftOrderPromotionContextStep({
      order,
    })

    const appliedPromoCodes: string[] = transform(
      context,
      (context) =>
        (context as any).promotions?.map((promotion) => promotion.code) ?? []
    )

    // If any the order has any promo codes, then we need to refresh the adjustments.
    when(
      appliedPromoCodes,
      (appliedPromoCodes) => appliedPromoCodes.length > 0
    ).then(() => {
      computeDraftOrderAdjustmentsWorkflow.runAsStep({
        input: {
          order_id: input.order_id,
        },
      })
    })

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
