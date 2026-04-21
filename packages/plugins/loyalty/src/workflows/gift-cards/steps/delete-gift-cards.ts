import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PluginModule } from "../../../types";

/**
 * Input to delete gift cards by their IDs.
 */
export interface DeleteGiftCardsStepInput {
  /**
   * The IDs of the gift cards to delete.
   */
  id: string[]
}

/**
 * This step deletes gift cards by their IDs. The step supports rollback by
 * restoring the deleted gift cards.
 *
 * @example
 * const data = deleteGiftCardsStep({ id: ["gc_123"] })
 */
export const deleteGiftCardsStep = createStep(
  "delete-gift-cards",
  async function ({ id }: DeleteGiftCardsStepInput, { container }) {
    const module = container.resolve<any>(PluginModule.STORE_CREDIT);

    await module.deleteGiftCards({ id });

    return new StepResponse(id, id);
  },
  async (id, { container }) => {
    if (!id?.length) {
      return;
    }

    const module = container.resolve<any>(PluginModule.STORE_CREDIT);

    await module.restoreGiftCards({ id });
  }
);
