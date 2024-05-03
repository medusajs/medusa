import {
  UpdatePromotionRulesWorkflowDTO,
  PromotionRuleDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updatePromotionRulesStep } from "../steps"

export const updatePromotionRulesWorkflowId = "update-promotion-rules-workflow"
export const updatePromotionRulesWorkflow = createWorkflow(
  updatePromotionRulesWorkflowId,
  (
    input: WorkflowData<UpdatePromotionRulesWorkflowDTO>
  ): WorkflowData<PromotionRuleDTO[]> => {
    return updatePromotionRulesStep(input)
  }
)
