import { AddPromotionRulesWorkflowDTO, PromotionRuleDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { addRulesToPromotionsStep } from "../steps"

export const createPromotionRulesWorkflowId = "create-promotion-rules-workflow"
export const createPromotionRulesWorkflow = createWorkflow(
  createPromotionRulesWorkflowId,
  (
    input: WorkflowData<AddPromotionRulesWorkflowDTO>
  ): WorkflowData<PromotionRuleDTO[]> => {
    return addRulesToPromotionsStep(input)
  }
)
