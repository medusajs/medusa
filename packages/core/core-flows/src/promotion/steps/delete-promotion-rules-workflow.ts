import { RemovePromotionRulesWorkflowDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { deletePromotionRulesWorkflow } from "../workflows/delete-promotion-rules"

export const deletePromotionRulesWorkflowStepId =
  "delete-promotion-rules-workflow"
export const deletePromotionRulesWorkflowStep = createStep(
  deletePromotionRulesWorkflowStepId,
  async (data: RemovePromotionRulesWorkflowDTO, { container }) => {
    const { transaction, errors } = await deletePromotionRulesWorkflow(
      container
    ).run({
      input: data,
      throwOnError: false,
    })

    if (errors?.length) {
      throw errors[0].error
    }

    return new StepResponse(
      {
        ids: data.data.rule_ids ?? [],
        object: "promotion-rule",
        deleted: true,
      },
      transaction
    )
  },

  async (transaction, { container }) => {
    if (!transaction) {
      return
    }

    await deletePromotionRulesWorkflow(container).cancel({ transaction })
  }
)
