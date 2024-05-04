import { CreateCustomerDTO, CustomerDTO } from "@medusajs/types";
type WorkflowInput = {
    authUserId: string;
    customersData: CreateCustomerDTO;
};
export declare const createCustomerAccountWorkflowId = "create-customer-account";
export declare const createCustomerAccountWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, CustomerDTO, Record<string, Function>>;
export {};
