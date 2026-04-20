import { MedusaError } from "@medusajs/framework/utils";
import {
  createLinksWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";
import {
  createStep,
  createWorkflow,
  transform,
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

/**
 * Input to validate that a gift card is eligible for redemption.
 */
export interface ValidateGiftCardRedeemStepInput {
  /**
   * The gift card to validate.
   */
  giftCard: ModuleGiftCard
  /**
   * The store credit account already linked to the gift card, if any.
   */
  giftCardStoreCreditAccount: ModuleStoreCreditAccount
  /**
   * The original workflow input containing the gift card ID.
   */
  input: RedeemGiftCardWorkflowInput
}

/**
 * This step validates that a gift card can be redeemed. It throws an error if the
 * gift card is already redeemed or already has an associated store credit account.
 *
 * @example
 * const data = validateGiftCardRedeemStep({
 *   giftCard: {
 *     id: "gc_123",
 *     status: GiftCardStatus.ACTIVE,
 *     // other gift card properties...
 *   },
 *   giftCardStoreCreditAccount: {
 *     id: "sca_123",
 *     balance: 100,
 *     // other store credit account properties...
 *   },
 *   input: { gift_card_id: "gc_123" },
 * })
 */
export const validateGiftCardRedeemStep = createStep(
  "validate-gift-card-redeem",
  async function ({
    giftCardStoreCreditAccount,
    giftCard,
  }: ValidateGiftCardRedeemStepInput) {
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
 * This workflow redeems a gift card by creating an anonymous store credit account,
 * crediting it with the gift card's value, and marking the gift card as redeemed.
 * It throws an error if the gift card is already redeemed or already has an
 * associated store credit account.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around gift card redemption.
 *
 * @example
 * const { result } = await redeemGiftCardWorkflow(container)
 *   .run({
 *     input: {
 *       gift_card_id: "gc_123",
 *     },
 *   })
 *
 * @summary
 *
 * Redeem a gift card and create a backing store credit account.
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
