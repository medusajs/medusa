import { AddPromotionRulesWorkflowDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { createPromotionRulesWorkflow } from "../workflows/create-promotion-rules"

export const createPromotionRulesWorkflowStepId =
  "create-promotion-rules-workflow"
export const createPromotionRulesWorkflowStep = createStep(
  createPromotionRulesWorkflowStepId,
  async (data: AddPromotionRulesWorkflowDTO, { container }) => {
    const {
      transaction,
      result: created,
      errors,
    } = await createPromotionRulesWorkflow(container).run({
      input: data,
      throwOnError: false,
    })

    if (errors?.length) {
      throw errors[0].error
    }

    return new StepResponse(created, transaction)
  },

  async (transaction, { container }) => {
    if (!transaction) {
      return
    }

    await createPromotionRulesWorkflow(container).cancel({ transaction })
  }
)
