import { MathBN, MedusaError } from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";
import { ModuleAccountStats, ModuleGiftCard } from "src/types";

export const validateGiftCardBalancesStep = createStep(
  "validate-gift-card-balances",
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
