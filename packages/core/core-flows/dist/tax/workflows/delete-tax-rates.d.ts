type WorkflowInput = {
    ids: string[];
};
export declare const deleteTaxRatesWorkflowId = "delete-tax-rates";
export declare const deleteTaxRatesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
