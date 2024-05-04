import { CreateCustomerAddressDTO, CustomerAddressDTO } from "@medusajs/types";
type WorkflowInput = {
    addresses: CreateCustomerAddressDTO[];
};
export declare const createCustomerAddressesWorkflowId = "create-customer-addresses";
export declare const createCustomerAddressesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, CustomerAddressDTO[], Record<string, Function>>;
export {};
