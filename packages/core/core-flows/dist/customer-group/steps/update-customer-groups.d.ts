import { CustomerGroupUpdatableFields, FilterableCustomerGroupProps } from "@medusajs/types";
type UpdateCustomerGroupStepInput = {
    selector: FilterableCustomerGroupProps;
    update: CustomerGroupUpdatableFields;
};
export declare const updateCustomerGroupStepId = "update-customer-groups";
export declare const updateCustomerGroupsStep: import("@medusajs/workflows-sdk").StepFunction<UpdateCustomerGroupStepInput, import("@medusajs/types").CustomerGroupDTO[]>;
export {};
