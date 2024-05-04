type WorkflowInput = {
    ids: string[];
};
export declare const deleteStoresWorkflowId = "delete-stores";
export declare const deleteStoresWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
