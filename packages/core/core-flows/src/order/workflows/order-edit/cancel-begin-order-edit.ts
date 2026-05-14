import type { OrderChangeDTO, OrderDTO } from "@medusajs/framework/types"
import {
  ChangeActionType,
  OrderChangeStatus,
  OrderEditWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useQueryGraphStep } from "../../../common"
import { acquireLockStep, releaseLockStep } from "../../../locking"
import { deleteOrderChangesStep, deleteOrderShippingMethods } from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { fieldsToRefreshOrderEdit } from "./utils/fields"

/**
 * The data to validate that a requested order edit can be canceled.
 */
export type CancelBeginOrderEditValidationStepInput = {
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
 * This step validates that a requested order edit can be canceled.
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
 * const data = cancelBeginOrderEditValidationStep({
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
export const cancelBeginOrderEditValidationStep = createStep(
  "validate-cancel-begin-order-edit",
  async function ({
    order,
    orderChange,
  }: CancelBeginOrderEditValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

/**
 * The data to cancel a requested order edit.
 */
export type CancelBeginOrderEditWorkflowInput = {
  /**
   * The ID of the order to cancel the edit for.
   */
  order_id: string
}

export const cancelBeginOrderEditWorkflowId = "cancel-begin-order-edit"
/**
 * This workflow cancels a requested edit for an order. It's used by the
 * [Cancel Order Edit Admin API Route](https://docs.medusajs.com/api/admin#order-edits_deleteordereditsid).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to cancel an order edit
 * in your custom flow.
 *
 * @example
 * const { result } = await cancelBeginOrderEditWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *   }
 * })
 *
 * @summary
 *
 * Cancel a requested order edit.
 */
export const cancelBeginOrderEditWorkflow = createWorkflow(
  cancelBeginOrderEditWorkflowId,
  function (
    input: WorkflowData<CancelBeginOrderEditWorkflowInput>
  ): WorkflowData<void> {
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

    cancelBeginOrderEditValidationStep({ order, orderChange })

    const shippingToRemove = transform(
      { orderChange, input },
      ({ orderChange, input }) => {
        return (orderChange.actions ?? [])
          .filter((a) => a.action === ChangeActionType.SHIPPING_ADD)
          .map(({ id }) => id)
      }
    )

    const eventData = transform(
      { order, orderChange },
      ({ order, orderChange }) => {
        return {
          order_id: order.id,
          actions: orderChange.actions,
        }
      }
    )

    parallelize(
      deleteOrderChangesStep({ ids: [orderChange.id] }),
      deleteOrderShippingMethods({ ids: shippingToRemove }),
      emitEventStep({
        eventName: OrderEditWorkflowEvents.CANCELED,
        data: eventData,
      })
    )

    releaseLockStep({
      key: input.order_id,
    })
  }
)
