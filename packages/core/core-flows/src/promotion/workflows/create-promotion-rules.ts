import {
  AddPromotionRulesWorkflowDTO,
  PromotionRuleDTO,
} from "@medusajs/framework/types"
import { PromotionRuleWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { addRulesToPromotionsStep } from "../steps"

export const createPromotionRulesWorkflowId = "create-promotion-rules-workflow"
/**
 * This workflow creates one or more promotion rules. It's used by other workflows,
 * such as {@link batchPromotionRulesWorkflow} that manages the rules of a promotion.
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * create promotion rules within your custom flows.
 * 
 * @example
 * const { result } = await createPromotionRulesWorkflow(container)
 * .run({
 *   input: {
 *     // import { RuleType } from "@medusajs/framework/utils"
 *     rule_type: RuleType.RULES,
 *     data: {
 *       id: "promo_123",
 *       rules: [
 *         {
 *           attribute: "cusgrp_123",
 *           operator: "eq",
 *           values: ["cusgrp_123"],
 *         }
 *       ],
 *     }
 *   }
 * })
 * 
 * @summary
 * 
 * Create one or more promotion rules.
 */
export const createPromotionRulesWorkflow = createWorkflow(
  createPromotionRulesWorkflowId,
  (
    input: WorkflowData<AddPromotionRulesWorkflowDTO>
  ): WorkflowResponse<PromotionRuleDTO[]> => {
    const createdRules = addRulesToPromotionsStep(input)

    const eventData = transform(
      { input, createdRules },
      ({ input, createdRules }) =>
        createdRules.map((rule) => ({
          id: rule.id,
          promotion_id: input.data.id,
          rule_type: input.rule_type,
        }))
    )

    emitEventStep({
      eventName: PromotionRuleWorkflowEvents.CREATED,
      data: eventData,
    })

    return new WorkflowResponse(createdRules)
  }
)
