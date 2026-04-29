import { isPresent, MedusaError } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { ModuleCreateStoreCreditAccount } from "../../../types/store-credit";
import { createStoreCreditAccountsStep } from "../steps/create-store-credit-accounts";

/**
 * This step validates the input for creating store credit accounts. It throws an
 * error if no input is provided or if any entry is missing a currency code.
 *
 * @example
 * const data = validateStoreCreditAccountInputStep([
 *   { customer_id: "cust_123", currency_code: "usd" },
 * ])
 */
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

/**
 * Data for creating a store credit account for a customer.
 */
export type CreateStoreCreditAccountsWorkflowInput = {
  /**
   * An optional code for the store credit account. If not provided, one is auto-generated.
   */
  code?: string
  /**
   * The ID of the customer who owns the store credit account.
   */
  customer_id: string
  /**
   * The currency of the store credit account.
   */
  currency_code: string
}[]

/**
 * This workflow creates one or more store credit accounts after validating the input.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around store credit account creation.
 *
 * @example
 * const { result } = await createStoreCreditAccountsWorkflow(container)
 *   .run({
 *     input: [
 *       {
 *         customer_id: "cust_123",
 *         currency_code: "usd",
 *       },
 *     ],
 *   })
 *
 * @summary
 *
 * Create store credit accounts.
 */
export const createStoreCreditAccountsWorkflow = createWorkflow(
  "create-store-credit-accounts",
  function (input: CreateStoreCreditAccountsWorkflowInput) {
    validateStoreCreditAccountInputStep(input);

    const createdStoreCreditAccounts = createStoreCreditAccountsStep(input);
    return new WorkflowResponse(createdStoreCreditAccounts);
  }
);
