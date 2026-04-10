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

export const validateGiftCardInCartStep = createStep(
  "validate-gift-card-in-cart",
  async function ({
    cart,
    giftCard,
  }: {
    cart: PluginCartDTO;
    giftCard: ModuleGiftCard;
  }) {
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

export const validateGiftCardStep = createStep(
  "validate-gift-card",
  async function ({
    cart,
    giftCard,
    input,
  }: {
    cart: PluginCartDTO;
    giftCard: ModuleGiftCard;
    input: { code: string };
  }) {
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

/*
  A workflow that removes gift card from a cart
*/
export const removeGiftCardFromCartWorkflow = createWorkflow(
  "remove-gift-card-from-cart",
  function (input: { code: string; cart_id: string }) {
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
