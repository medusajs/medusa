import { CustomerDTO, CustomerUpdatableFields, FilterableCustomerProps } from "@medusajs/types";
type UpdateCustomersStepInput = {
    selector: FilterableCustomerProps;
    update: CustomerUpdatableFields;
};
export declare const updateCustomersWorkflowId = "update-customers";
export declare const updateCustomersWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateCustomersStepInput, CustomerDTO[], Record<string, Function>>;
export {};
