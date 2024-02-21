import { CartDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import {
  computeActionsStep,
  createLineItemAdjustmentsStep,
  createShippingMethodAdjustmentsStep,
  prepareAdjustmentsForPromotionsStep,
  removeLineItemAdjustmentsStep,
  removeShippingMethodAdjustmentsStep,
  retrieveCartStep,
} from "../steps"

type WorkflowInput = {
  promoCodes: string[]
  cartId: string
}

export const addPromotionsToCartWorkflowId = "add-promotions-to-cart"
export const addPromotionsToCartWorkflow = createWorkflow(
  addPromotionsToCartWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CartDTO> => {
    const cart = retrieveCartStep(input)

    const actionsToCompute = computeActionsStep({
      cart,
      promoCodes: input.promoCodes,
    })

    const {
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
    } = prepareAdjustmentsForPromotionsStep({ actionsToCompute })

    removeLineItemAdjustmentsStep({ lineItemAdjustmentIdsToRemove })
    removeShippingMethodAdjustmentsStep({ shippingMethodAdjustmentIdsToRemove })

    createLineItemAdjustmentsStep({ lineItemAdjustmentsToCreate })
    createShippingMethodAdjustmentsStep({ shippingMethodAdjustmentsToCreate })

    return retrieveCartStep(input).config({
      name: "final-cart-step",
    })
  }
)
