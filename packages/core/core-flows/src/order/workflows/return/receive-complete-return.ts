import type { OrderWorkflow } from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"

import type { ReturnDTO } from "@zjedene-medusa/framework/types"
import { receiveReturnStep } from "../../steps/return/receive-return"
import {
  throwIfIsCancelled,
  throwIfItemsDoesNotExistsInReturn,
} from "../../utils/order-validation"

/**
 * The data to validate that a return can be received and completed.
 */
export type ReceiveCompleteReturnValidationStepInput = {
  /**
   * The return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The details of receiving and completing the return.
   */
  input: OrderWorkflow.ReceiveCompleteOrderReturnWorkflowInput
}

/**
 * This step validates that a return can be received and completed.
 * If the return is canceled or the items do not exist in the return, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve a return details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = receiveCompleteReturnValidationStep({
 *   orderReturn: {
 *     id: "return_123",
 *     // other return details...
 *   },
 *   input: {
 *     return_id: "return_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 */
export const receiveCompleteReturnValidationStep = createStep(
  "receive-return-order-validation",
  async function (
    { orderReturn, input }: ReceiveCompleteReturnValidationStepInput,
    context
  ) {
    throwIfIsCancelled(orderReturn, "Return")
    throwIfItemsDoesNotExistsInReturn({ orderReturn, inputItems: input.items })
  }
)

export const receiveAndCompleteReturnOrderWorkflowId = "receive-return-order"
/**
 * This workflow marks a return as received and completes it.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to receive and complete a return.
 *
 * @example
 * const { result } = await receiveAndCompleteReturnOrderWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Receive and complete a return.
 */
export const receiveAndCompleteReturnOrderWorkflow = createWorkflow(
  receiveAndCompleteReturnOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.ReceiveCompleteOrderReturnWorkflowInput>
  ): WorkflowResponse<ReturnDTO | undefined> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "returns",
      fields: ["id", "canceled_at", "items.*"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    receiveCompleteReturnValidationStep({ orderReturn, input })

    return new WorkflowResponse(receiveReturnStep(input))
  }
)
