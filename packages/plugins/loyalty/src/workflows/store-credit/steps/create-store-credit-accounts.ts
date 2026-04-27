import { createStep, StepResponse, WorkflowData } from "@medusajs/framework/workflows-sdk";
import {
  IStoreCreditModuleService,
  ModuleCreateStoreCreditAccount,
  PluginModule,
} from "../../../types";
import { isPresent } from "@medusajs/framework/utils";

import { generateCode } from "../../../utils/code-generator";

/**
 * Data for creating one or more store credit accounts.
 */
export type CreateStoreCreditAccountsStepInput = ModuleCreateStoreCreditAccount[]

/**
 * This step creates store credit accounts. If no code is provided, a unique code
 * prefixed with "SC" is automatically generated. The step supports rollback by
 * deleting the created accounts.
 *
 * @example
 * const data = createStoreCreditAccountsStep([
 *   {
 *     currency_code: "usd",
 *     customer_id: "cust_123",
 *   },
 * ])
 */
export const createStoreCreditAccountsStep = createStep(
  "create-store-credit-accounts",
  async (input: CreateStoreCreditAccountsStepInput, { container }) => {
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
  async (ids, { container }) => {
    if (!ids?.length) {
      return;
    }

    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    await module.deleteStoreCreditAccounts(ids);
  }
);
