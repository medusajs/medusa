import { isPresent } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
  ILoyaltyModuleService,
  ModuleCreateGiftCard,
  PluginModule,
} from "../../../types";
import { generateCode } from "../../../utils/code-generator";

/**
 * Data for creating one or more gift cards in the Loyalty module.
 */
export type CreateGiftCardsStepInput = ModuleCreateGiftCard[]

/**
 * This step creates gift cards. If no code is provided for
 * a gift card, a unique code is automatically generated. The step supports rollback
 * by deleting the created gift cards.
 *
 * @example
 * const data = createGiftCardsStep([
 *   {
 *     value: 100,
 *     currency_code: "usd",
 *     // other gift card properties...
 *   },
 * ])
 */
export const createGiftCardsStep = createStep(
  "create-gift-cards",
  async (input: CreateGiftCardsStepInput, { container }) => {
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
  async (ids, { container }) => {
    if (!ids?.length) {
      return;
    }

    const module = container.resolve<ILoyaltyModuleService>(
      PluginModule.LOYALTY
    );

    await module.deleteGiftCards(ids);
  }
);
