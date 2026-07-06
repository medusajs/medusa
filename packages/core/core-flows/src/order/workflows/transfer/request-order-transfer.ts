import type { OrderDTO, OrderWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import type { CustomerDTO, OrderPreviewDTO } from "@medusajs/framework/types"
import { v4 as uid } from "uuid"

import { emitEventStep, useRemoteQueryStep } from "../../../common"
import { createOrderChangeStep } from "../../steps/create-order-change"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"
import {
  ChangeActionType,
  MedusaError,
  OrderChangeStatus,
  OrderWorkflowEvents,
} from "@medusajs/utils"
import { previewOrderChangeStep, updateOrderChangesStep } from "../../steps"

/**
 * The details of the order transfer request to validate.
 */
export type RequestOrderTransferValidationStepInput = {
  /**
   * The order to transfer.
   */
  order: OrderDTO
  /**
   * The customer to transfer the order to.
   */
  customer: CustomerDTO
}

/**
 * This step validates that an order transfer can be requested. If the customer
 * is a guest customer, or the order already belongs to a registered customer,
 * the step throws an error.
 *
 * :::note
 *
 * You can retrieve an order and customer details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = requestOrderTransferValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   customer: {
 *     id: "customer_123",
 *     // other customer details...
 *   }
 * })
 */
export const requestOrderTransferValidationStep = createStep(
  "request-order-transfer-validation",
  async function ({
    order,
    customer,
  }: RequestOrderTransferValidationStepInput) {
    throwIfOrderIsCancelled({ order })

    if (!customer.has_account) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot transfer order: ${order.id} to a guest customer account: ${customer.email}`
      )
    }

    if (order.customer_id === customer.id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order: ${order.id} already belongs to customer: ${customer.id}`
      )
    }
  }
)

export const requestOrderTransferWorkflowId = "request-order-transfer-workflow"
/**
 * This workflow requests an order transfer from a guest customer to a registered customer. It can be requested by an admin user or a customer.
 * If a customer requested the transfer, the `logged_in_user` input property should be the same as the customer's ID.
 *
 * This workflow is used by the [Request Order Transfer Store API Route](https://docs.medusajs.com/api/store#orders_postordersidtransferrequest),
 * and the [Request Order Transfer Admin API Route](https://docs.medusajs.com/api/admin#orders_postordersidtransfer).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to build a custom flow around requesting an order transfer.
 *
 * @example
 * const { result } = await requestOrderTransferWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     customer_id: "customer_123",
 *     logged_in_user: "user_123",
 *   }
 * })
 *
 * @summary
 *
 * Request a transfer of an order to a customer.
 */
export const requestOrderTransferWorkflow = createWorkflow(
  requestOrderTransferWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.RequestOrderTransferWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "email", "status", "customer_id"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const customer: CustomerDTO = useRemoteQueryStep({
      entry_point: "customers",
      fields: ["id", "email", "has_account"],
      variables: { id: input.customer_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "customer-query" })

    requestOrderTransferValidationStep({ order, customer })

    const orderChangeInput = transform({ input }, ({ input }) => {
      return {
        change_type: "transfer" as const,
        order_id: input.order_id,
        created_by: input.logged_in_user,
        description: input.description,
        internal_note: input.internal_note,
      }
    })

    const change = createOrderChangeStep(orderChangeInput)

    const actionInput = transform(
      { order, input, change, customer },
      ({ order, input, change, customer }) => [
        {
          order_change_id: change.id,
          order_id: input.order_id,
          action: ChangeActionType.TRANSFER_CUSTOMER,
          version: change.version,
          reference: "customer",
          reference_id: input.customer_id,
          details: {
            token: uid(),
            original_email: order.email,
            ...(input.update_order_email ? { new_email: customer.email } : {}),
          },
        },
      ]
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: actionInput,
    })

    const updateOrderChangeInput = transform(
      { input, change },
      ({ input, change }) => [
        {
          id: change.id,
          status: OrderChangeStatus.REQUESTED,
          requested_by: input.logged_in_user,
          requested_at: new Date(),
        },
      ]
    )

    updateOrderChangesStep(updateOrderChangeInput)

    emitEventStep({
      eventName: OrderWorkflowEvents.TRANSFER_REQUESTED,
      data: { id: input.order_id, order_change_id: change.id },
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
