import { CustomerGroupDTO, CreateCustomerGroupDTO } from "@medusajs/types";
type WorkflowInput = {
    customersData: CreateCustomerGroupDTO[];
};
export declare const createCustomerGroupsWorkflowId = "create-customer-groups";
export declare const createCustomerGroupsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, CustomerGroupDTO[], Record<string, Function>>;
export {};
