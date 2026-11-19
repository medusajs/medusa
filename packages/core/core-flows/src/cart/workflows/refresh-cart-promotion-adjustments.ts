import { PromotionActions } from "@medusajs/framework/utils"
import {
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import {
  createLineItemAdjustmentsStep,
  createShippingMethodAdjustmentsStep,
  getActionsToComputeFromPromotionsStep,
  prepareAdjustmentsFromPromotionActionsStep,
  removeLineItemAdjustmentsStep,
  removeShippingMethodAdjustmentsStep,
} from "../steps"
import { updateCartPromotionsStep } from "../steps/update-cart-promotions"
import { cartFieldsForRefreshSteps } from "../utils/fields"

export const refreshCartPromotionAdjustmentsWorkflowId =
  "refresh-cart-promotion-adjustments"

/**
 * The details of the cart to refresh the promotion adjustments for.
 */
export type RefreshCartPromotionAdjustmentsWorkflowInput = {
  /**
   * The cart's ID.
   */
  cart_id: string
  /**
   * The cart, if already retrieved. If not provided, the cart is retrieved by its ID.
   */
  cart?: any
  /**
   * The promotion codes to apply to the cart. They replace the cart's existing promotions.
   */
  promo_codes: string[]
  /**
   * Custom context merged on top of the cart context when evaluating promotion rules.
   */
  additional_promotion_context?: Record<string, unknown>
}

/**
 * This workflow recomputes the adjustments of a cart's line items and shipping methods
 * from the cart's current state, and replaces the existing adjustments with them. It's used
 * by the {@link updateCartPromotionsWorkflow} to apply the cart's promotions, and again to recompute
 * the adjustments after the cart's shipping methods are re-priced.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * recompute a cart's adjustments after making changes that affect them.
 *
 * @since 2.21.3
 *
 * @example
 * const { result } = await refreshCartPromotionAdjustmentsWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     promo_codes: ["10OFF"],
 *   }
 * })
 *
 * @summary
 *
 * Recompute a cart's promotion adjustments.
 */
export const refreshCartPromotionAdjustmentsWorkflow = createWorkflow(
  {
    name: refreshCartPromotionAdjustmentsWorkflowId,
    idempotent: false,
  },
  (input: WorkflowData<RefreshCartPromotionAdjustmentsWorkflowInput>) => {
    const fetchCart = when("should-fetch-cart", { input }, ({ input }) => {
      return !input.cart
    }).then(() => {
      const { data: cart } = useQueryGraphStep({
        entity: "cart",
        fields: cartFieldsForRefreshSteps,
        filters: { id: input.cart_id },
        options: { isList: false },
      }).config({ name: "fetch-cart" })

      return cart
    })

    const cart = transform({ fetchCart, input }, ({ fetchCart, input }) => {
      return input.cart ?? fetchCart
    })

    const actions = getActionsToComputeFromPromotionsStep({
      computeActionContext: cart,
      promotionCodesToApply: input.promo_codes,
      additional_promotion_context: input.additional_promotion_context,
    })

    const {
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
      computedPromotionCodes,
      skippedPromoCodes,
    } = prepareAdjustmentsFromPromotionActionsStep({ actions })

    parallelize(
      removeLineItemAdjustmentsStep({ lineItemAdjustmentIdsToRemove }),
      removeShippingMethodAdjustmentsStep({
        shippingMethodAdjustmentIdsToRemove,
      }),
      createLineItemAdjustmentsStep({ lineItemAdjustmentsToCreate }),
      createShippingMethodAdjustmentsStep({
        shippingMethodAdjustmentsToCreate,
      }),
      updateCartPromotionsStep({
        id: input.cart_id,
        promo_codes: computedPromotionCodes,
        action: PromotionActions.REPLACE,
      })
    )

    return new WorkflowResponse({ skipped_promo_codes: skippedPromoCodes })
  }
)
