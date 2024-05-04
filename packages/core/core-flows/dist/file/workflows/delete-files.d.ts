type WorkflowInput = {
    ids: string[];
};
export declare const deleteFilesWorkflowId = "delete-files";
export declare const deleteFilesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
