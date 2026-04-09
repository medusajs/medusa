import type { AdditionalData } from "@medusajs/framework/types"
import { isDefined, PromotionActions } from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { acquireLockStep, releaseLockStep } from "../../locking"
import {
  updateCartItemsTranslationsStep,
  updateLineItemsStep,
  validateCartStep,
} from "../steps"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { pricingContextResult } from "../utils/schemas"
import { getVariantsAndItemsWithPrices } from "./get-variants-and-items-with-prices"
import { refreshCartShippingMethodsWorkflow } from "./refresh-cart-shipping-methods"
import { refreshPaymentCollectionForCartWorkflow } from "./refresh-payment-collection"
import { updateCartPromotionsWorkflow } from "./update-cart-promotions"
import { updateTaxLinesWorkflow } from "./update-tax-lines"
import { upsertTaxLinesWorkflow } from "./upsert-tax-lines"

/**
 * The details of the cart to refresh.
 */
export type RefreshCartItemsWorkflowInput = {
  /**
   * The cart's ID.
   */
  cart_id: string
  /**
   * The promotion codes applied on the cart.
   * These promotion codes will replace previously applied codes.
   */
  promo_codes?: string[]
  /**
   * Force refresh the cart items
   */
  force_refresh?: boolean

  /**
   * The items to refresh.
   */
  items?: any[]

  /**
   * The shipping methods to refresh.
   */
  shipping_methods?: any[]

  /**
   * Whether to force re-calculating tax amounts, which
   * may include sending requests to a third-part tax provider, depending
   * on the configurations of the cart's tax region.
   */
  force_tax_calculation?: boolean

  /**
   * The new locale code to update cart items translations.
   * When provided, all cart items will be re-translated using this locale.
   */
  locale?: string
}

export const refreshCartItemsWorkflowId = "refresh-cart-items"
/**
 * This workflow refreshes a cart to ensure its prices, promotion codes, taxes, and other details are applied correctly. It's useful
 * after making a chnge to a cart, such as after adding an item to the cart or adding a promotion code.
 *
 * This workflow is used by other cart-related workflows, such as the {@link addToCartWorkflow} after an item
 * is added to the cart.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to refresh the cart after making updates to it in your
 * custom flows.
 *
 * @example
 * const { result } = await refreshCartItemsWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *   }
 * })
 *
 * @summary
 *
 * Refresh a cart's details after an update.
 *
 * @property hooks.setPricingContext - This hook is executed before the cart is refreshed. You can consume this hook to return any custom context useful for the prices retrieval of the variants in the cart.
 *
 * For example, assuming you have the following custom pricing rule:
 *
 * ```json
 * {
 *   "attribute": "location_id",
 *   "operator": "eq",
 *   "value": "sloc_123",
 * }
 * ```
 *
 * You can consume the `setPricingContext` hook to add the `location_id` context to the prices calculation:
 *
 * ```ts
 * import { refreshCartItemsWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 *
 * refreshCartItemsWorkflow.hooks.setPricingContext((
 *   { cart, items, additional_data }, { container }
 * ) => {
 *   return new StepResponse({
 *     location_id: "sloc_123", // Special price for in-store purchases
 *   });
 * });
 * ```
 *
 * The variants' prices will now be retrieved using the context you return.
 *
 * :::note
 *
 * Learn more about prices calculation context in the [Prices Calculation](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation) documentation.
 *
 * :::
 *
 */
export const refreshCartItemsWorkflow = createWorkflow(
  {
    name: refreshCartItemsWorkflowId,
    idempotent: false,
  },
  (input: WorkflowData<RefreshCartItemsWorkflowInput & AdditionalData>) => {
    acquireLockStep({
      key: input.cart_id,
      timeout: 2,
      ttl: 10,
    })

    const setPricingContext = createHook(
      "setPricingContext",
      {
        cart_id: input.cart_id,
        items: input.items,
        additional_data: input.additional_data,
      },
      {
        resultValidator: pricingContextResult,
      }
    )
    const setPricingContextResult = setPricingContext.getResult()

    when("force-refresh-calculate-prices", { input }, ({ input }) => {
      return !!input.force_refresh
    }).then(() => {
      const { data: cart } = useQueryGraphStep({
        entity: "cart",
        fields: cartFieldsForRefreshSteps,
        filters: { id: input.cart_id },
        pagination: {
          take: 1,
        },
        options: {
          isList: false,
        },
      })

      validateCartStep({ cart })

      const { lineItems } = getVariantsAndItemsWithPrices.runAsStep({
        input: {
          cart,
          setPricingContextResult: setPricingContextResult!,
        },
      })

      updateLineItemsStep({
        id: cart.id,
        items: lineItems,
      })
    })

    const { data: refetchedCart } = useQueryGraphStep({
      entity: "cart",
      fields: cartFieldsForRefreshSteps,
      filters: { id: input.cart_id },
      options: { isList: false },
    }).config({ name: "refetch-cart" })

    refreshCartShippingMethodsWorkflow.runAsStep({
      input: {
        cart: refetchedCart, // Pass cart to avoid refetch
        additional_data: input.additional_data,
      },
    })

    when("force-refresh-update-tax-lines", { input }, ({ input }) => {
      return !!input.force_refresh
    }).then(() => {
      updateTaxLinesWorkflow.runAsStep({
        input: { cart_id: input.cart_id },
      })
    })

    when("force-refresh-upsert-tax-lines", { input }, ({ input }) => {
      return (
        !input.force_refresh &&
        (!!input.items?.length || !!input.shipping_methods?.length)
      )
    }).then(() => {
      upsertTaxLinesWorkflow.runAsStep({
        input: transform(
          { refetchedCart, input },
          ({ refetchedCart, input }) => {
            return {
              cart: refetchedCart,
              items: input.items ?? [],
              shipping_methods: input.shipping_methods ?? [],
              force_tax_calculation: input.force_tax_calculation,
            }
          }
        ),
      })
    })

    const cartPromoCodes = transform(
      { refetchedCart, input },
      ({ refetchedCart, input }) => {
        if (isDefined(input.promo_codes)) {
          return input.promo_codes
        } else {
          return refetchedCart.promotions.map((p) => p?.code).filter(Boolean)
        }
      }
    )

    updateCartPromotionsWorkflow.runAsStep({
      input: {
        cart_id: input.cart_id,
        cart: refetchedCart, // Pass cart to avoid refetch in updateCartPromotionsWorkflow
        promo_codes: cartPromoCodes,
        action: PromotionActions.REPLACE,
        force_refresh_payment_collection: false,
      },
    })

    when("should-update-item-translations", { input }, ({ input }) => {
      return !!input.locale
    }).then(() => {
      updateCartItemsTranslationsStep({
        cart_id: input.cart_id,
        locale: input.locale!,
        items: refetchedCart.items,
      })
    })

    const beforeRefreshingPaymentCollection = createHook(
      "beforeRefreshingPaymentCollection",
      { input }
    )

    refreshPaymentCollectionForCartWorkflow.runAsStep({
      input: { cart: refetchedCart },
    })

    releaseLockStep({
      key: input.cart_id,
    })

    return new WorkflowResponse(refetchedCart, {
      hooks: [setPricingContext, beforeRefreshingPaymentCollection] as const,
    })
  }
)
