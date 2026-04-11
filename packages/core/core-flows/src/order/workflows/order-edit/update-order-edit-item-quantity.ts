import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../../common"
import { acquireLockStep, releaseLockStep } from "../../../locking"
import {
  previewOrderChangeStep,
  updateOrderChangeActionsStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { computeAdjustmentsForPreviewWorkflow } from "../compute-adjustments-for-preview"
import { fieldsToRefreshOrderEdit } from "./utils/fields"

/**
 * The data to validate that an existing order item can be updated in an order edit.
 */
export type UpdateOrderEditItemQuantityValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The details of the item to be updated.
   */
  input: OrderWorkflow.UpdateOrderEditItemQuantityWorkflowInput
}

/**
 * This step validates that an existing order item can be updated in an order edit.
 * If the order is canceled, the order change is not active,
 * the item isn't in the order edit, or the action isn't updating an existing item,
 * the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = updateOrderEditItemQuantityValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   input: {
 *     order_id: "order_123",
 *     action_id: "orchac_123",
 *     data: {
 *       quantity: 1,
 *     }
 *   }
 * })
 */
export const updateOrderEditItemQuantityValidationStep = createStep(
  "update-order-edit-update-quantity-validation",
  async function (
    {
      order,
      orderChange,
      input,
    }: UpdateOrderEditItemQuantityValidationStepInput,
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No request to update item quantity for order ${input.order_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.ITEM_UPDATE) {
      throw new Error(`Action ${associatedAction.id} is not updating an item`)
    }
  }
)

export const updateOrderEditItemQuantityWorkflowId =
  "update-order-edit-update-quantity"
/**
 * This workflow updates an existing order item that was previously added to the order edit.
 * It is different from the `orderEditUpdateItemQuantityWorkflow` workflow in that this should be used
 * when the item to update was added as part of the order edit. The other workflow is for items
 * that were already in the order before the edit.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to update the quantity
 * of an existing item in an order edit in your custom flows.
 *
 * @example
 * const { result } = await updateOrderEditItemQuantityWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     action_id: "orchac_123",
 *     data: {
 *       quantity: 1,
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update an existing order item previously added to an order edit.
 */
export const updateOrderEditItemQuantityWorkflow = createWorkflow(
  updateOrderEditItemQuantityWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateOrderEditItemQuantityWorkflowInput>
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
      fields: ["id", "status", "version", "actions.*"],
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

    updateOrderEditItemQuantityValidationStep({
      order,
      input,
      orderChange,
    })

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

    computeAdjustmentsForPreviewWorkflow.runAsStep({
      input: {
        order,
        orderChange,
      },
    })

    const previewOrderChange = previewOrderChangeStep(order.id) as OrderPreviewDTO

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChange)
  }
)
