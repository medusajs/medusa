import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils";
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";
import {
  ILoyaltyModuleService,
  ModuleUpdateGiftCard,
  PluginModule,
} from "../../../types";

/**
 * Data for updating one or more gift cards in the Loyalty module.
 */
export type UpdateGiftCardsStepInput = ModuleUpdateGiftCard[]

/**
 * This step updates gift cards. It stores the previous state of the gift cards
 * before the update to enable rollback.
 *
 * @example
 * const data = updateGiftCardsStep([
 *   {
 *     id: "gc_123",
 *     status: GiftCardStatus.REDEEMED,
 *     // other updatable gift card properties...
 *   },
 * ])
 */
export const updateGiftCardsStep = createStep(
  "update-gift-cards",
  async (data: UpdateGiftCardsStepInput, { container }) => {
    const loyaltyModule = container.resolve<ILoyaltyModuleService>(
      PluginModule.LOYALTY
    );
    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data);

    const dataBeforeUpdate = await loyaltyModule.listGiftCards(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    );

    const updatedGiftCards = await loyaltyModule.updateGiftCards(data);

    return new StepResponse(updatedGiftCards, {
      dataBeforeUpdate,
      selects,
      relations,
    });
  },
  async (revertInput, { container }) => {
    if (!revertInput) {
      return;
    }

    const { dataBeforeUpdate, selects, relations } = revertInput;
    const loyaltyModule = container.resolve<ILoyaltyModuleService>(
      PluginModule.LOYALTY
    );

    const revertData = dataBeforeUpdate.map((data) =>
      convertItemResponseToUpdateRequest(data, selects, relations)
    );

    if (revertData.length) {
      await loyaltyModule.updateGiftCards(revertData);
    }
  }
);
