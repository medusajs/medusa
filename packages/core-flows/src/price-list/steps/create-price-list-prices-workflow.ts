import { CreatePriceListPricesWorkflowDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { createPriceListPricesWorkflow } from "../workflows/create-price-list-prices"

export const createPriceListPricesWorkflowStepId =
  "create-price-list-prices-workflow-step"
export const createPriceListPricesWorkflowStep = createStep(
  createPriceListPricesWorkflowStepId,
  async (data: CreatePriceListPricesWorkflowDTO[], { container }) => {
    const { transaction, result: created } =
      await createPriceListPricesWorkflow(container).run({ input: { data } })

    return new StepResponse(created, transaction)
  },

  async (transaction, { container }) => {
    if (!transaction) {
      return
    }

    await createPriceListPricesWorkflow(container).cancel({ transaction })
  }
)
