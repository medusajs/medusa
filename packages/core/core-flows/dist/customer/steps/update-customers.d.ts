import { FilterableCustomerProps, CustomerUpdatableFields } from "@medusajs/types";
type UpdateCustomersStepInput = {
    selector: FilterableCustomerProps;
    update: CustomerUpdatableFields;
};
export declare const updateCustomersStepId = "update-customer";
export declare const updateCustomersStep: import("@medusajs/workflows-sdk").StepFunction<UpdateCustomersStepInput, import("@medusajs/types").CustomerDTO[]>;
export {};
