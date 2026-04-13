import { MathBN, MedusaError } from "@medusajs/framework/utils";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { ModuleGiftCard } from "../../../types/loyalty";
import { ModuleAccountStats } from "../../../types/store-credit";
import { debitAccountsWorkflow } from "../../store-credit/workflows/debit-accounts";

export const validateStoreCreditAccountStep = createStep(
  "validate-store-credit-account",
  async function ({
    giftCards,
    giftCardsBalanceMap,
  }: {
    giftCards: ModuleGiftCard[];
    giftCardsBalanceMap: Record<string, ModuleAccountStats>;
  }) {
    for (const giftCard of giftCards) {
      const stats = giftCardsBalanceMap[giftCard.code];

      if (MathBN.convert(stats.balance).lte(0)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Gift card (${giftCard.code}) has no balance`
        );
      }
    }
  }
);

/*
  A workflow that confirms the credit lines of a cart
*/
export const confirmCartCreditLinesWorkflow = createWorkflow(
  "confirm-cart-credit-lines",
  function (input: { cart_id: string }) {
    const cartQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: [
        "id",
        "customer_id",
        "currency_code",
        "credit_lines.id",
        "credit_lines.reference",
        "credit_lines.reference_id",
        "credit_lines.amount",
        "gift_cards.code",
      ],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-existing-cart-query" });

    const cart = transform({ cartQuery }, ({ cartQuery }) => {
      return cartQuery.data[0];
    });

    const giftCardIds = transform({ cart }, ({ cart }) => {
      return cart.gift_cards.map((gc) => gc.id);
    });

    const giftCardQuery = useQueryGraphStep({
      entity: "gift_card",
      filters: { id: giftCardIds },
      fields: ["id", "code", "status", "currency_code"],
    }).config({ name: "get-gift-card-query" });

    const giftCards = transform({ giftCardQuery }, ({ giftCardQuery }) => {
      return giftCardQuery.data;
    });

    const storeCreditAccountsQuery = useQueryGraphStep({
      entity: "gift_card_store_credit_account",
      filters: { gift_card_id: giftCardIds },
      fields: ["gift_card_id", "store_credit_account_id"],
    }).config({ name: "get-store-credit-account-query" });

    const storeCreditAccountsMap = transform(
      { storeCreditAccountsQuery },
      ({ storeCreditAccountsQuery }) => {
        return storeCreditAccountsQuery.data.reduce((acc, curr) => {
          acc[curr.gift_card_id] = curr.store_credit_account_id;
          return acc;
        }, {} as Record<string, string>);
      }
    );

    const debitAccountsInput = transform(
      { cart, storeCreditAccountsMap },
      ({ cart, storeCreditAccountsMap }) => {
        return (cart.credit_lines || [])
          .filter(
            (cl) =>
              cl.reference === "store-credit" || cl.reference === "gift-card"
          )
          .map((cl) => {
            const storeCreditAccount = storeCreditAccountsMap[cl.reference_id];

            return {
              account_id: storeCreditAccount || cl.reference_id,
              amount: cl.amount,
              reference: "cart",
              reference_id: cart.id,
              note: "Gift card usage",
            };
          });
      }
    );

    debitAccountsWorkflow.runAsStep({
      input: debitAccountsInput,
    });

    return new WorkflowResponse([]);
  }
);
