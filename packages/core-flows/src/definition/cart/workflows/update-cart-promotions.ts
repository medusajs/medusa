import { CartDTO } from "@medusajs/types"
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
} from "../steps"

type WorkflowInput = {
  promoCodes: string[]
  cartId: string
  removePromotions?: boolean
}

export const updateCartPromotionsWorkflowId = "update-cart-promotions"
export const updateCartPromotionsWorkflow = createWorkflow(
  updateCartPromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CartDTO> => {
    const retrieveCartInput = {
      cartId: input.cartId,
      config: {
        relations: [
          "items",
          "items.adjustments",
          "shipping_methods",
          "shipping_methods.adjustments",
        ],
      },
    }

    const cart = retrieveCartStep(retrieveCartInput)
    const actions = getActionsToComputeFromPromotionsStep({
      cart,
      promoCodes: input.promoCodes,
      removePromotions: input.removePromotions || false,
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

    return retrieveCartStep(retrieveCartInput).config({
      name: "retrieve-cart-result-step",
    })
  }
)
