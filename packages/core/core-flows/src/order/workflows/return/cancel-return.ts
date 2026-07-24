import {
  FulfillmentDTO,
  OrderWorkflow,
  PaymentCollectionDTO,
  ReturnDTO,
} from "@medusajs/framework/types"
import { MathBN, MedusaError } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { cancelOrderReturnStep } from "../../steps"
import { throwIfIsCancelled } from "../../utils/order-validation"

/**
 * The data to validate that a return can be canceled.
 */
export type CancelReturnValidateOrderInput = {
  /**
   * The order return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The data to cancel a return.
   */
  input: OrderWorkflow.CancelReturnWorkflowInput
}

/**
 * This step validates that a return can be canceled.
 * If the return is canceled, its fulfillment aren't canceled,
 * or it has received items, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve a return details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = cancelReturnValidateOrder({
 *   orderReturn: {
 *     id: "return_123",
 *     // other order return details...
 *   },
 *   input: {
 *     return_id: "return_123"
 *   }
 * })
 */
export const cancelReturnValidateOrder = createStep(
  "validate-return",
  ({ orderReturn }: CancelReturnValidateOrderInput) => {
    const orderReturn_ = orderReturn as ReturnDTO & {
      payment_collections: PaymentCollectionDTO[]
      fulfillments: FulfillmentDTO[]
    }

    throwIfIsCancelled(orderReturn, "Return")

    const throwErrorIf = (
      arr: unknown[],
      pred: (obj: any) => boolean,
      message: string
    ) => {
      if (arr?.some(pred)) {
        throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
      }
    }

    const notCanceled = (o) => !o.canceled_at
    const hasReceived = (o) => MathBN.gt(o.received_quantity, 0)

    throwErrorIf(
      orderReturn_.fulfillments,
      notCanceled,
      "All fulfillments must be canceled before canceling a return"
    )

    throwErrorIf(
      orderReturn_.items!,
      hasReceived,
      "Can't cancel a return which has returned items"
    )
  }
)

export const cancelReturnWorkflowId = "cancel-return"
/**
 * This workflow cancels a return. It's used by the
 * [Cancel Return Admin API Route](https://docs.medusajs.com/api/admin/returns/cancel-a-return).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to cancel a return in your custom flow.
 *
 * @example
 * const { result } = await cancelReturnWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *   }
 * })
 *
 * @summary
 *
 * Cancel a return.
 */
export const cancelReturnWorkflow = createWorkflow(
  cancelReturnWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CancelReturnWorkflowInput>
  ): WorkflowData<void> => {
    const orderReturn: ReturnDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "return",
        fields: [
          "id",
          "order_id",
          "canceled_at",
          "items.id",
          "items.received_quantity",
          "fulfillments.canceled_at",
        ],
        variables: { id: input.return_id },
        list: false,
        throw_if_key_not_found: true,
      })

    cancelReturnValidateOrder({ orderReturn, input })

    cancelOrderReturnStep({
      return_id: orderReturn.id,
      order_id: orderReturn.order_id,
      canceled_by: input.canceled_by,
    })
  }
)
