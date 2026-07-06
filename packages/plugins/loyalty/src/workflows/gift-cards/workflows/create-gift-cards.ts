import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createLinksWorkflow } from "@medusajs/medusa/core-flows";

import { createGiftCardsStep } from "../steps/create-gift-cards";
import { createStoreCreditAccountsStep } from "../../store-credit/steps/create-store-credit-accounts";
import {
  GiftCardStatus,
  ModuleCreateGiftCard,
  PluginModule,
} from "../../../types";
import { creditAccountsWorkflow } from "../../store-credit/workflows/credit-accounts";
import { updateGiftCardsWorkflow } from "./update-gift-cards";

/**
 * Data for creating one or more gift cards with backing store credit accounts.
 */
export type CreateGiftCardsWorkflowInput = ModuleCreateGiftCard[]

/**
 * This workflow creates gift cards and automatically sets up their backing store credit accounts.
 * It creates the gift cards, generates anonymous store credit accounts linked to each gift card,
 * credits the accounts with the gift card values, and marks the gift cards as redeemed.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around gift card creation.
 *
 * @example
 * const { result } = await createGiftCardsWorkflow(container)
 *   .run({
 *     input: [
 *       {
 *         code: "GC-XXXX-XXXX",
 *         value: 100,
 *         currency_code: "usd",
 *         expires_at: null,
 *         reference: "order",
 *         reference_id: "order_123",
 *         line_item_id: "li_123",
 *         customer_id: "cust_123",
 *         metadata: { custom_key: "custom_value" },
 *       },
 *     ],
 *   })
 *
 * @summary
 *
 * Create gift cards with backing store credit accounts.
 */
export const createGiftCardsWorkflow = createWorkflow(
  "create-gift-cards",
  function (input: CreateGiftCardsWorkflowInput) {
    const giftCards = createGiftCardsStep(input);

    /**
     * Create anonymous credit accounts for the gift cards and link them
     */

    const storeCreditAccontCurrencies = transform(
      { giftCards },
      ({ giftCards }) => {
        return giftCards.map((giftCard) => ({
          currency_code: giftCard.currency_code,
        }));
      }
    );

    const createdStoreCreditAccounts = createStoreCreditAccountsStep(
      storeCreditAccontCurrencies
    );

    const linkToCreate = transform(
      { giftCards, createdStoreCreditAccounts },
      ({ giftCards, createdStoreCreditAccounts }) =>
        giftCards.map((giftCard, index) => ({
          [PluginModule.LOYALTY]: { gift_card_id: giftCard.id },
          [PluginModule.STORE_CREDIT]: {
            store_credit_account_id: createdStoreCreditAccounts[index].id,
          },
        }))
    );

    createLinksWorkflow.runAsStep({ input: linkToCreate });

    /**
     * Credit the accounts with the GC value
     */

    const creditAccountsInput = transform(
      { giftCards, createdStoreCreditAccounts },
      ({ giftCards, createdStoreCreditAccounts }) => {
        return giftCards.map((giftCard, index) => ({
          account_id: createdStoreCreditAccounts[index].id,
          amount: giftCard.value,
          note: "Gift card redemption",
          reference: "gift_card",
          reference_id: giftCard.id,
        }));
      }
    );

    creditAccountsWorkflow.runAsStep({
      input: creditAccountsInput,
    });

    /**
     * Mark the gift cards as redeemed
     */

    const updateGiftCardsInput = transform({ giftCards }, ({ giftCards }) => {
      return giftCards.map((giftCard, index) => ({
        id: giftCard.id,
        status: GiftCardStatus.REDEEMED,
      }));
    });

    const redeemedGiftCards = updateGiftCardsWorkflow.runAsStep({
      input: updateGiftCardsInput,
    });

    return new WorkflowResponse(redeemedGiftCards);
  }
);
