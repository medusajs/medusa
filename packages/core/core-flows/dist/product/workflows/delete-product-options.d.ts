type WorkflowInput = {
    ids: string[];
};
export declare const deleteProductOptionsWorkflowId = "delete-product-options";
export declare const deleteProductOptionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
