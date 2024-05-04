import { CreateShippingMethodAdjustmentDTO } from "@medusajs/types";
interface StepInput {
    shippingMethodAdjustmentsToCreate: CreateShippingMethodAdjustmentDTO[];
}
export declare const createShippingMethodAdjustmentsStepId = "create-shipping-method-adjustments";
export declare const createShippingMethodAdjustmentsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
