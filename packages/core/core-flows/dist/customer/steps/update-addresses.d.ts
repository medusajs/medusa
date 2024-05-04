import { UpdateCustomerAddressDTO, FilterableCustomerAddressProps } from "@medusajs/types";
type UpdateCustomerAddresseStepInput = {
    selector: FilterableCustomerAddressProps;
    update: UpdateCustomerAddressDTO;
};
export declare const updateCustomerAddresseStepId = "update-customer-addresses";
export declare const updateCustomerAddressesStep: import("@medusajs/workflows-sdk").StepFunction<UpdateCustomerAddresseStepInput, import("@medusajs/types").CustomerAddressDTO[]>;
export {};
