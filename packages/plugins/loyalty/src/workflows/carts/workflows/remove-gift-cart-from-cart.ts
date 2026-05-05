import { isPresent, MedusaError, Modules } from "@medusajs/framework/utils";
import {
  deleteCartCreditLinesWorkflow,
  dismissLinksWorkflow,
  refreshCartItemsWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";
import { createStep, createWorkflow, transform } from "@medusajs/framework/workflows-sdk";
import { PluginModule } from "../../../types";
import { PluginCartDTO } from "../../../types/cart";
import { ModuleGiftCard } from "../../../types/loyalty";

/**
 * Input to validate that a specific gift card is applied to a cart.
 */
export interface ValidateGiftCardInCartStepInput {
  /**
   * The cart to check, including its applied gift cards.
   */
  cart: PluginCartDTO
  /**
   * The gift card to look for in the cart.
   */
  giftCard: ModuleGiftCard
}

/**
 * This step validates that a gift card is present in a cart. It throws an error
 * if the gift card is not found in the cart's gift cards.
 *
 * @example
 * const data = validateGiftCardInCartStep({
 *   cart: {
 *     id: "cart_123",
 *     gift_cards: [
 *       {
 *         id: "gc_123",
 *         code: "GC-XXXX",
 *         // other gift card properties...
 *       }
 *     ],
 *     // other cart properties...
 *   },
 *   giftCard: { code: "GC-XXXX" },
 * })
 */
export const validateGiftCardInCartStep = createStep(
  "validate-gift-card-in-cart",
  async function ({
    cart,
    giftCard,
  }: ValidateGiftCardInCartStepInput) {
    const cartGiftCard = cart.gift_cards.find((gc) =>
      gc.code.includes(giftCard.code)
    );

    if (!isPresent(cartGiftCard)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Gift card (${giftCard.code}) not found in cart`
      );
    }
  }
);

/**
 * Input to validate that a gift card code exists in a cart and that the gift card record is found.
 */
export interface ValidateGiftCardStepInput {
  /**
   * The cart to validate against, including its applied gift cards.
   */
  cart: PluginCartDTO
  /**
   * The gift card record, or undefined if not found.
   */
  giftCard: ModuleGiftCard
  /**
   * The lookup input containing the gift card code.
   */
  input: { code: string }
}

/**
 * This step validates that a gift card code exists in the cart and that the gift card
 * itself exists. It throws an error if the gift card code is not in the cart or if
 * the gift card record is not found.
 *
 * @example
 * const data = validateGiftCardStep({
 *   cart: { ...cart, gift_cards: [{ code: "GC-XXXX" }] },
 *   giftCard: { code: "GC-XXXX" },
 *   input: { code: "GC-XXXX" },
 * })
 */
export const validateGiftCardStep = createStep(
  "validate-gift-card",
  async function ({
    cart,
    giftCard,
    input,
  }: ValidateGiftCardStepInput) {
    const cartGiftCards = cart.gift_cards || [];

    if (!cartGiftCards.find((gc) => gc.code === input.code)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Gift card (${input.code}) not found in cart`
      );
    }

    if (!giftCard) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Gift card (${input.code}) not found`
      );
    }
  }
);

/**
 * Input to remove a gift card from a cart.
 */
export interface RemoveGiftCardFromCartWorkflowInput {
  /**
   * The code of the gift card to remove.
   */
  code: string
  /**
   * The ID of the cart to remove the gift card from.
   */
  cart_id: string
}

/**
 * This workflow removes a gift card from a cart by deleting its associated credit
 * lines, dismissing the links between the cart and the gift card, and refreshing
 * the cart items.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around removing gift cards from carts.
 *
 * @example
 * await removeGiftCardFromCartWorkflow(container)
 *   .run({
 *     input: {
 *       code: "GC-XXXX-XXXX",
 *       cart_id: "cart_123",
 *     },
 *   })
 *
 * @summary
 *
 * Remove a gift card from a cart.
 */
export const removeGiftCardFromCartWorkflow = createWorkflow(
  "remove-gift-card-from-cart",
  function (input: RemoveGiftCardFromCartWorkflowInput) {
    const cartQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: [
        "id",
        "credit_lines.id",
        "credit_lines.reference",
        "credit_lines.reference_id",
        "gift_cards.id",
        "gift_cards.code",
      ],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-cart-query" });

    const cart = transform({ cartQuery }, ({ cartQuery }) => {
      return cartQuery.data[0];
    });

    const giftCardQuery = useQueryGraphStep({
      entity: "gift_card",
      filters: { code: input.code },
      fields: ["id", "code"],
    }).config({ name: "get-gift-card-query" });

    const giftCard = transform({ giftCardQuery }, ({ giftCardQuery }) => {
      return giftCardQuery.data[0];
    });

    validateGiftCardStep({ cart, giftCard, input });
    validateGiftCardInCartStep({ cart, giftCard });

    const creditLineIds = transform(
      { cart, giftCard },
      ({ cart, giftCard }) => {
        return cart.credit_lines
          .filter(
            (creditLine) =>
              creditLine.reference === "gift-card" &&
              creditLine.reference_id === giftCard.id
          )
          .map((creditLine) => creditLine.id);
      }
    );

    deleteCartCreditLinesWorkflow.runAsStep({
      input: { id: creditLineIds },
    });

    dismissLinksWorkflow.runAsStep({
      input: [
        {
          [Modules.CART]: { cart_id: cart.id },
          [PluginModule.LOYALTY]: { gift_card_id: giftCard.id },
        },
      ],
    });

    refreshCartItemsWorkflow.runAsStep({
      input: { cart_id: input.cart_id },
    });
  }
);
