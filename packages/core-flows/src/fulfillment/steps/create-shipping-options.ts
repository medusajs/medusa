import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { FulfillmentWorkflow } from "@medusajs/types"

interface StepInput
  extends FulfillmentWorkflow.CreateShippingOptionsWorkflowInput {}

export const createShippingOptionsStepId = "create-shipping-options-step"
export const createShippingOptionsStep = createStep(
  createShippingOptionsStepId,
  async (input: StepInput, { container }) => {
    return new StepResponse([])
  },
  async (ruleIds, { container }) => {}
)
