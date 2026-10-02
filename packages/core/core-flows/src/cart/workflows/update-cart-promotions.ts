import { MedusaError, PromotionActions } from "@medusajs/framework/utils"
import { AdditionalData } from "@medusajs/framework/types"
import {
  createHook,
  createStep,
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { getPromotionCodesToApply, validateCartStep } from "../steps"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { promotionContextResult } from "../utils/schemas"
import { refreshCartPromotionAdjustmentsWorkflow } from "./refresh-cart-promotion-adjustments"
import { refreshCartShippingMethodsWorkflow } from "./refresh-cart-shipping-methods"
import { refreshPaymentCollectionForCartWorkflow } from "./refresh-payment-collection"

/**
 * The details of the promotion updates on a cart.
 */
export type UpdateCartPromotionsWorkflowInput = {
  /**
   * The cart's ID.
   */
  cart_id?: string
  /**
   * The Cart reference.
   */
  cart?: any
  /**
   * The promotion codes to add to the cart, remove from the cart,
   * or replace all existing promotions in the cart.
   */
  promo_codes?: string[]
  /**
   * The action to perform with the specified promotion codes.
   */
  action?:
    | PromotionActions.ADD
    | PromotionActions.REMOVE
    | PromotionActions.REPLACE
  /**
   * Wether to force the refresh of the cart payment collection. If the caller doesn't refresh it explicitly,
   * you should probably set this property to true.
   */
  force_refresh_payment_collection?: boolean
}

/**
 * The data to validate before updating a cart's promotions.
 */
export type UpdateCartPromotionsValidateInputStepInput = {
  /**
   * The workflow's input.
   */
  input: Pick<UpdateCartPromotionsWorkflowInput, "cart_id" | "cart">
}

/**
 * This step validates that either a cart ID or a cart is passed to the
 * {@link updateCartPromotionsWorkflow}. If neither is passed, the step throws an error.
 *
 * @example
 * const data = updateCartPromotionsValidateInput({
 *   input: {
 *     cart_id: "cart_123",
 *   }
 * })
 */
export const updateCartPromotionsValidateInput = createStep(
  "update-cart-promotions-validate-input",
  ({ input }: UpdateCartPromotionsValidateInputStepInput) => {
    if (!input.cart_id && !input.cart?.id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Either cart_id or cart must be provided to update the cart's promotions"
      )
    }
  }
)

export const updateCartPromotionsWorkflowId = "update-cart-promotions"
/**
 * This workflow updates a cart's promotions, applying or removing promotion codes from the cart. It also computes the adjustments
 * that need to be applied to the cart's line items and shipping methods based on the promotions applied. This workflow is used by
 * [Add Promotions Store API Route](https://docs.medusajs.com/api/store/carts/add-promotions).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to update a cart's promotions within your custom flows.
 *
 * @example
 * const { result } = await updateCartPromotionsWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     promo_codes: ["10OFF"],
 *     // imported from @medusajs/framework/utils
 *     action: PromotionActions.ADD,
 *   }
 * })
 *
 * @summary
 *
 * Update a cart's applied promotions to add, replace, or remove them.
 *
 * @property hooks.validate - This hook is executed before all operations. You can consume this hook to perform any custom validation. If validation fails, you can throw an error to stop the workflow execution.
 * @property hooks.setPromotionContext - This hook is executed after the cart is fetched and before promotion rules are evaluated. You can consume this hook to add custom rules that determine whether a promotion is applied. The returned object is merged on top of the cart context, allowing you to override existing context.
 */
export const updateCartPromotionsWorkflow = createWorkflow(
  {
    name: updateCartPromotionsWorkflowId,
    idempotent: false,
  },
  (input: WorkflowData<UpdateCartPromotionsWorkflowInput & AdditionalData>) => {
    updateCartPromotionsValidateInput({ input })

    const cartId = transform({ input }, ({ input }) => {
      return input.cart_id ?? input.cart?.id
    })

    acquireLockStep({
      key: cartId,
      timeout: 2,
      ttl: 10,
    })

    const fetchCart = when("should-fetch-cart", { input }, ({ input }) => {
      return !input.cart
    }).then(() => {
      const { data: cart } = useQueryGraphStep({
        entity: "cart",
        fields: cartFieldsForRefreshSteps,
        filters: { id: cartId },
        options: { isList: false },
      }).config({ name: "fetch-cart" })

      return cart
    })

    const cart = transform({ fetchCart, input }, ({ fetchCart, input }) => {
      return input.cart ?? fetchCart
    })

    validateCartStep({ cart })

    const validate = createHook("validate", {
      input,
      cart,
    })

    const promo_codes = transform({ input }, (data) => {
      return (data.input.promo_codes || []) as string[]
    })

    const action = transform({ input }, (data) => {
      return data.input.action || PromotionActions.ADD
    })

    const setPromotionContext = createHook(
      "setPromotionContext",
      {
        cart,
        action,
        promo_codes,
      },
      {
        resultValidator: promotionContextResult,
      }
    )
    const setPromotionContextResult = setPromotionContext.getResult()

    const promotionCodesToApply = getPromotionCodesToApply({
      cart: cart,
      promo_codes,
      action: action as PromotionActions,
    })

    const adjustmentsResult = refreshCartPromotionAdjustmentsWorkflow.runAsStep(
      {
        input: {
          cart_id: cartId,
          cart,
          promo_codes: promotionCodesToApply,
          additional_promotion_context: setPromotionContextResult,
        },
      }
    )

    // Shipping prices can depend on the discounted item total, and shipping
    // adjustments on the shipping price, so recompute once if shipping changed.
    const shippingMethodsRefresh = refreshCartShippingMethodsWorkflow.runAsStep(
      {
        input: {
          cart,
          additional_data: input.additional_data,
        },
      }
    )

    const recomputedAdjustmentsResult = when(
      "should-recompute-promotions-after-shipping-refresh",
      { shippingMethodsRefresh },
      ({ shippingMethodsRefresh }) => shippingMethodsRefresh.has_changes
    ).then(() => {
      return refreshCartPromotionAdjustmentsWorkflow
        .runAsStep({
          input: {
            cart_id: cartId,
            promo_codes: promotionCodesToApply,
            additional_promotion_context: setPromotionContextResult,
          },
        })
        .config({ name: "refresh-cart-promotion-adjustments-after-shipping" })
    })

    when(
      { input },
      ({ input }) => input.force_refresh_payment_collection === true
    ).then(() => {
      refreshPaymentCollectionForCartWorkflow.runAsStep({
        input: { cart },
      })
    })

    releaseLockStep({
      key: cartId,
    })

    const skippedPromoCodes = transform(
      { adjustmentsResult, recomputedAdjustmentsResult },
      ({ adjustmentsResult, recomputedAdjustmentsResult }) =>
        (recomputedAdjustmentsResult ?? adjustmentsResult)?.skipped_promo_codes
    )

    return new WorkflowResponse(
      { skipped_promo_codes: skippedPromoCodes },
      { hooks: [validate, setPromotionContext] as const }
    )
  }
)
