type WorkflowInput = {
    ids: string[];
};
export declare const deleteProductVariantsWorkflowId = "delete-product-variants";
export declare const deleteProductVariantsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
