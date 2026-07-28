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

/**
 * The data to manage a promotion's rules.
 * 
 * @property id - The ID of the promotion to manage the rules of.
 * @property rule_type - The type of rule to manage.
 * @property create - The rules to create.
 * @property update - The rules to update.
 * @property delete - The IDs of the rules to delete.
 */
export interface BatchPromotionRulesWorkflowInput extends BatchWorkflowInput<
  CreatePromotionRuleDTO,
  UpdatePromotionRuleDTO
> {
  id: string
  rule_type: RuleType
}

/**
 * The result of managing the promotion's rules.
 * 
 * @property created - The created rules.
 * @property updated - The updated rules.
 * @property deleted - The deleted rule IDs.
 */
export interface BatchPromotionRulesWorkflowOutput extends BatchWorkflowOutput<PromotionRuleDTO> {}

export const batchPromotionRulesWorkflowId = "batch-promotion-rules"
/**
 * This workflow manages a promotion's rules. It's used by the
 * [Manage Promotion Rules Admin API Route](https://docs.medusajs.com/api/admin/promotions/manage-rules),
 * [Manage Promotion Buy Rules Admin API Route](https://docs.medusajs.com/api/admin/promotions/manage-buy-rules),
 * and [Manage Promotion Target Rules Admin API Route](https://docs.medusajs.com/api/admin/promotions/manage-target-rules).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * manage promotion rules within your custom flows.
 * 
 * @example
 * const { result } = await batchPromotionRulesWorkflow(container)
 * .run({
 *   input: {
 *     id: "promo_123",
 *     // import { RuleType } from "@medusajs/framework/utils"
 *     rule_type: RuleType.RULES,
 *     create: [
 *       {
 *         attribute: "cusgrp_123",
 *         operator: "eq",
 *         values: ["cusgrp_123"],
 *       }
 *     ],
 *     update: [
 *       {
 *         id: "prule_123",
 *         attribute: "cusgrp_123"
 *       }
 *     ],
 *     delete: ["prule_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Manage the rules of a promotion.
 */
export const batchPromotionRulesWorkflow = createWorkflow(
  batchPromotionRulesWorkflowId,
  (
    input: WorkflowData<BatchPromotionRulesWorkflowInput>
  ): WorkflowResponse<BatchPromotionRulesWorkflowOutput> => {
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
