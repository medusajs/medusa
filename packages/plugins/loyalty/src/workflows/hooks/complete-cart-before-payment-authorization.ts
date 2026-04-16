import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { confirmCartCreditLinesWorkflow } from "../carts/workflows/confirm-cart-credit-lines"

;(completeCartWorkflow.hooks as any).beforePaymentAuthorization(
  async (data, stepContext) => {
    const { container, ...sharedContext } = stepContext
    const {
      input: { id: cart_id },
    } = data as { input: { id: string } }

    const transaction = await confirmCartCreditLinesWorkflow.run({
      input: { cart_id },
      container,
      context: { ...sharedContext, preventReleaseEvents: true },
    })

    const { result } = transaction

    return new StepResponse(result, stepContext.transactionId)
  },
  async (transactionId, stepContext) => {
    if (!transactionId) {
      return
    }

    const { container, ...sharedContext } = stepContext

    await confirmCartCreditLinesWorkflow(container).cancel({
      transactionId,
      container,
      context: { ...sharedContext },
    })
  }
)
