type WorkflowInput = {
    ids: string[];
};
export declare const deletePricingRuleTypesWorkflowId = "delete-pricing-rule-types";
export declare const deletePricingRuleTypesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
