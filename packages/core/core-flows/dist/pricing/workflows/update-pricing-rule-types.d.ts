import { RuleTypeDTO, UpdateRuleTypeDTO } from "@medusajs/types";
type WorkflowInput = {
    data: UpdateRuleTypeDTO[];
};
export declare const updatePricingRuleTypesWorkflowId = "update-pricing-rule-types";
export declare const updatePricingRuleTypesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, RuleTypeDTO[], Record<string, Function>>;
export {};
