import { OrderLineItemDTO, OrderShippingMethodDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { updateTaxLinesWorkflow } from "../workflows"

interface StepInput {
  order_id: string
  items?: OrderLineItemDTO[]
  shipping_methods?: OrderShippingMethodDTO[]
  force_tax_calculation?: boolean
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
