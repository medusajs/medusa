import { CreateCartCreditLineDTO } from "@medusajs/framework/types";
import { MathBN, Modules } from "@medusajs/framework/utils";
import {
  createCartCreditLinesWorkflow,
  createLinksWorkflow,
  deleteCartCreditLinesWorkflow,
  dismissLinksWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PluginModule } from "../../../types";
import { retrieveGiftCardsBalanceStep } from "../../gift-cards/steps/retrieve-gift-card-balance";
import { validateGiftCardBalancesStep } from "../steps/validate-gift-card-balances";

/**
 * Data to refresh the gift card credit lines on a cart.
 */
export type RefreshCartGiftCardsWorkflowInput = {
  /**
   * The ID of the cart for which to refresh gift card credit lines.
   */
  cart_id: string;
};

/**
 * This workflow refreshes the gift card credit lines on a cart. It removes existing
 * gift card credit lines and recreates them based on current gift card balances,
 * accounting for any changes to the cart total or gift card balances.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around refreshing cart gift cards.
 *
 * @example
 * const { result } = await refreshCartGiftCardsWorkflow(container)
 *   .run({
 *     input: {
 *       cart_id: "cart_123",
 *     },
 *   })
 *
 * @summary
 *
 * Refresh gift card credit lines on a cart.
 */
export const refreshCartGiftCardsWorkflow = createWorkflow(
  "refresh-cart-gift-card",
  function (input: RefreshCartGiftCardsWorkflowInput) {
    const existingCardQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: [
        "id",
        "currency_code",
        "total",
        "gift_cards.code",
        "credit_lines.id",
        "credit_lines.reference",
        "credit_lines.reference_id",
      ],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-existing-cart-query" });

    const existingCart = transform(
      { existingCardQuery },
      ({ existingCardQuery }) => {
        return existingCardQuery.data[0];
      }
    );

    const toDismiss = transform({ existingCart }, ({ existingCart }) => {
      const giftCardCreditLines = existingCart.credit_lines.filter(
        (creditLine) => creditLine.reference === "gift-card"
      );

      return {
        creditLineIds: giftCardCreditLines.map((cl) => cl.id),
        giftCardIds: giftCardCreditLines.map((cl) => cl.reference_id),
      };
    });

    deleteCartCreditLinesWorkflow.runAsStep({
      input: {
        id: toDismiss.creditLineIds,
      },
    });

    const linksToDismiss = transform(
      { toDismiss, existingCart },
      ({ toDismiss, existingCart }) => {
        const links = toDismiss.giftCardIds.map((giftCardId) => ({
          [Modules.CART]: { cart_id: existingCart.id },
          [PluginModule.LOYALTY]: { gift_card_id: giftCardId },
        }));

        return links;
      }
    );

    dismissLinksWorkflow.runAsStep({ input: linksToDismiss });

    const giftCardCodes = transform({ existingCart }, ({ existingCart }) => {
      return existingCart.gift_cards.map((gc) => gc.code);
    });

    const giftCardQuery = useQueryGraphStep({
      entity: "gift_card",
      filters: { code: giftCardCodes },
      fields: ["id", "code", "status", "currency_code"],
    }).config({ name: "get-gift-card-query" });

    const giftCards = transform({ giftCardQuery }, ({ giftCardQuery }) => {
      return giftCardQuery.data;
    });

    const giftCardsIds = transform({ giftCards }, ({ giftCards }) => {
      return giftCards.map((gc) => gc.id);
    });

    const giftCardStoreCreditAccountQuery = useQueryGraphStep({
      entity: "gift_card_store_credit_account",
      filters: {
        gift_card_id: giftCardsIds,
      },
      fields: ["id", "store_credit_account_id", "gift_card_id"],
    }).config({ name: "get-gift-card-store-credit-account-query" });

    const { giftCardStoreCreditAccountMap } = transform(
      { giftCardStoreCreditAccountQuery },
      ({ giftCardStoreCreditAccountQuery }) => {
        const giftCardStoreCreditAccountMap: Record<string, string> = {};

        for (const gcsa of giftCardStoreCreditAccountQuery.data) {
          giftCardStoreCreditAccountMap[gcsa.gift_card_id] =
            gcsa.store_credit_account_id;
        }

        return {
          giftCardStoreCreditAccountMap,
        };
      }
    );

    const giftCardsBalanceMap = retrieveGiftCardsBalanceStep({
      giftCards,
      giftCardStoreCreditAccountMap,
    });

    validateGiftCardBalancesStep({
      giftCards,
      giftCardsBalanceMap,
    });

    const updatedCardQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: [
        "id",
        "currency_code",
        "total",
        "gift_cards.code",
        "customer_id",
      ],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-cart-query" });

    const cart = transform({ updatedCardQuery }, ({ updatedCardQuery }) => {
      return updatedCardQuery.data[0];
    });

    const creditLinesToCreate = transform(
      { giftCardsBalanceMap, giftCards, cart },
      ({ giftCardsBalanceMap, giftCards, cart }) => {
        let tempCartTotal = MathBN.convert(cart.total);
        const creditLinesData: CreateCartCreditLineDTO[] = [];

        for (const giftCard of giftCards) {
          const stats = giftCardsBalanceMap[giftCard.code];
          const amount = MathBN.min(stats.balance, tempCartTotal);

          if (amount.gt(0)) {
            creditLinesData.push({
              cart_id: cart.id,
              amount: amount.toNumber(),
              reference: "gift-card",
              reference_id: giftCard.id,
              metadata: {},
            });

            tempCartTotal = tempCartTotal.minus(amount);
          }
        }

        return creditLinesData;
      }
    );

    const creditLines = createCartCreditLinesWorkflow.runAsStep({
      input: creditLinesToCreate,
    });

    const linksToCreate = transform(
      { giftCards, cart },
      ({ giftCards, cart }) => {
        const links = giftCards.map((giftCard) => ({
          [Modules.CART]: { cart_id: cart.id },
          [PluginModule.LOYALTY]: { gift_card_id: giftCard.id },
        }));

        return links;
      }
    );

    createLinksWorkflow.runAsStep({ input: linksToCreate });

    return new WorkflowResponse(creditLines);
  }
);
