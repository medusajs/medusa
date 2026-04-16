import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
  IStoreCreditModuleService,
  ModuleDebitAccount,
  PluginModule,
} from "../../../types";

export const debitAccountStep = createStep(
  "debit-account",
  async (input: ModuleDebitAccount[], { container }) => {
    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    const transactions = await module.debitAccounts(input);

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
