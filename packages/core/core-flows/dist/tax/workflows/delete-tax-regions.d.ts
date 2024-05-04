type WorkflowInput = {
    ids: string[];
};
export declare const deleteTaxRegionsWorkflowId = "delete-tax-regions";
export declare const deleteTaxRegionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
