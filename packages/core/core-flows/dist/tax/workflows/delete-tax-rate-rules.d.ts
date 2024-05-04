type WorkflowInput = {
    ids: string[];
};
export declare const deleteTaxRateRulesWorkflowId = "delete-tax-rate-rules";
export declare const deleteTaxRateRulesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
