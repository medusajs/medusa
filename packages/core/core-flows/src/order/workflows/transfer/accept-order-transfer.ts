import {
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import type { OrderPreviewDTO } from "@medusajs/framework/types"
import {
  ChangeActionType,
  MedusaError,
  OrderChangeStatus,
} from "@medusajs/utils"

import { useQueryGraphStep } from "../../../common"
import { previewOrderChangeStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"

/**
 * The details of the order transfer acceptance to validate.
 */
export type AcceptOrderTransferValidationStepInput = {
  /**
   * The token of the order transfer.
   */
  token: string
  /**
   * The order to accept the transfer for.
   */
  order: OrderDTO
  /**
   * The order change made by the transfer request.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that an order transfer can be accepted. If the
 * order doesn't have an existing transfer request, the step throws an error.
 *
 * :::note
 *
 * You can retrieve an order and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = acceptOrderTransferValidationStep({
 *   token: "sk_123456",
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "order_change_123",
 *     // other order change details...
 *   }
 * })
 */
export const acceptOrderTransferValidationStep = createStep(
  "accept-order-transfer-validation",
  async function ({
    token,
    order,
    orderChange,
  }: {
    token: string
    order: OrderDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfOrderIsCancelled({ order })

    if (!orderChange || orderChange.change_type !== "transfer") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order ${order.id} does not have an order transfer request.`
      )
    }
    const transferCustomerAction = orderChange.actions.find(
      (a) => a.action === ChangeActionType.TRANSFER_CUSTOMER
    )

    if (!token.length || token !== transferCustomerAction?.details!.token) {
      throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Invalid token.")
    }
  }
)

export const acceptOrderTransferWorkflowId = "accept-order-transfer-workflow"
/**
 * This workflow accepts an order transfer, requested previously by the {@link requestOrderTransferWorkflow}. This workflow is used by the
 * [Accept Order Transfer Store API Route](https://docs.medusajs.com/api/store/orders/accept-transfer).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to build a custom flow
 * around accepting an order transfer.
 *
 * @example
 * const { result } = await acceptOrderTransferWorkflow(container)
 * .run({
 *   input: {
 *     token: "sk_123456",
 *     order_id: "order_123",
 *   }
 * })
 *
 * @summary
 *
 * Accept an order transfer request.
 */
export const acceptOrderTransferWorkflow = createWorkflow(
  acceptOrderTransferWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.AcceptOrderTransferWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderQuery = useQueryGraphStep({
      entity: "order",
      fields: ["id", "email", "status", "customer_id"],
      filters: { id: input.order_id },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "order-query" })

    const order = transform(
      { orderQuery },
      ({ orderQuery }) => orderQuery.data[0]
    )

    const orderChangeQuery = useQueryGraphStep({
      entity: "order_change",
      fields: [
        "id",
        "status",
        "change_type",
        "actions.id",
        "actions.order_id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      filters: {
        order_id: input.order_id,
        status: [OrderChangeStatus.REQUESTED],
      },
    }).config({ name: "order-change-query" })

    const orderChange = transform(
      { orderChangeQuery },
      ({ orderChangeQuery }) => orderChangeQuery.data[0]
    )

    acceptOrderTransferValidationStep({
      order,
      orderChange,
      token: input.token,
    })

    confirmOrderChanges({
      changes: [orderChange],
      orderId: order.id,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
