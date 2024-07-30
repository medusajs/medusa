import { AddPromotionRulesWorkflowDTO, PromotionRuleDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { addRulesToPromotionsStep } from "../steps"

export const createPromotionRulesWorkflowId = "create-promotion-rules-workflow"
export const createPromotionRulesWorkflow = createWorkflow(
  createPromotionRulesWorkflowId,
  (
    input: WorkflowData<AddPromotionRulesWorkflowDTO>
  ): WorkflowResponse<WorkflowData<PromotionRuleDTO[]>> => {
    return new WorkflowResponse(addRulesToPromotionsStep(input))
  }
)
