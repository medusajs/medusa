import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
  IStoreCreditModuleService,
  ModuleCreateStoreCreditAccount,
  PluginModule,
} from "../../../types";
import { isPresent } from "@medusajs/framework/utils";

import { generateCode } from "../../../utils/code-generator";

export const createStoreCreditAccountsStep = createStep(
  "create-store-credit-accounts",
  async (input: ModuleCreateStoreCreditAccount[], { container }) => {
    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    for (const account of input) {
      if (!isPresent(account.code)) {
        account.code = generateCode("SC");
      }
    }

    const accounts = await module.createStoreCreditAccounts(input);

    return new StepResponse(
      accounts,
      accounts.map((gc) => gc.id)
    );
  },
  async (ids: string[], { container }) => {
    if (!ids?.length) {
      return;
    }

    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    await module.deleteStoreCreditAccounts(ids);
  }
);
