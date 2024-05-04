import { CreateRuleTypeDTO, RuleTypeDTO } from "@medusajs/types";
type WorkflowInput = {
    data: CreateRuleTypeDTO[];
};
export declare const createPricingRuleTypesWorkflowId = "create-pricing-rule-types";
export declare const createPricingRuleTypesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, RuleTypeDTO[], Record<string, Function>>;
export {};
