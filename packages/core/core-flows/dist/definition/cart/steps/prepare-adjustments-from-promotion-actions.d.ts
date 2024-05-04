import { ComputeActions } from "@medusajs/types";
interface StepInput {
    actions: ComputeActions[];
}
export declare const prepareAdjustmentsFromPromotionActionsStepId = "prepare-adjustments-from-promotion-actions";
export declare const prepareAdjustmentsFromPromotionActionsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, {
    lineItemAdjustmentsToCreate: {
        code: string;
        amount: number;
        item_id: string;
        promotion_id: string | undefined;
    }[];
    lineItemAdjustmentIdsToRemove: string[];
    shippingMethodAdjustmentsToCreate: {
        code: string;
        amount: number;
        shipping_method_id: string;
        promotion_id: string | undefined;
    }[];
    shippingMethodAdjustmentIdsToRemove: string[];
}>;
export {};
