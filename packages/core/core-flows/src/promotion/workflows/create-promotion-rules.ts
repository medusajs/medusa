import {
  AddPromotionRulesWorkflowDTO,
  PromotionRuleDTO,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
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
 *     // import { RuleType } from "@zjedene-medusa/framework/utils"
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
    return new WorkflowResponse(addRulesToPromotionsStep(input))
  }
)
