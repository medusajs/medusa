import { CartDTO } from "@medusajs/types";
interface StepInput {
    cart: CartDTO;
}
export declare const getActionsToComputeFromPromotionsStepId = "get-actions-to-compute-from-promotions";
export declare const getActionsToComputeFromPromotionsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").ComputeActions[]>;
export {};
