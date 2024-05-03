import { UpdatePromotionRulesWorkflowDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { updatePromotionRulesWorkflow } from "../workflows/update-promotion-rules"

export const updatePromotionRulesWorkflowStepId =
  "update-promotion-rules-workflow"
export const updatePromotionRulesWorkflowStep = createStep(
  updatePromotionRulesWorkflowStepId,
  async (data: UpdatePromotionRulesWorkflowDTO, { container }) => {
    const {
      transaction,
      result: updated,
      errors,
    } = await updatePromotionRulesWorkflow(container).run({
      input: data,
      throwOnError: false,
    })

    if (errors?.length) {
      throw errors[0].error
    }

    return new StepResponse(updated, transaction)
  },

  async (transaction, { container }) => {
    if (!transaction) {
      return
    }

    await updatePromotionRulesWorkflow(container).cancel({ transaction })
  }
)
