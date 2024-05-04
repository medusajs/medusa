import { CreateLineItemAdjustmentDTO } from "@medusajs/types";
interface StepInput {
    lineItemAdjustmentsToCreate: CreateLineItemAdjustmentDTO[];
}
export declare const createLineItemAdjustmentsStepId = "create-line-item-adjustments";
export declare const createLineItemAdjustmentsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
