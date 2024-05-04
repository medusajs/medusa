interface StepInput {
    lineItemAdjustmentIdsToRemove: string[];
}
export declare const removeLineItemAdjustmentsStepId = "remove-line-item-adjustments";
export declare const removeLineItemAdjustmentsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
