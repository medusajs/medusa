import { OrderLineItemDTO, OrderShippingMethodDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { updateOrderTaxLinesWorkflow } from "../workflows/update-tax-lines"

export interface UpdateOrderTaxLinesStepInput {
  order_id: string
  items?: OrderLineItemDTO[]
  shipping_methods?: OrderShippingMethodDTO[]
  force_tax_calculation?: boolean
}

export const updateOrderTaxLinesStepId = "update-order-tax-lines-step"
/**
 * This step updates tax lines for an order's line items and shipping methods.
 */
export const updateOrderTaxLinesStep = createStep(
  updateOrderTaxLinesStepId,
  async (input: UpdateOrderTaxLinesStepInput, { container }) => {
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
