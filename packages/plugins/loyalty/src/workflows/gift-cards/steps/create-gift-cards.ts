import { isPresent } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
  ILoyaltyModuleService,
  ModuleCreateGiftCard,
  PluginModule,
} from "../../../types";
import { generateCode } from "../../../utils/code-generator";

export const createGiftCardsStep = createStep(
  "create-gift-cards",
  async (input: ModuleCreateGiftCard[], { container }) => {
    const module = container.resolve<ILoyaltyModuleService>(
      PluginModule.LOYALTY
    );

    for (const giftCard of input) {
      if (!isPresent(giftCard.code)) {
        giftCard.code = generateCode();
      }
    }

    const giftCards = await module.createGiftCards(input);

    return new StepResponse(
      giftCards,
      giftCards.map((gc) => gc.id)
    );
  },
  async (ids: string[], { container }) => {
    if (!ids?.length) {
      return;
    }

    const module = container.resolve<ILoyaltyModuleService>(
      PluginModule.LOYALTY
    );

    await module.deleteGiftCards(ids);
  }
);
