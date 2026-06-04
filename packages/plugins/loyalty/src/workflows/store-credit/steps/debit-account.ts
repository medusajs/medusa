import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
  IStoreCreditModuleService,
  ModuleDebitAccount,
  PluginModule,
} from "../../../types";

/**
 * Data for debiting one or more store credit accounts.
 */
export type DebitAccountStepInput = ModuleDebitAccount[]

/**
 * This step debits one or more store credit accounts by creating debit transactions.
 * The step supports rollback by deleting the created transactions.
 *
 * @example
 * const data = debitAccountStep([
 *   {
 *     account_id: "sca_123",
 *     amount: 50,
 *     reference: "cart",
 *     reference_id: "cart_123",
 *   },
 * ])
 */
export const debitAccountStep = createStep(
  "debit-account",
  async (input: DebitAccountStepInput, { container }) => {
    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    const transactions = await module.debitAccounts(input);

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
