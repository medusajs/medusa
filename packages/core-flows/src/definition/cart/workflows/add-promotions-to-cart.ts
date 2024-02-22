import { CartDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createLineItemAdjustmentsStep,
  createShippingMethodAdjustmentsStep,
  getActionsToComputeFromPromotionsStep,
  prepareAdjustmentsFromPromotionsStep,
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

    const actionsToCompute = getActionsToComputeFromPromotionsStep(
      transform({ cart, promoCodes: input.promoCodes }, (data) => data)
    )

    const {
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
    } = prepareAdjustmentsFromPromotionsStep({ actionsToCompute })

    removeLineItemAdjustmentsStep({ lineItemAdjustmentIdsToRemove })
    removeShippingMethodAdjustmentsStep({ shippingMethodAdjustmentIdsToRemove })

    createLineItemAdjustmentsStep({ lineItemAdjustmentsToCreate })
    createShippingMethodAdjustmentsStep({ shippingMethodAdjustmentsToCreate })

    return retrieveCartStep(input).config({
      name: "final-cart-step",
    })
  }
)
