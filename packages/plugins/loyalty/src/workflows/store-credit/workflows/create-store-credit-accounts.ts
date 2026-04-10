import { isPresent, MedusaError } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { ModuleCreateStoreCreditAccount } from "../../../types/store-credit";
import { createStoreCreditAccountsStep } from "../steps/create-store-credit-accounts";
import { generateCode } from "../../../utils/code-generator";

export const validateStoreCreditAccountInputStep = createStep(
  "validate-store-credit-account-input",
  async function (input: ModuleCreateStoreCreditAccount[]) {
    if (input.length === 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No input provided"
      );
    }

    if (input.some((i) => !isPresent(i.currency_code))) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Currency code is required to create a store credit account"
      );
    }
  }
);

type CreateStoreCreditAccountInput = {
  code?: string;
  customer_id: string;
  currency_code: string;
};

/*
  A workflow that creates store credit accounts
*/
export const createStoreCreditAccountsWorkflow = createWorkflow(
  "create-store-credit-accounts",
  function (input: CreateStoreCreditAccountInput[]) {
    validateStoreCreditAccountInputStep(input);

    const createdStoreCreditAccounts = createStoreCreditAccountsStep(input);
    return new WorkflowResponse(createdStoreCreditAccounts);
  }
);
