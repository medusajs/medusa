import { PromotionActions } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  createLineItemAdjustmentsStep,
  createShippingMethodAdjustmentsStep,
  getActionsToComputeFromPromotionsStep,
  getPromotionCodesToApply,
  prepareAdjustmentsFromPromotionActionsStep,
  removeLineItemAdjustmentsStep,
  removeShippingMethodAdjustmentsStep,
} from "../steps"
import { updateCartPromotionsStep } from "../steps/update-cart-promotions"
import { cartFieldsForRefreshSteps } from "../utils/fields"

export type UpdateCartPromotionsWorkflowInput = {
  cart_id: string
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
  (
    input: WorkflowData<UpdateCartPromotionsWorkflowInput>
  ): WorkflowData<void> => {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: cartFieldsForRefreshSteps,
      variables: { id: input.cart_id },
      list: false,
    })

    const promotionCodesToApply = getPromotionCodesToApply({
      cart: cart,
      promo_codes: input.promo_codes ?? [],
      action: input.action || PromotionActions.ADD,
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
