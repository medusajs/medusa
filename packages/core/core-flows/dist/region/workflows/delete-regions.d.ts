type WorkflowInput = {
    ids: string[];
};
export declare const deleteRegionsWorkflowId = "delete-regions";
export declare const deleteRegionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
