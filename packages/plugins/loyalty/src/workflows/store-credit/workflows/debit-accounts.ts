import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { ModuleDebitAccount } from "../../../types/store-credit";
import { debitAccountStep } from "../steps/debit-account";

/**
 * Data for debiting one or more store credit accounts.
 */
export type DebitAccountsWorkflowInput = ModuleDebitAccount[]

/**
 * This workflow debits one or more store credit accounts by creating debit transactions.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around debiting store credit accounts.
 *
 * @example
 * const { result } = await debitAccountsWorkflow(container)
 *   .run({
 *     input: [
 *       {
 *         account_id: "sca_123",
 *         amount: 50,
 *         reference: "cart",
 *         reference_id: "cart_123",
 *       },
 *     ],
 *   })
 *
 * @summary
 *
 * Debit one or more store credit accounts.
 */
export const debitAccountsWorkflow = createWorkflow(
  "debit-accounts",
  function (input: DebitAccountsWorkflowInput) {
    return new WorkflowResponse(debitAccountStep(input));
  }
);
