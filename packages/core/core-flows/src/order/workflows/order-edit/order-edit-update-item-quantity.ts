import {
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import {
  BigNumber,
  ChangeActionType,
  MathBN,
  OrderChangeStatus,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../../common"
import { acquireLockStep, releaseLockStep } from "../../../locking"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { computeAdjustmentsForPreviewWorkflow } from "../compute-adjustments-for-preview"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"
import { fieldsToRefreshOrderEdit } from "./utils/fields"

/**
 * The data to validate that the quantity of an existing item in an order can be updated in an order edit.
 */
export type OrderEditUpdateItemQuantityValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that the quantity of an existing item in an order can be updated in an order edit.
 * If the order is canceled or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = orderEditUpdateItemQuantityValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   }
 * })
 */
export const orderEditUpdateItemQuantityValidationStep = createStep(
  "order-edit-update-item-quantity-validation",
  async function ({
    order,
    orderChange,
  }: OrderEditUpdateItemQuantityValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const orderEditUpdateItemQuantityWorkflowId =
  "order-edit-update-item-quantity"
/**
 * This workflow updates the quantity of an existing item in an order's edit. It's used by the
 * [Update Order Item Quantity Admin API Route](https://docs.medusajs.com/api/admin#order-edits_postordereditsiditemsitemitem_id).
 *
 * This workflow is different from the `updateOrderEditItemQuantityWorkflow` workflow in that this should be used
 * when the item to update was part of the original order before the edit. The other workflow is for items
 * that were added to the order as part of the edit.
 *
 * You can also use this workflow to remove an item from an order by setting its quantity to `0`.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to update the quantity of an existing
 * item in an order's edit in your custom flow.
 *
 * @example
 * const { result } = await orderEditUpdateItemQuantityWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 2,
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Update or remove an existing order item's quantity in the order's edit.
 */
export const orderEditUpdateItemQuantityWorkflow = createWorkflow(
  orderEditUpdateItemQuantityWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderEditUpdateItemQuantityWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const orderResult = useQueryGraphStep({
      entity: "order",
      fields: fieldsToRefreshOrderEdit,
      filters: { id: input.order_id },
      options: {
        throwIfKeyNotFound: true,
      },
    }).config({ name: "order-query" })

    const order = transform({ orderResult }, ({ orderResult }) => {
      return orderResult.data[0]
    })

    const orderChangeResult = useQueryGraphStep({
      entity: "order_change",
      fields: ["id", "status", "version", "actions.*", "carry_over_promotions"],
      filters: {
        order_id: input.order_id,
        status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
      },
    }).config({ name: "order-change-query" })

    const orderChange = transform(
      { orderChangeResult },
      ({ orderChangeResult }) => {
        return orderChangeResult.data[0]
      }
    )

    orderEditUpdateItemQuantityValidationStep({
      order,
      orderChange,
    })

    const orderChangeActionInput = transform(
      {
        order,
        orderChange,
        items: input.items,
      },
      ({ order, orderChange, items }) => {
        const itemsUpdates = items.map((item) => {
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
            },
          }
        })

        return [...itemsUpdates]
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

    computeAdjustmentsForPreviewWorkflow.runAsStep({
      input: {
        order,
        orderChange,
      },
    })

    const previewOrderChange = previewOrderChangeStep(input.order_id) as OrderPreviewDTO

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChange)
  }
)
