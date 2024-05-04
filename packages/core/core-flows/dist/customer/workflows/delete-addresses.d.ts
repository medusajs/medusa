type WorkflowInput = {
    ids: string[];
};
export declare const deleteCustomerAddressesWorkflowId = "delete-customer-addresses";
export declare const deleteCustomerAddressesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
