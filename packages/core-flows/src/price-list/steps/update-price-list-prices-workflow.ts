import { UpdatePriceListPricesWorkflowDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { updatePriceListPricesWorkflow } from "../workflows/update-price-list-prices"

export const updatePriceListPricesWorkflowStepId =
  "update-price-list-prices-workflow"
export const updatePriceListPricesWorkflowStep = createStep(
  updatePriceListPricesWorkflowStepId,
  async (data: UpdatePriceListPricesWorkflowDTO[], { container }) => {
    const { transaction, result: updated } =
      await updatePriceListPricesWorkflow(container).run({ input: { data } })

    return new StepResponse(updated, transaction)
  },

  async (transaction, { container }) => {
    if (!transaction) {
      return
    }

    await updatePriceListPricesWorkflow(container).cancel({ transaction })
  }
)
