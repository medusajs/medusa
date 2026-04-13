import { MedusaError } from "@medusajs/framework/utils";
import {
  createLinksWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";
import {
  createStep,
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  GiftCardStatus,
  ModuleGiftCard,
  ModuleStoreCreditAccount,
  PluginModule,
  RedeemGiftCardWorkflowInput,
} from "../../../types";
import { createStoreCreditAccountsStep } from "../../store-credit/steps/create-store-credit-accounts";
import { creditAccountsWorkflow } from "../../store-credit/workflows/credit-accounts";
import { updateGiftCardsWorkflow } from "./update-gift-cards";

export const validateGiftCardRedeemStep = createStep(
  "validate-gift-card-redeem",
  async function ({
    giftCardStoreCreditAccount,
    giftCard,
    input,
  }: {
    giftCardStoreCreditAccount: ModuleStoreCreditAccount;
    giftCard: ModuleGiftCard;
    input: RedeemGiftCardWorkflowInput;
  }) {
    if (giftCard.status === GiftCardStatus.REDEEMED) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Gift card is already redeemed"
      );
    }

    if (giftCardStoreCreditAccount) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Gift card already has a store credit account"
      );
    }
  }
);

/**
 * A workflow that creates an anonymous store credit account for a gift card
 *
 * @param input - The input for the workflow
 * @returns The workflow response
 */
export const redeemGiftCardWorkflow = createWorkflow(
  "redeem-gift-card",
  function (input: RedeemGiftCardWorkflowInput) {
    const giftCardQuery = useQueryGraphStep({
      entity: "gift_card",
      filters: { id: input.gift_card_id },
      fields: ["id", "code", "status", "value", "currency_code"],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-gift-card-query" });

    const giftCard = transform({ giftCardQuery }, ({ giftCardQuery }) => {
      return giftCardQuery.data[0];
    });

    const giftCardStoreCreditAccountQuery = useQueryGraphStep({
      entity: "gift_card_store_credit_account",
      filters: {
        gift_card_id: giftCard.id,
      },
      fields: ["id", "store_credit_account_id"],
    }).config({ name: "get-gift-card-store-credit-account-query" });

    const giftCardStoreCreditAccount = transform(
      { giftCardStoreCreditAccountQuery },
      ({ giftCardStoreCreditAccountQuery }) =>
        giftCardStoreCreditAccountQuery.data?.[0]
    );

    validateGiftCardRedeemStep({
      giftCardStoreCreditAccount,
      giftCard,
      input,
    });

    const createdStoreCreditAccounts = createStoreCreditAccountsStep([
      {
        currency_code: giftCard.currency_code,
      },
    ]);

    const createdStoreCreditAccount = transform(
      { createdStoreCreditAccounts },
      ({ createdStoreCreditAccounts }) => {
        return createdStoreCreditAccounts[0];
      }
    );

    const linkToCreate = transform(
      { giftCard, createdStoreCreditAccount },
      ({ giftCard, createdStoreCreditAccount }) => {
        return [
          {
            [PluginModule.LOYALTY]: { gift_card_id: giftCard.id },
            [PluginModule.STORE_CREDIT]: {
              store_credit_account_id: createdStoreCreditAccount.id,
            },
          },
        ];
      }
    );

    createLinksWorkflow.runAsStep({ input: linkToCreate });

    creditAccountsWorkflow.runAsStep({
      input: [
        {
          account_id: createdStoreCreditAccount.id,
          amount: giftCard.value,
          note: "Gift card redemption",
          reference: "gift_card",
          reference_id: giftCard.code,
        },
      ],
    });

    updateGiftCardsWorkflow.runAsStep({
      input: [
        {
          id: giftCard.id,
          status: GiftCardStatus.REDEEMED,
        },
      ],
    });

    const accountQuery = useQueryGraphStep({
      entity: "store_credit_account",
      filters: { id: createdStoreCreditAccount.id },
      fields: ["id", "debits", "credits", "code", "transactions.*"],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-account-query" });

    const account = transform(
      { accountQuery },
      ({ accountQuery }) => accountQuery.data[0]
    );

    return new WorkflowResponse(account);
  }
);
