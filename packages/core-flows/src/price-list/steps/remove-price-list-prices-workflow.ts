import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { removePriceListPricesWorkflow } from "../workflows/remove-price-list-prices"

export const removePriceListPricesWorkflowStepId =
  "remove-price-list-prices-workflow"
export const removePriceListPricesWorkflowStep = createStep(
  removePriceListPricesWorkflowStepId,
  async (ids: string[], { container }) => {
    const { transaction, result: updated } =
      await removePriceListPricesWorkflow(container).run({ input: { ids } })

    return new StepResponse(updated, transaction)
  },

  async (transaction, { container }) => {
    if (!transaction) {
      return
    }

    await removePriceListPricesWorkflow(container).cancel({ transaction })
  }
)
