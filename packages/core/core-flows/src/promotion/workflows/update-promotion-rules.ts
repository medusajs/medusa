import {
  UpdatePromotionRulesWorkflowDTO,
  PromotionRuleDTO,
} from "@medusajs/framework/types"
import {
  PromotionRuleWorkflowEvents,
  RuleType,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useQueryGraphStep } from "../../common"
import { updatePromotionRulesStep } from "../steps"

export const updatePromotionRulesWorkflowId = "update-promotion-rules-workflow"
/**
 * This workflow updates one or more promotion rules. It's used by other workflows,
 * such as {@link batchPromotionRulesWorkflow} that manages the rules of a promotion.
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * update promotion rules within your custom flows.
 * 
 * @example
 * const { result } = await updatePromotionRulesWorkflow(container)
 * .run({
 *   input: {
 *     data: [
 *       {
 *         id: "prule_123",
 *         attribute: "cusgrp_123",
 *       }
 *     ]
 *   }
 * })
 * 
 * @summary
 * 
 * Update one or more promotion rules.
 */
export const updatePromotionRulesWorkflow = createWorkflow(
  updatePromotionRulesWorkflowId,
  (
    input: WorkflowData<UpdatePromotionRulesWorkflowDTO>
  ): WorkflowResponse<PromotionRuleDTO[]> => {
    const updatedRules = updatePromotionRulesStep(input)

    const ruleIds = transform({ input }, ({ input }) =>
      input.data.map((rule) => rule.id)
    )

    const { data: rules } = useQueryGraphStep({
      entity: "promotion_rule",
      fields: [
        "id",
        "promotions.id",
        "method_target_rules.promotion_id",
        "method_buy_rules.promotion_id",
      ],
      filters: { id: ruleIds },
    }).config({ name: "get-updated-promotion-rules" })

    const eventData = transform({ rules }, ({ rules }) =>
      rules.flatMap((rule) => [
        ...(rule.promotions ?? []).map((promotion) => ({
          id: rule.id,
          promotion_id: promotion.id,
          rule_type: RuleType.RULES,
        })),
        ...(rule.method_target_rules ?? []).map((method) => ({
          id: rule.id,
          promotion_id: method.promotion_id,
          rule_type: RuleType.TARGET_RULES,
        })),
        ...(rule.method_buy_rules ?? []).map((method) => ({
          id: rule.id,
          promotion_id: method.promotion_id,
          rule_type: RuleType.BUY_RULES,
        })),
      ])
    )

    emitEventStep({
      eventName: PromotionRuleWorkflowEvents.UPDATED,
      data: eventData,
    })

    return new WorkflowResponse(updatedRules)
  }
)
