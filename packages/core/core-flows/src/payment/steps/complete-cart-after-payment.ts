import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"
import { completeCartWorkflowId } from "../../cart/workflows/complete-cart"

/**
 * The data to complete a cart after a payment is captured.
 */
export type CompleteCartAfterPaymentStepInput = {
  /**
   * The ID of the cart to complete.
   */
  cart_id: string
}

export const completeCartAfterPaymentStepId = "complete-cart-after-payment-step"
/**
 * This step completes a cart after a payment is captured.
 */
export const completeCartAfterPaymentStep = createStep(
  completeCartAfterPaymentStepId,
  async (input: CompleteCartAfterPaymentStepInput, { container }) => {
    const workflowEngine = container.resolve(Modules.WORKFLOW_ENGINE)

    await workflowEngine.run(completeCartWorkflowId, {
      input: {
        id: input.cart_id,
      },
    })
  }
)
