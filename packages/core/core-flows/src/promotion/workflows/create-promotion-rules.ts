import { AddPromotionRulesWorkflowDTO, PromotionRuleDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { addRulesToPromotionsStep } from "../steps"

export const createPromotionRulesWorkflowId = "create-promotion-rules-workflow"
/**
 * This workflow creates one or more promotion rules.
 */
export const createPromotionRulesWorkflow = createWorkflow(
  createPromotionRulesWorkflowId,
  (
    input: WorkflowData<AddPromotionRulesWorkflowDTO>
  ): WorkflowResponse<PromotionRuleDTO[]> => {
    return new WorkflowResponse(addRulesToPromotionsStep(input))
  }
)
