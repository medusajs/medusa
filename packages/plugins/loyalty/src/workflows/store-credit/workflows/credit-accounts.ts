import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { ModuleCreditAccount } from "../../../types/store-credit";
import { creditAccountStep } from "../steps/credit-account";

/*
  A workflow that credits to a store credit account
*/
export const creditAccountsWorkflow = createWorkflow(
  "credit-accounts",
  function (input: ModuleCreditAccount[]) {
    return new WorkflowResponse(creditAccountStep(input));
  }
);
