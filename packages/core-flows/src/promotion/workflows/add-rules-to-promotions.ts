import { AddPromotionRulesWorkflowDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { addRulesToPromotionsStep } from "../steps"

export const addRulesToPromotionsWorkflowId = "add-rules-to-promotions-workflow"
export const addRulesToPromotionsWorkflow = createWorkflow(
  addRulesToPromotionsWorkflowId,
  (input: WorkflowData<AddPromotionRulesWorkflowDTO>): WorkflowData<void> => {
    addRulesToPromotionsStep(input)
  }
)
