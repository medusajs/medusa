type WorkflowInput = {
    ids: string[];
};
export declare const deleteCustomerGroupsWorkflowId = "delete-customer-groups";
export declare const deleteCustomerGroupsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
