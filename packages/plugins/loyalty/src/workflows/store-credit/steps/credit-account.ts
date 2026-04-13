import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
  IStoreCreditModuleService,
  ModuleCreditAccount,
  PluginModule,
} from "../../../types";

export const creditAccountStep = createStep(
  "credit-account",
  async (input: ModuleCreditAccount[], { container }) => {
    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    const transactions = await module.creditAccounts(input);

    return new StepResponse(
      transactions,
      transactions.map((t) => t.id)
    );
  },
  async (ids: string[], { container }) => {
    if (!ids?.length) {
      return;
    }

    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    await module.deleteTransactions(ids);
  }
);
