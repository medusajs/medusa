import crypto from "crypto";

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

type ClaimStoreCreditAccountInput = {
  code: string;
  customer_id: string;
};

export const validateClaimStoreCreditAccountInputStep = createStep(
  "validate-claim-store-credit-account-input",
  async function (args: {
    input: ClaimStoreCreditAccountInput;
    customer: CustomerDTO;
  }) {
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

const validateSourceStoreCreditAccountsStep = createStep(
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
/*
  A workflow that claims a store credit account for a customer.
  The account with `code` is debited and customer account is credited.
*/
export const claimStoreCreditAccountWorkflow = createWorkflow(
  "claim-store-credit-account",
  function (input: ClaimStoreCreditAccountInput) {
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
