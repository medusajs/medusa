import { StepResponse } from "@medusajs/framework/workflows-sdk";

import { createStep } from "@medusajs/framework/workflows-sdk";
import { PluginModule } from "../../../types";
import { ModuleGiftCard } from "../../../types/loyalty";
import {
  IStoreCreditModuleService,
  ModuleAccountStats,
} from "../../../types/store-credit";

/**
 * Input to retrieve the balance of gift cards from their associated store credit accounts.
 */
export interface RetrieveGiftCardsBalanceStepInput {
  /**
   * A map of gift card IDs to their associated store credit account IDs.
   */
  giftCardStoreCreditAccountMap: Record<string, string>
  /**
   * The gift cards whose balances should be retrieved.
   */
  giftCards: ModuleGiftCard[]
}

/**
 * This step retrieves the balance of gift cards from their associated store credit accounts.
 * Returns a map of gift card codes to their account stats.
 *
 * @example
 * const data = retrieveGiftCardsBalanceStep({
 *   giftCards: [
 *     {
 *       id: "gc_123",
 *       code: "GC-XXXX",
 *       // other gift card properties...
 *     }
 *   ],
 *   giftCardStoreCreditAccountMap: { "gc_123": "sca_456" },
 * })
 */
export const retrieveGiftCardsBalanceStep = createStep(
  "retrieve-gift-cards-balance",
  async function (
    {
      giftCardStoreCreditAccountMap,
      giftCards,
    }: RetrieveGiftCardsBalanceStepInput,
    { container }
  ) {
    const accountBalanceMap: Record<string, ModuleAccountStats> = {};
    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    for (const giftCard of giftCards) {
      const giftCardBalance = await module.retrieveAccountStats({
        account_id: giftCardStoreCreditAccountMap[giftCard.id],
      });

      accountBalanceMap[giftCard.code] = giftCardBalance;
    }

    return new StepResponse(accountBalanceMap);
  }
);
