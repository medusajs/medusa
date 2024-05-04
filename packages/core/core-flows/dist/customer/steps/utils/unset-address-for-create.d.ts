import { CreateCustomerAddressDTO, ICustomerModuleService } from "@medusajs/types";
import { StepResponse } from "@medusajs/workflows-sdk";
export declare const unsetForCreate: (data: CreateCustomerAddressDTO[], customerService: ICustomerModuleService, field: "is_default_billing" | "is_default_shipping") => Promise<StepResponse<undefined, string[]>>;
