interface WorkflowInput {
    ids: string[];
}
export declare const deleteInventoryLevelsWorkflowId = "delete-inventory-levels-workflow";
export declare const deleteInventoryLevelsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, string[], Record<string, Function>>;
export {};
