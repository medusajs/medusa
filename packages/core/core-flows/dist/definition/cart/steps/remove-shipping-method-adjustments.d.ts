interface StepInput {
    shippingMethodAdjustmentIdsToRemove: string[];
}
export declare const removeShippingMethodAdjustmentsStepId = "remove-shipping-method-adjustments";
export declare const removeShippingMethodAdjustmentsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
