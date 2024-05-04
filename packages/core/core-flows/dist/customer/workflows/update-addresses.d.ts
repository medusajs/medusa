import { FilterableCustomerAddressProps, CustomerAddressDTO, UpdateCustomerAddressDTO } from "@medusajs/types";
type WorkflowInput = {
    selector: FilterableCustomerAddressProps;
    update: UpdateCustomerAddressDTO;
};
export declare const updateCustomerAddressesWorkflowId = "update-customer-addresses";
export declare const updateCustomerAddressesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, CustomerAddressDTO[], Record<string, Function>>;
export {};
