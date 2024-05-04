import { CreateCustomerAddressDTO, UpdateCustomerAddressDTO, FilterableCustomerAddressProps } from "@medusajs/types";
type StepInput = {
    create?: CreateCustomerAddressDTO[];
    update?: {
        selector: FilterableCustomerAddressProps;
        update: UpdateCustomerAddressDTO;
    };
};
export declare const maybeUnsetDefaultBillingAddressesStepId = "maybe-unset-default-billing-customer-addresses";
export declare const maybeUnsetDefaultBillingAddressesStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
