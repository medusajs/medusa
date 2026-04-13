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
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PluginCartDTO } from "src/types/cart";
import { ModuleStoreCreditAccount } from "../../../types/store-credit";

export const validateCustomerStoreCreditAccountStep = createStep(
  "validate-customer-store-credit-account",
  async function ({
    storeCreditAccount,
  }: {
    storeCreditAccount: ModuleStoreCreditAccount;
  }) {
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

export const validateCartStep = createStep(
  "validate-cart",
  async function ({
    cart,
    input,
  }: {
    cart: PluginCartDTO;
    input: { cart_id: string };
  }) {
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

/*
  A workflow that adds store credits to a cart
*/
export const addStoreCreditsToCartWorkflow = createWorkflow(
  "add-store-credits-to-cart",
  function (input: { amount?: number; cart_id: string }) {
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

    const creditLineActions = transform(
      { storeCreditAccount, cart, input },
      ({ storeCreditAccount, cart, input }) => {
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

        return {
          creditLinesToCreate,
          creditLinesToDelete,
        };
      }
    );

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
