import { MedusaContainer } from "@medusajs/framework";
import { createContainer } from "@medusajs/framework/awilix";
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { validateCartGiftCardStep } from "../add-gift-card-to-cart";
import { validateGiftCardsNotExpiredStep } from "../confirm-cart-credit-lines";

const hoursFromNow = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

/**
 * Runs a single step in an isolated workflow and returns the error message it
 * threw, or `undefined` if the step passed.
 */
const runStep = async (
  step: (input: any) => any,
  input: any
): Promise<string | undefined> => {
  const container = createContainer() as unknown as MedusaContainer;
  const workflow = createWorkflow(
    `gift-card-expiry-test-${Math.random().toString(36).slice(2)}`,
    () => {
      return new WorkflowResponse(step(input));
    }
  );

  try {
    await workflow(container).run({ input: {} });
    return undefined;
  } catch (e: any) {
    return e.message;
  }
};

const cart = {
  id: "cart_123",
  currency_code: "usd",
  gift_cards: [],
} as any;

describe("validateCartGiftCardStep", () => {
  it("rejects a gift card that has expired", async () => {
    const error = await runStep(validateCartGiftCardStep, {
      cart,
      giftCards: [
        {
          id: "gc_123",
          code: "GC-EXPIRED",
          currency_code: "usd",
          expires_at: hoursFromNow(-1),
        },
      ],
    });

    expect(error).toEqual("Gift card (GC-EXPIRED) has expired");
  });

  it("accepts a gift card that expires in the future", async () => {
    const error = await runStep(validateCartGiftCardStep, {
      cart,
      giftCards: [
        {
          id: "gc_123",
          code: "GC-VALID",
          currency_code: "usd",
          expires_at: hoursFromNow(1),
        },
      ],
    });

    expect(error).toBeUndefined();
  });

  it("accepts a gift card without an expiration date", async () => {
    const error = await runStep(validateCartGiftCardStep, {
      cart,
      giftCards: [
        {
          id: "gc_123",
          code: "GC-NO-EXPIRY",
          currency_code: "usd",
          expires_at: null,
        },
      ],
    });

    expect(error).toBeUndefined();
  });
});

describe("validateGiftCardsNotExpiredStep", () => {
  it("rejects a cart holding a gift card that has expired", async () => {
    const error = await runStep(validateGiftCardsNotExpiredStep, {
      giftCards: [
        { code: "GC-VALID", expires_at: hoursFromNow(1) },
        { code: "GC-EXPIRED", expires_at: hoursFromNow(-1) },
      ],
    });

    expect(error).toEqual("Gift card (GC-EXPIRED) has expired");
  });

  it("accepts a cart whose gift cards are all valid", async () => {
    const error = await runStep(validateGiftCardsNotExpiredStep, {
      giftCards: [
        { code: "GC-VALID", expires_at: hoursFromNow(1) },
        { code: "GC-NO-EXPIRY", expires_at: null },
      ],
    });

    expect(error).toBeUndefined();
  });
});
