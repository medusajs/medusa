import { CustomerDTO, CreateCustomerDTO } from "@medusajs/types";
type WorkflowInput = {
    customersData: CreateCustomerDTO[];
};
export declare const createCustomersWorkflowId = "create-customers";
export declare const createCustomersWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, CustomerDTO[], Record<string, Function>>;
export {};
