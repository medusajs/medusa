import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { ModuleCreditAccount } from "../../../types/store-credit";
import { creditAccountStep } from "../steps/credit-account";

/**
 * Data for crediting one or more store credit accounts.
 */
export type CreditAccountsWorkflowInput = ModuleCreditAccount[]

/**
 * This workflow credits one or more store credit accounts with transactions.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around crediting store credit accounts.
 *
 * @example
 * const { result } = await creditAccountsWorkflow(container)
 *   .run({
 *     input: [
 *       {
 *         account_id: "sca_123",
 *         amount: 100,
 *         reference: "gift_card",
 *         reference_id: "gc_123",
 *       },
 *     ],
 *   })
 *
 * @summary
 *
 * Credit one or more store credit accounts.
 */
export const creditAccountsWorkflow = createWorkflow(
  "credit-accounts",
  function (input: CreditAccountsWorkflowInput) {
    return new WorkflowResponse(creditAccountStep(input));
  }
);
