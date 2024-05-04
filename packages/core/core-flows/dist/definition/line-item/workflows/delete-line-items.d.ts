type WorkflowInput = {
    ids: string[];
};
export declare const deleteLineItemsWorkflowId = "delete-line-items";
export declare const deleteLineItemsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, never, Record<string, Function>>;
export {};
