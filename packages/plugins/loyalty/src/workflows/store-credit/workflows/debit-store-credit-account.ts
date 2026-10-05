import { MathBN, MedusaError } from "@medusajs/framework/utils";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { createStep, createWorkflow, transform } from "@medusajs/framework/workflows-sdk";

import { ModuleDebitStoreCreditAccount } from "../../../types/store-credit";
import { debitAccountStep } from "../steps/debit-account";

/**
 * Input to debit a specific store credit account by an amount.
 */
export type DebitStoreCreditAccountWorkflowInput = ModuleDebitStoreCreditAccount

const validateDebitStoreCreditAccountInputStep = createStep(
  "validate-debit-store-credit-account-input",
  async function (input: ModuleDebitStoreCreditAccount) {
    if (input.amount <= 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Amount must be greater than 0"
      );
    }
  }
);

/**
 * This workflow debits a specific store credit account by an amount. It validates
 * that the amount is greater than zero and that the account exists before debiting.
 * The debit is rejected if the account's balance doesn't cover the amount.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around debiting a store credit account.
 *
 * @example
 * await debitStoreCreditAccountWorkflow(container)
 *   .run({
 *     input: {
 *       account_id: "sca_123",
 *       amount: 100,
 *       note: "Credit issued by mistake",
 *       reference: "user",
 *       reference_id: "user_123",
 *     },
 *   })
 *
 * @summary
 *
 * Debit a store credit account.
 */
export const debitStoreCreditAccountWorkflow = createWorkflow(
  "debit-store-credit-account",
  function (input: DebitStoreCreditAccountWorkflowInput) {
    validateDebitStoreCreditAccountInputStep(input);

    const storeCreditAccountData = useQueryGraphStep({
      entity: "store_credit_account",
      fields: ["id", "code", "customer_id", "currency_code", "balance"],
      filters: { id: input.account_id },
      options: { throwIfKeyNotFound: true },
    });

    const debitData = transform(
      { storeCreditAccountData, input },
      ({ storeCreditAccountData, input }) => {
        return {
          account_id: storeCreditAccountData.data[0].id,
          amount: MathBN.convert(input.amount),
          note: input.note || "",
          reference: input.reference || "",
          reference_id: input.reference_id || "",
        };
      }
    );

    debitAccountStep([debitData]);
  }
);
