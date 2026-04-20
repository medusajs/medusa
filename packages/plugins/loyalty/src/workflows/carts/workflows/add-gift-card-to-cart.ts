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

/**
 * Input to retrieve the balance of a single gift card from its associated store credit account.
 */
export interface RetrieveGiftCardBalanceStepInput {
  /**
   * The store credit account linked to the gift card.
   */
  storeCreditAccount: ModuleStoreCreditAccount
  /**
   * The gift card whose balance should be retrieved.
   */
  giftCard: ModuleGiftCard
}

/**
 * This step retrieves the balance of a single gift card from its associated store
 * credit account. Returns a map of the gift card code to its account stats.
 *
 * @example
 * const data = retrieveGiftCardBalanceStep({
 *   storeCreditAccount: {
 *     id: "sca_123",
 *     balance: 100,
 *     // other store credit account properties...
 *   },
 *   giftCard: {
 *     id: "gc_123",
 *     code: "GC-XXXX",
 *     // other gift card properties...
 *   },
 * })
 */
export const retrieveGiftCardBalanceStep = createStep(
  "retrieve-gift-cards-balance",
  async function (
    {
      storeCreditAccount,
      giftCard,
    }: RetrieveGiftCardBalanceStepInput,
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
 * Input to validate that a gift card exists.
 */
export interface ValidateGiftCardExistsStepInput {
  /**
   * The gift card to validate, or undefined if not found.
   */
  giftCard: ModuleGiftCard
  /**
   * The lookup input containing the gift card code.
   */
  input: { code: string }
}

/**
 * Validate if the gift card exists.
 */
const validateGiftCardStep = createStep(
  "validate-gift-card",
  async function ({
    giftCard,
    input,
  }: ValidateGiftCardExistsStepInput) {
    if (!giftCard) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Gift card (${input.code}) not found`
      );
    }
  }
);

/**
 * Input to validate that gift cards can be added to a cart.
 */
export interface ValidateCartGiftCardStepInput {
  /**
   * The cart to validate against, including its currently applied gift cards.
   */
  cart: PluginCartDTO
  /**
   * The gift cards to apply to the cart.
   */
  giftCards: ModuleGiftCard[]
}

/**
 * This step validates that gift cards can be added to a cart. It throws an error
 * if a gift card is already applied to the cart or if the gift card currency does
 * not match the cart's currency.
 *
 * @example
 * const data = validateCartGiftCardStep({
 *   cart: {
 *     id: "cart_123",
 *     gift_cards: [
 *       { code: "GC-XXXX-XXXX" },
 *       // other gift cards applied to the cart...
 *     ],
 *     currency_code: "usd",
 *     // other cart properties... 
 *   },
 *   giftCards: [...],
 * })
 */
export const validateCartGiftCardStep = createStep(
  "validate-cart-gift-card",
  async function ({
    cart,
    giftCards,
  }: ValidateCartGiftCardStepInput) {
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

/**
 * Input to apply a gift card to a cart.
 */
export interface AddGiftCardToCartWorkflowInput {
  /**
   * The code of the gift card to apply.
   */
  code: string
  /**
   * The ID of the cart to apply the gift card to.
   */
  cart_id: string
}

/**
 * This workflow applies a gift card to a cart by creating a credit line for the
 * gift card's balance and linking the gift card to the cart. It validates that
 * the gift card exists, has sufficient balance, and can be applied to the cart.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around adding gift cards to carts.
 *
 * @example
 * const { result } = await addGiftCardToCartWorkflow(container)
 *   .run({
 *     input: {
 *       code: "GC-XXXX-XXXX",
 *       cart_id: "cart_123",
 *     },
 *   })
 *
 * @summary
 *
 * Apply a gift card to a cart.
 */
export const addGiftCardToCartWorkflow = createWorkflow(
  "add-gift-card-to-cart",
  function (input: AddGiftCardToCartWorkflowInput) {
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
