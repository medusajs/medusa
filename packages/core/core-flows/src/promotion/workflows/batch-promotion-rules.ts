import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  CreatePromotionRuleDTO,
  PromotionRuleDTO,
  UpdatePromotionRuleDTO,
} from "@medusajs/framework/types"
import { RuleType } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { deletePromotionRulesWorkflowStep } from "../steps/delete-promotion-rules-workflow"
import { createPromotionRulesWorkflow } from "./create-promotion-rules"
import { updatePromotionRulesWorkflow } from "./update-promotion-rules"

export const batchPromotionRulesWorkflowId = "batch-promotion-rules"
/**
 * This workflow creates, updates, or deletes promotion rules.
 */
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
      createPromotionRulesWorkflow.runAsStep({
        input: createInput,
      }),
      updatePromotionRulesWorkflow.runAsStep({
        input: updateInput,
      }),
      deletePromotionRulesWorkflowStep(deleteInput)
    )

    return new WorkflowResponse(
      transform({ created, updated, deleted }, (data) => data)
    )
  }
)
