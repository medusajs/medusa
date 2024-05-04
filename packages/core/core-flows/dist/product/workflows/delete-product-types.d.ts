type WorkflowInput = {
    ids: string[];
};
export declare const deleteProductTypesWorkflowId = "delete-product-types";
export declare const deleteProductTypesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
