import { StepResponse } from "@medusajs/framework/workflows-sdk";

import { createStep } from "@medusajs/framework/workflows-sdk";
import { PluginModule } from "../../../types";
import { ModuleGiftCard } from "../../../types/loyalty";
import {
  IStoreCreditModuleService,
  ModuleAccountStats,
} from "../../../types/store-credit";

export const retrieveGiftCardsBalanceStep = createStep(
  "retrieve-gift-cards-balance",
  async function (
    {
      giftCardStoreCreditAccountMap,
      giftCards,
    }: {
      giftCardStoreCreditAccountMap: Record<string, string>;
      giftCards: ModuleGiftCard[];
    },
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
