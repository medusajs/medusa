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
  force_tax_calculation?: boolean
}

export const updateTaxLinesStepId = "update-tax-lines-step"
export const updateTaxLinesStep = createStep(
  updateTaxLinesStepId,
  async (input: StepInput, { container }) => {
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
