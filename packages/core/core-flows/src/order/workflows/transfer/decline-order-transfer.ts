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
import { declineOrderChangeStep } from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * The details of the order transfer decline to validate.
 */
export type DeclineTransferOrderRequestValidationStepInput = {
  /**
   * The order to decline the transfer request for.
   */
  order: OrderDTO
  /**
   * The order change made by the transfer request.
   */
  orderChange: OrderChangeDTO
  /**
   * The decline details.
   */
  input: OrderWorkflow.DeclineTransferOrderRequestWorkflowInput
}

/**
 * This step validates that a requested order transfer can be declineed.
 * If the provided token doesn't match the token of the transfer request,
 * the step throws an error.
 *
 * :::note
 *
 * You can retrieve an order and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = declineTransferOrderRequestValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "order_change_123",
 *     // other order change details...
 *   },
 *   input: {
 *     token: "token_123",
 *     order_id: "order_123",
 *   }
 * })
 */
export const declineTransferOrderRequestValidationStep = createStep(
  "validate-decline-transfer-order-request",
  async function ({
    order,
    orderChange,
    input,
  }: DeclineTransferOrderRequestValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })

    const token = orderChange.actions?.find(
      (a) => a.action === ChangeActionType.TRANSFER_CUSTOMER
    )?.details!.token

    if (!input.token?.length || token !== input.token) {
      throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Invalid token.")
    }
  }
)

export const declineTransferOrderRequestWorkflowId =
  "decline-transfer-order-request"
/**
 * This workflow declines a requested order transfer by its token. It's used by the
 * [Decline Order Transfer Store API Route](https://docs.medusajs.com/api/store/orders/decline-transfer).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around declining an order transfer request.
 *
 * @example
 * const { result } = await declineOrderTransferRequestWorkflow(container)
 * .run({
 *   input: {
 *     token: "token_123",
 *     order_id: "order_123",
 *   }
 * })
 *
 * @summary
 *
 * Decline a requested order transfer.
 */
export const declineOrderTransferRequestWorkflow = createWorkflow(
  declineTransferOrderRequestWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeclineTransferOrderRequestWorkflowInput>
  ): WorkflowData<void> {
    const orderQuery = useQueryGraphStep({
      entity: "order",
      fields: ["id", "version", "declined_at"],
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

    declineTransferOrderRequestValidationStep({ order, orderChange, input })

    declineOrderChangeStep({ id: orderChange.id })
  }
)
