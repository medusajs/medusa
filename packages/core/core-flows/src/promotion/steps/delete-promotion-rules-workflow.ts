import type { RemovePromotionRulesWorkflowDTO } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { deletePromotionRulesWorkflow } from "../workflows/delete-promotion-rules"

export const deletePromotionRulesWorkflowStepId =
  "delete-promotion-rules-workflow"
/**
 * This step deletes promotion rules using the {@link deletePromotionRulesWorkflow}.
 */
export const deletePromotionRulesWorkflowStep = createStep(
  deletePromotionRulesWorkflowStepId,
  async (
    data: RemovePromotionRulesWorkflowDTO,
    { container, eventGroupId }
  ) => {
    // Group the nested workflow's events with the parent's, so they're only
    // released once the parent workflow succeeds.
    const { transaction, errors } = await deletePromotionRulesWorkflow(
      container
    ).run({
      input: data,
      context: { eventGroupId, preventReleaseEvents: true },
      throwOnError: false,
    })

    if (errors?.length) {
      throw errors[0].error
    }

    return new StepResponse(data.data.rule_ids ?? [], transaction)
  },

  async (transaction, { container }) => {
    if (!transaction) {
      return
    }

    await deletePromotionRulesWorkflow(container).cancel({ transaction })
  }
)
