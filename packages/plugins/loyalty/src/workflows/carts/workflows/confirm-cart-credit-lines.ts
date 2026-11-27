import { MathBN, MedusaError } from "@medusajs/framework/utils";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { ModuleGiftCard } from "../../../types/loyalty";
import {
  ModuleAccountStats,
  ModuleStoreCreditAccount,
} from "../../../types/store-credit";
import { isGiftCardExpired } from "../../../utils/gift-card";
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
 * Input to validate that none of the gift cards applied to a cart have expired.
 */
export interface ValidateGiftCardsNotExpiredStepInput {
  /**
   * The gift cards applied to the cart.
   */
  giftCards: Pick<ModuleGiftCard, "code" | "expires_at">[]
}

/**
 * This step validates that none of the gift cards applied to the cart have
 * expired. It throws an error for any gift card whose expiration date has
 * passed, preventing its remaining balance from being debited at checkout.
 *
 * @example
 * const data = validateGiftCardsNotExpiredStep({
 *   giftCards: [
 *     {
 *       code: "GC-XXXX",
 *       expires_at: null,
 *       // other gift card properties...
 *     }
 *   ],
 * })
 */
export const validateGiftCardsNotExpiredStep = createStep(
  "validate-gift-cards-not-expired",
  async function ({ giftCards }: ValidateGiftCardsNotExpiredStepInput) {
    for (const giftCard of giftCards) {
      if (isGiftCardExpired(giftCard)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Gift card (${giftCard.code}) has expired`
        );
      }
    }
  }
);

/**
 * Input to validate that the accounts debited for a cart are in its currency.
 */
export interface ValidateCreditAccountsCurrencyStepInput {
  /**
   * The cart whose credit lines are being confirmed.
   */
  cart: { currency_code: string }
  /**
   * The IDs of the store credit accounts that the cart's credit lines debit.
   */
  accountIds: string[]
  /**
   * The store credit accounts retrieved for those IDs.
   */
  storeCreditAccounts: Pick<ModuleStoreCreditAccount, "id" | "currency_code">[]
}

/**
 * This step validates that every store credit account debited for a cart is in
 * the cart's currency. It throws an error for any account that is in another
 * currency or that doesn't exist, preventing a balance from being spent at face
 * value in a different currency.
 *
 * @example
 * const data = validateCreditAccountsCurrencyStep({
 *   cart: { currency_code: "usd" },
 *   accountIds: ["sca_123"],
 *   storeCreditAccounts: [
 *     {
 *       id: "sca_123",
 *       currency_code: "usd",
 *     }
 *   ],
 * })
 */
export const validateCreditAccountsCurrencyStep = createStep(
  "validate-credit-accounts-currency",
  async function ({
    cart,
    accountIds,
    storeCreditAccounts,
  }: ValidateCreditAccountsCurrencyStepInput) {
    const currencies = new Map(
      storeCreditAccounts.map((account) => [account.id, account.currency_code])
    );

    for (const accountId of accountIds) {
      if (currencies.get(accountId) !== cart.currency_code) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Store credit account (${accountId}) currency does not match cart currency`
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
        "gift_cards.id",
        "gift_cards.code",
        "gift_cards.expires_at",
      ],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-existing-cart-query" });

    const cart = transform({ cartQuery }, ({ cartQuery }) => {
      return cartQuery.data[0];
    });

    validateGiftCardsNotExpiredStep({ giftCards: cart.gift_cards });

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
              note:
                cl.reference === "gift-card"
                  ? "Gift card usage"
                  : "Store credit usage",
            };
          });
      }
    );

    const accountIds = transform(
      { debitAccountsInput },
      ({ debitAccountsInput }) => {
        return debitAccountsInput.map((debit) => debit.account_id);
      }
    );

    const debitedAccountsQuery = useQueryGraphStep({
      entity: "store_credit_account",
      filters: { id: accountIds },
      fields: ["id", "currency_code"],
    }).config({ name: "get-debited-store-credit-accounts-query" });

    validateCreditAccountsCurrencyStep({
      cart,
      accountIds,
      storeCreditAccounts: debitedAccountsQuery.data,
    });

    debitAccountsWorkflow.runAsStep({
      input: debitAccountsInput,
    });

    return new WorkflowResponse([]);
  }
);
