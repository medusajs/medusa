import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
  IStoreCreditModuleService,
  ModuleCreditAccount,
  PluginModule,
} from "../../../types";

/**
 * Data for crediting one or more store credit accounts.
 */
export type CreditAccountStepInput = ModuleCreditAccount[]

/**
 * This step credits one or more store credit accounts with transactions.
 * The step supports rollback by deleting the created transactions.
 *
 * @example
 * const data = creditAccountStep([
 *   {
 *     account_id: "sca_123",
 *     amount: 100,
 *     reference: "gift_card",
 *     reference_id: "gc_123",
 *   },
 * ])
 */
export const creditAccountStep = createStep(
  "credit-account",
  async (input: CreditAccountStepInput, { container }) => {
    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    const transactions = await module.creditAccounts(input);

    return new StepResponse(
      transactions,
      transactions.map((t) => t.id)
    );
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return;
    }

    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    await module.deleteTransactions(ids);
  }
);
