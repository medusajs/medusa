import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PluginModule } from "../../../types";

export const deleteGiftCardsStep = createStep(
  "delete-gift-cards",
  async function ({ id }: { id: string[] }, { container }) {
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
