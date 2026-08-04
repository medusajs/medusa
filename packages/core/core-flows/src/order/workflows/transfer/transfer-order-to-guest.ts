import type {
  CustomerDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { ChangeActionType, MedusaError } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"

import { useQueryGraphStep } from "../../../common"
import { findOrCreateCustomerStep } from "../../../cart"
import { createOrderChangeStep } from "../../steps/create-order-change"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { previewOrderChangeStep } from "../../steps"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"

/**
 * The details of the guest order transfer to validate.
 *
 * @since 2.18.0
 */
export type TransferOrderToGuestValidationStepInput = {
  /**
   * The order to transfer.
   */
  order: OrderDTO
  /**
   * The guest customer the order is transferred to.
   */
  customer: CustomerDTO
}

/**
 * This step validates that an order can be transferred to a guest customer.
 * The step throws an error if the order is cancelled, if the resolved customer
 * is the one already linked to the order, or if the resolved customer is a
 * registered (non-guest) customer.
 *
 * @since 2.18.0
 *
 * @example
 * const data = transferOrderToGuestValidationStep({
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
export const transferOrderToGuestValidationStep = createStep(
  "transfer-order-to-guest-validation",
  async function ({
    order,
    customer,
  }: TransferOrderToGuestValidationStepInput) {
    throwIfOrderIsCancelled({ order })

    if (order.customer_id === customer.id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order: ${order.id} already belongs to customer: ${customer.id}`
      )
    }

    if (customer.has_account) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot transfer order: ${order.id} to registered customer account: ${customer.email}. Only guest customers are allowed.`
      )
    }
  }
)

export const transferOrderToGuestWorkflowId = "transfer-order-to-guest-workflow"
/**
 * This workflow transfers an order from its current customer to a
 * guest customer, identified by email. It's executed by the
 * [Transfer Order to Guest](https://docs.medusajs.com/api/admin/orders/transfer-to-guest)
 * API route. If no customer exists with the given
 * email, a guest customer is created. Unlike {@link requestOrderTransferWorkflow},
 * this workflow is intended for admin users and applies the transfer immediately
 * without requiring the recipient to accept it. If you need to transfer an order
 * to a registered customer, you should use that workflow instead.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to build a custom flow around transferring an order to a guest customer.
 *
 * @example
 * const { result } = await transferOrderToGuestWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     email: "customer@example.com",
 *     logged_in_user: "user_123",
 *   }
 * })
 *
 * @since 2.18.0
 *
 * @summary
 *
 * Transfer an order to a guest customer.
 */
export const transferOrderToGuestWorkflow = createWorkflow(
  transferOrderToGuestWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.TransferOrderToGuestWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const { data: order } = useQueryGraphStep({
      entity: "order",
      fields: ["id", "email", "status", "customer_id"],
      filters: { id: input.order_id },
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "order-query" })

    const customerData = findOrCreateCustomerStep({ email: input.email })

    const customer = transform(
      { customerData },
      ({ customerData }) => customerData.customer!
    )

    transferOrderToGuestValidationStep({ order, customer })

    const orderChangeInput = transform({ input }, ({ input }) => ({
      change_type: "transfer" as const,
      order_id: input.order_id,
      created_by: input.logged_in_user,
      description: input.description,
      internal_note: input.internal_note,
    }))

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
          reference_id: customer.id,
          details: {
            original_email: order.email,
            new_email: customer.email,
          },
        },
      ]
    )

    createOrderChangeActionsWorkflow.runAsStep({ input: actionInput })

    confirmOrderChanges({
      changes: [change],
      orderId: input.order_id,
      confirmed_by: input.logged_in_user,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
