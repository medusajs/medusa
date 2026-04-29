import { MathBN, MedusaError } from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";
import { ModuleAccountStats, ModuleGiftCard } from "../../../types";

/**
 * Input to validate that all gift cards in a collection have a positive balance.
 */
export interface ValidateGiftCardBalancesStepInput {
  /**
   * The gift cards to validate.
   */
  giftCards: ModuleGiftCard[]
  /**
   * A map of gift card codes to their account statistics, including the current balance.
   */
  giftCardsBalanceMap: Record<string, ModuleAccountStats>
}

/**
 * This step validates that all gift cards in a collection have a positive balance.
 * It throws an error for any gift card with zero or negative balance.
 *
 * @example
 * const data = validateGiftCardBalancesStep({
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
export const validateGiftCardBalancesStep = createStep(
  "validate-gift-card-balances",
  async function ({
    giftCards,
    giftCardsBalanceMap,
  }: ValidateGiftCardBalancesStepInput) {
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
