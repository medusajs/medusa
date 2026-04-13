import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { confirmCartCreditLinesWorkflow } from "../carts/workflows/confirm-cart-credit-lines"
import { cloneCartGiftCardsToOrderWorkflow } from "../orders/workflows/link-gift-cards-to-order"
;(completeCartWorkflow.hooks as any).orderCreated(
  async (data: { order_id: string; cart_id: string }, stepContext) => {
    const { container, ...sharedContext } = stepContext
    const { order_id, cart_id } = data

    const transaction = await cloneCartGiftCardsToOrderWorkflow.run({
      input: {
        order_id: order_id,
        cart_id: cart_id,
      },
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
