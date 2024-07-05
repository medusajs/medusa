import { RemovePromotionRulesWorkflowDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { removeRulesFromPromotionsStep } from "../steps"

export const deletePromotionRulesWorkflowId = "delete-promotion-rules-workflow"
export const deletePromotionRulesWorkflow = createWorkflow(
  deletePromotionRulesWorkflowId,
  (
    input: WorkflowData<RemovePromotionRulesWorkflowDTO>
  ): WorkflowData<void> => {
    return removeRulesFromPromotionsStep(input)
  }
)
