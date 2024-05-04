import { UpdateCustomerAddressDTO, FilterableCustomerAddressProps, ICustomerModuleService } from "@medusajs/types";
import { StepResponse } from "@medusajs/workflows-sdk";
export declare const unsetForUpdate: (data: {
    selector: FilterableCustomerAddressProps;
    update: UpdateCustomerAddressDTO;
}, customerService: ICustomerModuleService, field: "is_default_billing" | "is_default_shipping") => Promise<StepResponse<undefined, undefined> | StepResponse<undefined, string[]>>;
