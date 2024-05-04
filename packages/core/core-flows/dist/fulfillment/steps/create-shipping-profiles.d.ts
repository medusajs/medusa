import { CreateShippingProfileDTO } from "@medusajs/types";
type StepInput = CreateShippingProfileDTO[];
export declare const createShippingProfilesStepId = "create-shipping-profiles";
export declare const createShippingProfilesStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").ShippingProfileDTO[]>;
export {};
