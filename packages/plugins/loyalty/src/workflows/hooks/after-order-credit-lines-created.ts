import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { createOrderCreditLinesWorkflow } from "@medusajs/medusa/core-flows"
import { refundCreditLinesWorkflow } from "../orders/workflows/refund-credit-lines"

;(createOrderCreditLinesWorkflow.hooks as any).creditLinesCreated(
  async (data, stepContext) => {
    const { container, ...sharedContext } = stepContext
    const { credit_lines: createdCreditLines } = data

    const transaction = await refundCreditLinesWorkflow.run({
      input: {
        order_id: data.order_id,
        credit_lines: createdCreditLines,
      },
      container,
      context: { ...sharedContext },
      throwOnError: true,
    })

    const { result } = transaction

    return new StepResponse(result, stepContext.transactionId)
  },
  async (transactionId, stepContext) => {
    if (!transactionId) {
      return
    }

    const { container, ...sharedContext } = stepContext

    await refundCreditLinesWorkflow(container).cancel({
      transactionId,
      container,
      context: { ...sharedContext },
    })
  }
)
