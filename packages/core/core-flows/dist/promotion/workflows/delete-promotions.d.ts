type WorkflowInput = {
    ids: string[];
};
export declare const deletePromotionsWorkflowId = "delete-promotions";
export declare const deletePromotionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
