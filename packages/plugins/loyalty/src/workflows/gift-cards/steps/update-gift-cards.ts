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

/*
  A step to update gift cards.
  
  The first function attempts to update gift cards, while the second function attempts to revert the update.
  The first function is also in charge of preparing the data to be reverted in the second function.
*/
export const updateGiftCardsStep = createStep(
  "update-gift-cards",
  async (data: ModuleUpdateGiftCard[], { container }) => {
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
