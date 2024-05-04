type WorkflowInput = {
    ids: string[];
};
export declare const deleteCollectionsWorkflowId = "delete-collections";
export declare const deleteCollectionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
