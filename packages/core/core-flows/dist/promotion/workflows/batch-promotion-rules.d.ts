import { BatchWorkflowInput, BatchWorkflowOutput, CreatePromotionRuleDTO, PromotionRuleDTO, UpdatePromotionRuleDTO } from "@medusajs/types";
import { RuleType } from "@medusajs/utils";
export declare const batchPromotionRulesWorkflowId = "batch-promotion-rules";
export declare const batchPromotionRulesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<BatchWorkflowInput<CreatePromotionRuleDTO, UpdatePromotionRuleDTO> & {
    id: string;
    rule_type: RuleType;
}, BatchWorkflowOutput<PromotionRuleDTO>, Record<string, Function>>;
