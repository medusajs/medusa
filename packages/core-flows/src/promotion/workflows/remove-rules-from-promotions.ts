import { RemovePromotionRulesWorkflowDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { removeRulesFromPromotionsStep } from "../steps"

export const removeRulesFromPromotionsWorkflowId =
  "remove-rules-from-promotions-workflow"
export const removeRulesFromPromotionsWorkflow = createWorkflow(
  removeRulesFromPromotionsWorkflowId,
  (
    input: WorkflowData<RemovePromotionRulesWorkflowDTO>
  ): WorkflowData<void> => {
    removeRulesFromPromotionsStep(input)
  }
)
