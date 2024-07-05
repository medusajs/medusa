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
    const { transaction } = await updateOrderTaxLinesWorkflow(container).run({
      input,
    })

    return new StepResponse(null, { transaction })
  },
  async (flow, { container }) => {
    if (!flow) {
      return
    }

    await updateOrderTaxLinesWorkflow(container).cancel({
      transaction: flow.transaction,
    })
  }
)
