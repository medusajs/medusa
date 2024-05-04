type WorkflowInput = {
    ids: string[];
};
export declare const deleteSalesChannelsWorkflowId = "delete-sales-channels";
export declare const deleteSalesChannelsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
