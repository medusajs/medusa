import { RemovePromotionRulesWorkflowDTO } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { removeRulesFromPromotionsStep } from "../steps"

export const deletePromotionRulesWorkflowId = "delete-promotion-rules-workflow"
/**
 * This workflow deletes one or more promotion rules.
 */
export const deletePromotionRulesWorkflow = createWorkflow(
  deletePromotionRulesWorkflowId,
  (
    input: WorkflowData<RemovePromotionRulesWorkflowDTO>
  ): WorkflowData<void> => {
    return removeRulesFromPromotionsStep(input)
  }
)
