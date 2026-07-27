import type {
  OrderChangeDTO,
  OrderDTO,
  ReturnDTO,
} from "@medusajs/framework/types"
import { OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { deleteOrderChangesStep } from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * The data to validate that a return receival can be canceled.
 */
export type CancelReceiveReturnValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The order return's details.
   */
  orderReturn: ReturnDTO
}

/**
 * This step validates that a return receival can be canceled.
 * If the order or return is canceled, or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, return, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = cancelReceiveReturnValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other order return details...
 *   }
 * })
 */
export const cancelReceiveReturnValidationStep = createStep(
  "validate-cancel-return-shipping-method",
  async function ({
    order,
    orderChange,
    orderReturn,
  }: CancelReceiveReturnValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

/**
 * The data to cancel a return receival.
 */
export type CancelReturnReceiveWorkflowInput = {
  /**
   * The ID of the return to cancel the receival for.
   */
  return_id: string
}

export const cancelReturnReceiveWorkflowId = "cancel-receive-return"
/**
 * This workflow cancels a return receival. It's used by the
 * [Cancel Return Receival Admin API Route](https://docs.medusajs.com/api/admin/returns/cancel-return-receival).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to cancel a return receival in your custom flow.
 *
 * @example
 * const { result } = await cancelReturnReceiveWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *   }
 * })
 *
 * @summary
 *
 * Cancel a return receival.
 */
export const cancelReturnReceiveWorkflow = createWorkflow(
  cancelReturnReceiveWorkflowId,
  function (input: CancelReturnReceiveWorkflowInput): WorkflowData<void> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "canceled_at"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version"],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    cancelReceiveReturnValidationStep({ order, orderReturn, orderChange })

    deleteOrderChangesStep({ ids: [orderChange.id] })
  }
)
