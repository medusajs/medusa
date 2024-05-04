import { CustomerGroupDTO, FilterableCustomerGroupProps, CustomerGroupUpdatableFields } from "@medusajs/types";
type WorkflowInput = {
    selector: FilterableCustomerGroupProps;
    update: CustomerGroupUpdatableFields;
};
export declare const updateCustomerGroupsWorkflowId = "update-customer-groups";
export declare const updateCustomerGroupsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, CustomerGroupDTO[], Record<string, Function>>;
export {};
