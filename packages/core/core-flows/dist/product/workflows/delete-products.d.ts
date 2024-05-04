type WorkflowInput = {
    ids: string[];
};
export declare const deleteProductsWorkflowId = "delete-products";
export declare const deleteProductsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
