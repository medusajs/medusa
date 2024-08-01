import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  CreatePromotionRuleDTO,
  PromotionRuleDTO,
  UpdatePromotionRuleDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { RuleType } from "@medusajs/utils"
import { createPromotionRulesWorkflowStep } from "../steps/create-promotion-rules-workflow"
import { updatePromotionRulesWorkflowStep } from "../steps/update-promotion-rules-workflow"
import { deletePromotionRulesWorkflowStep } from "../steps/delete-promotion-rules-workflow"

export const batchPromotionRulesWorkflowId = "batch-promotion-rules"
export const batchPromotionRulesWorkflow = createWorkflow(
  batchPromotionRulesWorkflowId,
  (
    input: WorkflowData<
      BatchWorkflowInput<CreatePromotionRuleDTO, UpdatePromotionRuleDTO> & {
        id: string
        rule_type: RuleType
      }
    >
  ): WorkflowResponse<BatchWorkflowOutput<PromotionRuleDTO>> => {
    const createInput = transform({ input }, (data) => ({
      rule_type: data.input.rule_type,
      data: { id: data.input.id, rules: data.input.create ?? [] },
    }))

    const updateInput = transform({ input }, (data) => ({
      data: data.input.update ?? [],
    }))

    const deleteInput = transform({ input }, (data) => ({
      rule_type: data.input.rule_type,
      data: { id: data.input.id, rule_ids: data.input.delete ?? [] },
    }))

    const [created, updated, deleted] = parallelize(
      createPromotionRulesWorkflowStep(createInput),
      updatePromotionRulesWorkflowStep(updateInput),
      deletePromotionRulesWorkflowStep(deleteInput)
    )

    return new WorkflowResponse(
      transform({ created, updated, deleted }, (data) => data)
    )
  }
)
