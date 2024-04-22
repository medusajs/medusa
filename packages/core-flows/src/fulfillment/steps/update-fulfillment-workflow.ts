import { FulfillmentWorkflow } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { updateFulfillmentWorkflow } from "../workflows/update-fulfillment"

export const updateFulfillmentWorkflowStepId = "update-fulfillment-workflow"
export const updateFulfillmentWorkflowStep = createStep(
  updateFulfillmentWorkflowStepId,
  async (
    data: FulfillmentWorkflow.UpdateFulfillmentWorkflowInput,
    { container }
  ) => {
    const { transaction, result: updated } = await updateFulfillmentWorkflow(
      container
    ).run({ input: data })

    return new StepResponse(updated, transaction)
  },

  async (transaction, { container }) => {
    if (!transaction) {
      return
    }

    await updateFulfillmentWorkflow(container).cancel({ transaction })
  }
)
