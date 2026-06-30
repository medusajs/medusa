import { isPresent, MathBN, MedusaError } from "@medusajs/framework/utils";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import {
  createStep,
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { CustomerDTO } from "@medusajs/framework/types";

import { ModuleStoreCreditAccount } from "../../../types";
import { debitAccountStep } from "../steps/debit-account";
import { creditAccountStep } from "../steps/credit-account";
import { createStoreCreditAccountsStep } from "../steps/create-store-credit-accounts";

/**
 * Input to claim an anonymous store credit account for a customer.
 */
export type ClaimStoreCreditAccountWorkflowInput = {
  /**
   * The code of the anonymous store credit account to claim.
   */
  code: string
  /**
   * The ID of the customer claiming the store credit account.
   */
  customer_id: string
}

/**
 * Input to validate that a store credit account claim request is valid.
 */
export interface ValidateClaimStoreCreditAccountInputStepInput {
  /**
   * The claim request to validate.
   */
  input: ClaimStoreCreditAccountWorkflowInput
  /**
   * The customer attempting to claim the store credit account.
   */
  customer: CustomerDTO
}

/**
 * This step validates the input for claiming a store credit account. It throws an
 * error if the code or customer ID is missing, or if the customer does not have a
 * registered account.
 *
 * @example
 * const data = validateClaimStoreCreditAccountInputStep({
 *   input: { code: "SC-XXXX", customer_id: "cust_123" },
 *   customer: {
 *     has_account: true
 *     // other customer properties...
 *   },
 * })
 */
export const validateClaimStoreCreditAccountInputStep = createStep(
  "validate-claim-store-credit-account-input",
  async function (args: ValidateClaimStoreCreditAccountInputStepInput) {
    const { input, customer } = args;

    if (!isPresent(input.code)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Code is required to claim a store credit account"
      );
    }

    if (!input.customer_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Customer Id is required to claim a store credit account"
      );
    }

    if (!customer.has_account) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Only customers with an account can claim a store credit account"
      );
    }
  }
);

/**
 * This step validates that the source store credit account can be claimed by the customer. It checks that
 * the source account is not already owned by the customer, that it does not belong to another customer, and
 * that it has a balance greater than 0. It throws an error if any of these conditions are not met.
 * 
 * @example
 * validateSourceStoreCreditAccountsStep({
 *   sourceStoreCreditAccount: {
 *     id: "sca_123",
 *     customer_id: null,
 *     balance: 1000,
 *     // other store credit account properties...
 *   },
 *   targetStoreCreditAccount: {
 *     id: "sca_456",
 *     customer_id: "cust_123",
 *     balance: 500,
 *     // other store credit account properties...
 *   },
 * })
 */
export const validateSourceStoreCreditAccountsStep = createStep(
  "validate-source-store-credit-account",
  async function (args: {
    sourceStoreCreditAccount: ModuleStoreCreditAccount;
    targetStoreCreditAccount: ModuleStoreCreditAccount;
  }) {
    const { sourceStoreCreditAccount, targetStoreCreditAccount } = args;

    if (sourceStoreCreditAccount.id === targetStoreCreditAccount.id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Customer already owns the store credit account"
      );
    }

    if (sourceStoreCreditAccount.customer_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot claim a store credit account that belongs to a customer"
      );
    }

    if (MathBN.convert(sourceStoreCreditAccount.balance).lte(0)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot claim a store credit account with no balance"
      );
    }
  }
);
/**
 * This workflow claims an anonymous store credit account for a customer. It transfers
 * the balance from the source account (identified by code) to the customer's store credit
 * account in the same currency. If the customer does not have an account in that currency,
 * a new one is created. The customer must have a registered account to claim.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around claiming store credit accounts.
 *
 * @example
 * await claimStoreCreditAccountWorkflow(container)
 *   .run({
 *     input: {
 *       code: "SC-XXXX-XXXX",
 *       customer_id: "cust_123",
 *     },
 *   })
 *
 * @summary
 *
 * Claim an anonymous store credit account for a customer.
 */
export const claimStoreCreditAccountWorkflow = createWorkflow(
  "claim-store-credit-account",
  function (input: ClaimStoreCreditAccountWorkflowInput) {
    const sourceStoreCreditAccountData = useQueryGraphStep({
      entity: "store_credit_account",
      fields: ["id", "code", "customer_id", "currency_code", "balance"],
      filters: { code: input.code },
    }).config({
      name: "source-store-credit-account-data",
    });

    const sourceStoreCreditAccount = transform(
      { sourceStoreCreditAccountData },
      ({ sourceStoreCreditAccountData }) => {
        return sourceStoreCreditAccountData.data[0];
      }
    );

    const accountCurrencyCode = transform(
      { sourceStoreCreditAccount },
      ({ sourceStoreCreditAccount }) => {
        return sourceStoreCreditAccount.currency_code;
      }
    );

    const customerData = useQueryGraphStep({
      entity: "customer",
      fields: ["id", "email", "has_account"],
      filters: { id: input.customer_id },
    }).config({
      name: "customer-data",
    });

    const customer = transform({ customerData }, ({ customerData }) => {
      return customerData.data[0];
    });

    validateClaimStoreCreditAccountInputStep({ input, customer });

    const existingCustomerStoreCreditAccountData = useQueryGraphStep({
      entity: "store_credit_account",
      fields: ["id", "code", "customer_id", "currency_code", "balance"],
      filters: {
        customer_id: input.customer_id,
        currency_code: accountCurrencyCode,
      },
    }).config({
      name: "existing-customer-store-credit-account-data",
    });

    const existingCustomerStoreCreditAccount = transform(
      { existingCustomerStoreCreditAccountData },
      ({ existingCustomerStoreCreditAccountData }) => {
        return existingCustomerStoreCreditAccountData.data[0];
      }
    );

    const createdStoreCreditAccount = when(
      "store-account-does-not-exist",
      { existingCustomerStoreCreditAccount },
      ({ existingCustomerStoreCreditAccount }) =>
        !existingCustomerStoreCreditAccount
    ).then(() => {
      return createStoreCreditAccountsStep([
        {
          customer_id: input.customer_id,
          currency_code: sourceStoreCreditAccount.currency_code,
        },
      ])[0];
    });

    const targetStoreCreditAccount = transform(
      {
        existingCustomerStoreCreditAccount,
        createdStoreCreditAccount,
      },
      ({ existingCustomerStoreCreditAccount, createdStoreCreditAccount }) => {
        return existingCustomerStoreCreditAccount || createdStoreCreditAccount;
      }
    );

    const balanceToTransfer = transform(
      {
        sourceStoreCreditAccount,
      },
      ({ sourceStoreCreditAccount }) => {
        return MathBN.convert(sourceStoreCreditAccount.balance);
      }
    );

    validateSourceStoreCreditAccountsStep({
      sourceStoreCreditAccount,
      targetStoreCreditAccount,
    });

    debitAccountStep([
      {
        account_id: sourceStoreCreditAccount.id,
        amount: balanceToTransfer,
        reference: "store-credit",
        reference_id: targetStoreCreditAccount.id,
      },
    ]);

    creditAccountStep([
      {
        account_id: targetStoreCreditAccount.id,
        amount: balanceToTransfer,
        reference: "store-credit",
        reference_id: sourceStoreCreditAccount.id,
      },
    ]);

    return new WorkflowResponse(void 0);
  }
);
