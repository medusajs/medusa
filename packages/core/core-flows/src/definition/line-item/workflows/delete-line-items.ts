import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { refreshCartPromotionsStep } from "../../cart/steps/refresh-cart-promotions"
import { deleteLineItemsStep } from "../steps/delete-line-items"

export type DeleteLineItemsWorkflowInput = { cart_id: string; ids: string[] }

// TODO: The DeleteLineItemsWorkflow are missing the following steps:
// - Refresh/delete shipping methods (fulfillment module)
// - Refresh line item adjustments (promotion module)
// - Update payment sessions (payment module)

export const deleteLineItemsWorkflowId = "delete-line-items"
/**
 * This workflow deletes line items from a cart.
 */
export const deleteLineItemsWorkflow = createWorkflow(
  deleteLineItemsWorkflowId,
  (input: WorkflowData<DeleteLineItemsWorkflowInput>) => {
    deleteLineItemsStep(input.ids)

    refreshCartPromotionsStep({ id: input.cart_id })
  }
)
