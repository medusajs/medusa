import { CreateCartCreditLineDTO } from "@medusajs/framework/types";
import { MathBN, MedusaError, Modules } from "@medusajs/framework/utils";
import {
  createCartCreditLinesWorkflow,
  createLinksWorkflow,
  refreshCartItemsWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PluginModule } from "../../../types";
import { PluginCartDTO } from "../../../types/cart";
import { ModuleGiftCard } from "../../../types/loyalty";
import {
  IStoreCreditModuleService,
  ModuleAccountStats,
  ModuleStoreCreditAccount,
} from "../../../types/store-credit";
import { validateGiftCardBalancesStep } from "../steps/validate-gift-card-balances";

export const retrieveGiftCardBalanceStep = createStep(
  "retrieve-gift-cards-balance",
  async function (
    {
      storeCreditAccount,
      giftCard,
    }: {
      storeCreditAccount: ModuleStoreCreditAccount;
      giftCard: ModuleGiftCard;
    },
    { container }
  ) {
    const accountBalanceMap: Record<string, ModuleAccountStats> = {};
    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    );

    const giftCardBalance = await module.retrieveAccountStats({
      account_id: storeCreditAccount.id,
    });

    accountBalanceMap[giftCard.code] = giftCardBalance;

    return new StepResponse(accountBalanceMap);
  }
);

/**
 * Validate if the gift card exists.
 */
const validateGiftCardStep = createStep(
  "validate-gift-card",
  async function ({
    giftCard,
    input,
  }: {
    giftCard: ModuleGiftCard;
    input: { code: string };
  }) {
    if (!giftCard) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Gift card (${input.code}) not found`
      );
    }
  }
);

/**
 * Validate if the gift card can be added to the cart
 */
export const validateCartGiftCardStep = createStep(
  "validate-cart-gift-card",
  async function ({
    cart,
    giftCards,
  }: {
    cart: PluginCartDTO;
    giftCards: ModuleGiftCard[];
  }) {
    for (const giftCard of giftCards) {
      const cartGiftCard = cart.gift_cards.find((gc) =>
        gc.code.includes(giftCard.code)
      );

      if (cartGiftCard) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Gift card (${giftCard.code}) already applied to cart`
        );
      }

      if (giftCard.currency_code !== cart.currency_code) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Gift card (${giftCard.code}) currency does not match cart currency`
        );
      }
    }
  }
);

/*
  A workflow that adds gift card to a cart
*/
export const addGiftCardToCartWorkflow = createWorkflow(
  "add-gift-card-to-cart",
  function (input: { code: string; cart_id: string }) {
    const cartQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: ["id", "currency_code", "total", "gift_cards.code"],
    }).config({ name: "get-cart-query" });

    const cart = transform({ cartQuery }, ({ cartQuery }) => {
      return cartQuery.data[0];
    });

    const giftCardQuery = useQueryGraphStep({
      entity: "gift_card",
      filters: { code: input.code },
      fields: ["id", "code", "status", "currency_code"],
    }).config({ name: "get-gift-card-query" });

    const giftCard = transform({ giftCardQuery }, ({ giftCardQuery }) => {
      return giftCardQuery.data[0];
    });

    validateGiftCardStep({ giftCard, input });

    const giftCards = transform({ giftCardQuery }, ({ giftCardQuery }) => {
      return giftCardQuery.data;
    });

    validateCartGiftCardStep({ cart, giftCards });

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
        giftCardStoreCreditAccountQuery.data[0]
    );

    const storeCreditAccountQuery = useQueryGraphStep({
      entity: "store_credit_account",
      filters: {
        id: giftCardStoreCreditAccount.store_credit_account_id,
        currency_code: cart.currency_code,
      },
      fields: ["id", "balance"],
    }).config({ name: "get-store-credit-account-query" });

    const storeCreditAccount = transform(
      { storeCreditAccountQuery },
      ({ storeCreditAccountQuery }) => {
        return storeCreditAccountQuery.data[0];
      }
    );

    const giftCardsBalanceMap = retrieveGiftCardBalanceStep({
      storeCreditAccount,
      giftCard,
    });

    validateGiftCardBalancesStep({
      giftCards,
      giftCardsBalanceMap,
    });

    const creditLinesToCreate = transform(
      { giftCardsBalanceMap, giftCards, cart },
      ({ giftCardsBalanceMap, giftCards, cart }) => {
        const creditLinesData: CreateCartCreditLineDTO[] = [];

        for (const giftCard of giftCards) {
          const stats = giftCardsBalanceMap[giftCard.code];
          const amount = MathBN.min(stats.balance, cart.total);

          if (amount.gt(0)) {
            creditLinesData.push({
              cart_id: cart.id,
              amount: amount.toNumber(),
              reference: "gift-card",
              reference_id: giftCard.id,
              metadata: {},
            });
          }
        }

        return creditLinesData;
      }
    );

    const creditLines = createCartCreditLinesWorkflow.runAsStep({
      input: creditLinesToCreate,
    });

    const linksToCreate = transform(
      { creditLines, cart },
      ({ creditLines, cart }) => {
        const links = creditLines
          .filter((creditLine) => creditLine.reference === "gift-card")
          .map((creditLine) => ({
            [Modules.CART]: { cart_id: cart.id },
            [PluginModule.LOYALTY]: { gift_card_id: creditLine.reference_id },
          }));

        return links;
      }
    );

    createLinksWorkflow.runAsStep({ input: linksToCreate });

    refreshCartItemsWorkflow.runAsStep({
      input: { cart_id: input.cart_id },
    });

    return new WorkflowResponse(creditLines);
  }
);
