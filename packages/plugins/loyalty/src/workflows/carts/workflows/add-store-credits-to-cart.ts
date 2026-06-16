import { CreateCartCreditLineDTO } from "@medusajs/framework/types";
import { isDefined, MathBN, MedusaError } from "@medusajs/framework/utils";
import {
  createCartCreditLinesWorkflow,
  deleteCartCreditLinesWorkflow,
  refreshCartItemsWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";
import {
  createStep,
  createWorkflow,
  parallelize,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PluginCartDTO } from "../../../../src/types/cart";
import { ModuleStoreCreditAccount } from "../../../types/store-credit";

/**
 * Input to validate that a customer's store credit account exists and has a positive balance.
 */
export interface ValidateCustomerStoreCreditAccountStepInput {
  /**
   * The customer's store credit account to validate.
   */
  storeCreditAccount: ModuleStoreCreditAccount
}

/**
 * This step validates that a customer's store credit account exists and has a positive
 * balance. It throws an error if the account is not found or has no balance.
 *
 * @example
 * const data = validateCustomerStoreCreditAccountStep({
 *   storeCreditAccount: {
 *     id: "sca_123",
 *     balance: 100,
 *     // other store credit account properties...
 *   },
 * })
 */
export const validateCustomerStoreCreditAccountStep = createStep(
  "validate-customer-store-credit-account",
  async function ({
    storeCreditAccount,
  }: ValidateCustomerStoreCreditAccountStepInput) {
    if (!storeCreditAccount) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Store credit account not found for the customer on the cart in that currency.`
      );
    }

    if (MathBN.convert(storeCreditAccount.balance).lte(0)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Store credit account has no balance`
      );
    }
  }
);

/**
 * Input to validate that a cart is eligible for store credit usage.
 */
export interface ValidateCartStepInput {
  /**
   * The cart to validate.
   */
  cart: PluginCartDTO
  /**
   * The workflow input containing the cart ID used in error messages.
   */
  input: { cart_id: string }
}

/**
 * This step validates that a cart is eligible for store credit usage. It throws an
 * error if the cart is not found, does not have a customer, or does not have a
 * currency set.
 *
 * @example
 * const data = validateCartStep({
 *   cart: { ...cart, customer_id: "cust_123", currency_code: "usd" },
 *   input: { cart_id: "cart_123" },
 * })
 */
export const validateCartStep = createStep(
  "validate-cart",
  async function ({
    cart,
    input,
  }: ValidateCartStepInput) {
    if (!cart) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cart with id ${input.cart_id} not found`
      );
    }

    if (!cart.customer_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cart's customer must be set to add store credits`
      );
    }

    if (!cart.currency_code) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cart's currency must be set to add store credits`
      );
    }
  }
);

/**
 * Input to compute the credit line actions to apply store credits to a cart.
 */
export interface ComputeCreditLineActionsStepInput {
  /**
   * The customer's store credit account.
   */
  storeCreditAccount: ModuleStoreCreditAccount
  /**
   * The cart to apply store credits to.
   */
  cart: PluginCartDTO
  /**
   * The workflow input containing the amount of store credits to apply.
   */
  input: { amount?: number }
}

/**
 * This step computes the credit lines to create and delete when applying store
 * credits to a cart. It collects the existing store-credit lines to delete and
 * builds a new credit line for the specified amount, or for the full store credit
 * balance if no amount is specified. It throws an error if the requested amount is
 * greater than the store credit account balance.
 *
 * @example
 * const data = computeCreditLineActionsStep({
 *   storeCreditAccount: {
 *     id: "sca_123",
 *     balance: 100,
 *     // other store credit account properties...
 *   },
 *   cart: { ...cart, id: "cart_123", total: 50 },
 *   input: { amount: 50 },
 * })
 */
export const computeCreditLineActionsStep = createStep(
  "compute-credit-line-actions",
  async function ({
    storeCreditAccount,
    cart,
    input,
  }: ComputeCreditLineActionsStepInput) {
    const creditLinesToCreate: CreateCartCreditLineDTO[] = [];
    const creditLinesToDelete = (cart.credit_lines ?? [])
      .filter((creditLine) => creditLine.reference === "store-credit")
      .map((creditLine) => creditLine.id);

    let amount = input.amount
      ? MathBN.convert(input.amount)
      : MathBN.convert(storeCreditAccount.balance);

    if (
      isDefined(input.amount) &&
      MathBN.convert(amount).gt(MathBN.convert(storeCreditAccount.balance))
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Amount is greater than the store credit account balance`
      );
    }

    if (amount.gt(0)) {
      creditLinesToCreate.push({
        cart_id: cart.id,
        amount: MathBN.min(amount, cart.total).toNumber(),
        reference: "store-credit",
        reference_id: storeCreditAccount.id,
        metadata: {},
      });
    }

    return new StepResponse({
      creditLinesToCreate,
      creditLinesToDelete,
    });
  }
);

/**
 * Input to apply store credits to a cart.
 */
export interface AddStoreCreditsToCartWorkflowInput {
  /**
   * The ID of the cart to apply store credits to.
   */
  cart_id: string
  /**
   * The amount of store credits to apply. If not provided, the full balance is applied.
   */
  amount?: number
}

/**
 * This workflow applies store credits to a cart. It removes any existing store-credit
 * lines and creates a new credit line for the specified amount, or for the full store
 * credit balance if no amount is specified. The customer must be set on the cart and
 * have a store credit account in the cart's currency.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around applying store credits to carts.
 *
 * @example
 * const { result } = await addStoreCreditsToCartWorkflow(container)
 *   .run({
 *     input: {
 *       cart_id: "cart_123",
 *       amount: 50,
 *     },
 *   })
 *
 * @summary
 *
 * Apply store credits to a cart.
 */
export const addStoreCreditsToCartWorkflow = createWorkflow(
  "add-store-credits-to-cart",
  function (input: AddStoreCreditsToCartWorkflowInput) {
    const cartQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: ["id", "currency_code", "total", "customer_id", "credit_lines.*"],
    }).config({ name: "get-cart-query" });

    const cart = transform({ cartQuery }, ({ cartQuery }) => {
      return cartQuery.data[0];
    });

    validateCartStep({ cart, input });

    const storeCreditAccountQuery = useQueryGraphStep({
      entity: "store_credit_account",
      filters: {
        customer_id: cart.customer_id,
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

    validateCustomerStoreCreditAccountStep({
      storeCreditAccount,
    });

    const creditLineActions = computeCreditLineActionsStep({
      storeCreditAccount,
      cart,
      input,
    });

    const [_deletedCreditLines, createdCreditLines] = parallelize(
      deleteCartCreditLinesWorkflow.runAsStep({
        input: {
          id: creditLineActions.creditLinesToDelete,
        },
      }),
      createCartCreditLinesWorkflow.runAsStep({
        input: creditLineActions.creditLinesToCreate,
      })
    );

    refreshCartItemsWorkflow.runAsStep({
      input: { cart_id: input.cart_id },
    });

    return new WorkflowResponse(createdCreditLines);
  }
);
