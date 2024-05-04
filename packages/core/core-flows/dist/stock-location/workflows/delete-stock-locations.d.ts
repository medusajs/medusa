interface WorkflowInput {
    ids: string[];
}
export declare const deleteStockLocationsWorkflowId = "delete-stock-locations-workflow";
export declare const deleteStockLocationsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
