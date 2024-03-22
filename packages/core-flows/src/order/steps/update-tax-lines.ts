import { OrderLineItemDTO, OrderShippingMethodDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { updateOrderTaxLinesWorkflow } from "../workflows/update-tax-lines"

interface StepInput {
  order_id: string
  items?: OrderLineItemDTO[]
  shipping_methods?: OrderShippingMethodDTO[]
  force_tax_calculation?: boolean
}

export const updateOrderTaxLinesStepId = "update-order-tax-lines-step"
export const updateOrderTaxLinesStep = createStep(
  updateOrderTaxLinesStepId,
  async (input: StepInput, { container }) => {
    // TODO: manually trigger rollback on workflow when step fails
    await updateOrderTaxLinesWorkflow(container).run({ input })

    return new StepResponse(null)
  }
)
