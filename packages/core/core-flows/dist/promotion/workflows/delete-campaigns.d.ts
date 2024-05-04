type WorkflowInput = {
    ids: string[];
};
export declare const deleteCampaignsWorkflowId = "delete-campaigns";
export declare const deleteCampaignsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
