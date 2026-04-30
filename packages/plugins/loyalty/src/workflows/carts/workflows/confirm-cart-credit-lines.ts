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

/**
 * Input to validate that all gift cards on a cart have a positive balance.
 */
export interface ValidateStoreCreditAccountStepInput {
  /**
   * The gift cards to validate.
   */
  giftCards: ModuleGiftCard[]
  /**
   * A map of gift card codes to their current account statistics.
   */
  giftCardsBalanceMap: Record<string, ModuleAccountStats>
}

/**
 * This step validates that all gift cards on the cart have a positive balance.
 * It throws an error for any gift card with zero or negative balance.
 *
 * @example
 * const data = validateStoreCreditAccountStep({
 *   giftCards: [
 *     {
 *       id: "gc_123",
 *       code: "GC-XXXX",
 *       // other gift card properties...
 *     }
 *   ],
 *   giftCardsBalanceMap: {
 *     "GC-XXXX": {
 *       balance: 100,
 *       credit: 150,
 *       debit: 50,
 *     }
 *   },
 * })
 */
export const validateStoreCreditAccountStep = createStep(
  "validate-store-credit-account",
  async function ({
    giftCards,
    giftCardsBalanceMap,
  }: ValidateStoreCreditAccountStepInput) {
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

/**
 * Input to confirm and debit the credit lines on a cart.
 */
export interface ConfirmCartCreditLinesWorkflowInput {
  /**
   * The ID of the cart whose credit lines should be confirmed and debited.
   */
  cart_id: string
}

/**
 * This workflow confirms the credit lines of a cart by debiting the associated
 * store credit and gift card accounts for the credit line amounts. It is typically
 * called before payment authorization to lock in the store credit usage.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around confirming cart credit lines.
 *
 * @example
 * const { result } = await confirmCartCreditLinesWorkflow(container)
 *   .run({
 *     input: {
 *       cart_id: "cart_123",
 *     },
 *   })
 *
 * @summary
 *
 * Confirm and debit the credit lines on a cart.
 */
export const confirmCartCreditLinesWorkflow = createWorkflow(
  "confirm-cart-credit-lines",
  function (input: ConfirmCartCreditLinesWorkflowInput) {
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
