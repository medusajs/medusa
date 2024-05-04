type WorkflowInput = {
    ids: string[];
};
export declare const deleteCustomersWorkflowId = "delete-customers";
export declare const deleteCustomersWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
