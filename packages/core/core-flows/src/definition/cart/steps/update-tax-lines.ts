import {
  CartLineItemDTO,
  CartShippingMethodDTO,
  CartWorkflowDTO,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { updateTaxLinesWorkflow } from "../workflows/update-tax-lines"

export interface UpdateTaxLinesStepInput {
  cart_or_cart_id: CartWorkflowDTO | string
  items?: CartLineItemDTO[]
  shipping_methods?: CartShippingMethodDTO[]
  force_tax_calculation?: boolean
}

export const updateTaxLinesStepId = "update-tax-lines-step"
/**
 * This step updates tax lines of line items and shipping methods.
 */
export const updateTaxLinesStep = createStep(
  updateTaxLinesStepId,
  async (input: UpdateTaxLinesStepInput, { container }) => {
    const { transaction } = await updateTaxLinesWorkflow(container).run({
      input,
    })

    return new StepResponse(null, { transaction })
  },
  async (flow, { container }) => {
    if (!flow) {
      return
    }

    await updateTaxLinesWorkflow(container).cancel({
      transaction: flow.transaction,
    })
  }
)
