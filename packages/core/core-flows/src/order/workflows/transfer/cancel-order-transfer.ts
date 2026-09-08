import {
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import {
  ChangeActionType,
  MedusaError,
  OrderChangeStatus,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../../common"
import { deleteOrderChangesStep } from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * The details of the order transfer cancellation to validate.
 */
export type CancelTransferOrderRequestValidationStep = {
  /**
   * The order to cancel the transfer request for.
   */
  order: OrderDTO
  /**
   * The order change made by the transfer request.
   */
  orderChange: OrderChangeDTO
  /**
   * The cancelation details.
   */
  input: OrderWorkflow.CancelTransferOrderRequestWorkflowInput
}

/**
 * This step validates that a requested order transfer can be canceled.
 * If the customer canceling the order transfer isn't the one that requested the transfer,
 * the step throws an error. Admin users can cancel any order transfer.
 *
 * :::note
 *
 * You can retrieve an order and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = cancelTransferOrderRequestValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "order_change_123",
 *     // other order change details...
 *   },
 *   input: {
 *     order_id: "order_123",
 *     logged_in_user_id: "cus_123",
 *     actor_type: "customer"
 *   }
 * })
 */
export const cancelTransferOrderRequestValidationStep = createStep(
  "validate-cancel-transfer-order-request",
  async function ({
    order,
    orderChange,
    input,
  }: CancelTransferOrderRequestValidationStep) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })

    if (input.actor_type === "user") {
      return
    }

    const action = orderChange.actions?.find(
      (a) => a.action === ChangeActionType.TRANSFER_CUSTOMER
    )

    if (action?.reference_id !== input.logged_in_user_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "This customer is not allowed to cancel the transfer."
      )
    }
  }
)

export const cancelTransferOrderRequestWorkflowId =
  "cancel-transfer-order-request"
/**
 * This workflow cancels a requested order transfer. This operation is allowed only by admin users and the customer that requested the transfer.
 * This workflow is used by the [Cancel Order Transfer Store API Route](https://docs.medusajs.com/api/store/orders/cancel-transfer),
 * and the [Cancel Transfer Request Admin API Route](https://docs.medusajs.com/api/admin/orders/cancel-transfer).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to build a custom flow
 * around canceling an order transfer.
 *
 * @example
 * const { result } = await cancelOrderTransferRequestWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     logged_in_user_id: "cus_123",
 *     actor_type: "customer"
 *   }
 * })
 *
 * @summary
 *
 * Cancel an order transfer request.
 */
export const cancelOrderTransferRequestWorkflow = createWorkflow(
  cancelTransferOrderRequestWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.CancelTransferOrderRequestWorkflowInput>
  ): WorkflowData<void> {
    const orderQuery = useQueryGraphStep({
      entity: "order",
      fields: ["id", "version", "canceled_at"],
      filters: { id: input.order_id },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "order-query" })

    const order = transform(
      { orderQuery },
      ({ orderQuery }) => orderQuery.data[0]
    )

    const orderChangeQuery = useQueryGraphStep({
      entity: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      filters: {
        order_id: input.order_id,
        status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
      },
    }).config({ name: "order-change-query" })

    const orderChange = transform(
      { orderChangeQuery },
      ({ orderChangeQuery }) => orderChangeQuery.data[0]
    )

    cancelTransferOrderRequestValidationStep({ order, orderChange, input })

    deleteOrderChangesStep({ ids: [orderChange.id] })
  }
)
