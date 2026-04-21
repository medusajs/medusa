import { MathBN, MedusaError } from "@medusajs/framework/utils";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { createStep, createWorkflow, transform } from "@medusajs/framework/workflows-sdk";

import { ModuleCreditStoreCreditAccount } from "../../../../src/types/store-credit";
import { creditAccountStep } from "../steps/credit-account";

/**
 * Input to credit a specific store credit account with an amount.
 */
export type CreditStoreCreditAccountWorkflowInput = ModuleCreditStoreCreditAccount

const validateStoreCreditAccountInputStep = createStep(
  "validate-store-credit-account-input",
  async function (input: ModuleCreditStoreCreditAccount) {
    if (input.amount <= 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Amount must be greater than 0"
      );
    }
  }
);

/**
 * This workflow credits a specific store credit account with an amount. It validates
 * that the amount is greater than zero and that the account exists before crediting.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around crediting a store credit account.
 *
 * @example
 * await creditStoreCreditAccountWorkflow(container)
 *   .run({
 *     input: {
 *       account_id: "sca_123",
 *       amount: 100,
 *       note: "Loyalty reward",
 *       reference: "order",
 *       reference_id: "order_123",
 *     },
 *   })
 *
 * @summary
 *
 * Credit a store credit account.
 */
export const creditStoreCreditAccountWorkflow = createWorkflow(
  "credit-store-credit-account",
  function (input: CreditStoreCreditAccountWorkflowInput) {
    validateStoreCreditAccountInputStep(input);

    const storeCreditAccountData = useQueryGraphStep({
      entity: "store_credit_account",
      fields: ["id", "code", "customer_id", "currency_code", "balance"],
      filters: { id: input.account_id },
      options: { throwIfKeyNotFound: true },
    });

    const storeCreditAccount = transform(
      { storeCreditAccountData },
      ({ storeCreditAccountData }) => {
        return storeCreditAccountData.data[0];
      }
    );

    const amount = transform({ input }, ({ input }) => {
      return MathBN.convert(input.amount);
    });

    const transactionInfo = transform({ input }, ({ input }) => {
      return {
        note: input.note || "",
        reference: input.reference || "",
        reference_id: input.reference_id || "",
      };
    });

    creditAccountStep([
      {
        account_id: storeCreditAccount.id,
        amount: amount,
        note: transactionInfo.note,
        reference: transactionInfo.reference,
        reference_id: transactionInfo.reference_id,
      },
    ]);
  }
);
