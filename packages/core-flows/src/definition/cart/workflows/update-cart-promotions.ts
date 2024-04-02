import { PromotionActions } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import {
  createLineItemAdjustmentsStep,
  createShippingMethodAdjustmentsStep,
  getActionsToComputeFromPromotionsStep,
  prepareAdjustmentsFromPromotionActionsStep,
  removeLineItemAdjustmentsStep,
  removeShippingMethodAdjustmentsStep,
  retrieveCartStep,
  updateCartPromotionsStep,
} from "../steps"

type WorkflowInput = {
  promoCodes: string[]
  cartId: string
  action?:
    | PromotionActions.ADD
    | PromotionActions.REMOVE
    | PromotionActions.REPLACE
}

export const updateCartPromotionsWorkflowId = "update-cart-promotions"
export const updateCartPromotionsWorkflow = createWorkflow(
  updateCartPromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    const retrieveCartInput = {
      id: input.cartId,
      config: {
        relations: [
          "items",
          "items.adjustments",
          "shipping_methods",
          "shipping_methods.adjustments",
        ],
      },
    }

    updateCartPromotionsStep({
      id: input.cartId,
      promo_codes: input.promoCodes,
      action: input.action || PromotionActions.ADD,
    })

    const cart = retrieveCartStep(retrieveCartInput)
    const actions = getActionsToComputeFromPromotionsStep({
      cart,
    })

    const {
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
    } = prepareAdjustmentsFromPromotionActionsStep({ actions })

    parallelize(
      removeLineItemAdjustmentsStep({ lineItemAdjustmentIdsToRemove }),
      removeShippingMethodAdjustmentsStep({
        shippingMethodAdjustmentIdsToRemove,
      })
    )

    parallelize(
      createLineItemAdjustmentsStep({ lineItemAdjustmentsToCreate }),
      createShippingMethodAdjustmentsStep({ shippingMethodAdjustmentsToCreate })
    )
  }
)
