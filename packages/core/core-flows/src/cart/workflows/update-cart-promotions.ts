import { PromotionActions } from "@medusajs/framework/utils"
import {
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  createLineItemAdjustmentsStep,
  createShippingMethodAdjustmentsStep,
  getActionsToComputeFromPromotionsStep,
  getPromotionCodesToApply,
  prepareAdjustmentsFromPromotionActionsStep,
  removeLineItemAdjustmentsStep,
  removeShippingMethodAdjustmentsStep,
  updateCartPromotionsStep,
} from "../steps"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { CartDTO } from "@medusajs/framework/types"

export type UpdateCartPromotionsWorkflowInput = {
  cart_id?: string
  cart?: CartDTO
  promo_codes?: string[]
  action?:
    | PromotionActions.ADD
    | PromotionActions.REMOVE
    | PromotionActions.REPLACE
}

export const updateCartPromotionsWorkflowId = "update-cart-promotions"
/**
 * This workflow updates a cart's promotions.
 */
export const updateCartPromotionsWorkflow = createWorkflow(
  updateCartPromotionsWorkflowId,
  (input: WorkflowData<UpdateCartPromotionsWorkflowInput>) => {
    const potentialCart: CartDTO = when(input, ({ cart_id, cart }) => {
      if (!cart_id && !cart) {
        throw new Error("Either cart_id or cart must be provided")
      }
      return true
    }).then(() => {
      return useRemoteQueryStep({
        entry_point: "cart",
        fields: cartFieldsForRefreshSteps,
        variables: {
          id: input.cart_id,
        },
        list: false,
      })
    })

    const cart = transform({ potentialCart, input }, (data) => {
      return input.cart || data.potentialCart
    })

    const promo_codes = transform({ input }, (data) => {
      return (data.input.promo_codes || []) as string[]
    })

    const action = transform({ input }, (data) => {
      return data.input.action || PromotionActions.ADD
    })

    const promotionCodesToApply = getPromotionCodesToApply({
      cart,
      promo_codes: promo_codes,
      action: action as PromotionActions,
    })

    const actions = getActionsToComputeFromPromotionsStep({
      cart,
      promotionCodesToApply,
    })

    const {
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
      computedPromotionCodes,
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
  }
)
