import {
  CartLineItemDTO,
  CartShippingMethodDTO,
  CartWorkflowDTO,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { updateTaxLinesWorkflow } from "../workflows"

interface StepInput {
  cart_or_cart_id: CartWorkflowDTO | string
  items?: CartLineItemDTO[]
  shipping_methods?: CartShippingMethodDTO[]
}

export const updateTaxLinesStepId = "update-tax-lines-step"
export const updateTaxLinesStep = createStep(
  updateTaxLinesStepId,
  async (input: StepInput, { container }) => {
    // TODO: manually trigger rollback on workflow when step fails
    await updateTaxLinesWorkflow(container).run({ input })

    return new StepResponse(null)
  }
)
