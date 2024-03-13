import { CreatePromotionRuleDTO, PromotionRuleTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { addRulesToPromotionsStep } from "../steps"

type WorkflowInput = {
  rule_type: PromotionRuleTypes
  data: {
    id: string
    rules: CreatePromotionRuleDTO[]
  }
}

export const addRulesToPromotionsWorkflowId = "add-rules-to-promotions-workflow"
export const addRulesToPromotionsWorkflow = createWorkflow(
  addRulesToPromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    addRulesToPromotionsStep(input)
  }
)
