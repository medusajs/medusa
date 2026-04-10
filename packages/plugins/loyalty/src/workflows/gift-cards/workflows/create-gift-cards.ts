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

/*
  A workflow that creates gift cards 
*/
export const createGiftCardsWorkflow = createWorkflow(
  "create-gift-cards",
  function (input: ModuleCreateGiftCard[]) {
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

    updateGiftCardsWorkflow.runAsStep({
      input: updateGiftCardsInput,
    });

    return new WorkflowResponse(giftCards);
  }
);
