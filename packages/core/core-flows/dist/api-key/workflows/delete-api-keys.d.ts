type WorkflowInput = {
    ids: string[];
};
export declare const deleteApiKeysWorkflowId = "delete-api-keys";
export declare const deleteApiKeysWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
