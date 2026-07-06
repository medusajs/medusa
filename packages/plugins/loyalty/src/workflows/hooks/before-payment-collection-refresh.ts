import { refreshCartItemsWorkflow } from "@medusajs/medusa/core-flows";
import { StepResponse } from "@medusajs/framework/workflows-sdk";
import { refreshCartGiftCardsWorkflow } from "../carts/workflows/refresh-cart-gift-cards";

(refreshCartItemsWorkflow.hooks as any).beforeRefreshingPaymentCollection(
  async (data, stepContext) => {
    const { container, ...sharedContext } = stepContext;

    const transaction = await refreshCartGiftCardsWorkflow.run({
      input: { cart_id: data.input.cart_id },
      container,
      context: { ...sharedContext },
    });

    const { result } = transaction;

    return new StepResponse(result, stepContext.transactionId);
  },
  async (transactionId, stepContext) => {
    if (!transactionId) {
      return;
    }

    const { container, ...sharedContext } = stepContext;

    await refreshCartGiftCardsWorkflow(container).cancel({
      transactionId,
      container,
      context: { ...sharedContext },
    });
  }
);
