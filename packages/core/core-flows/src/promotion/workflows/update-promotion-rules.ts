import {
  UpdatePromotionRulesWorkflowDTO,
  PromotionRuleDTO,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
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
    return new WorkflowResponse(updatePromotionRulesStep(input))
  }
)
