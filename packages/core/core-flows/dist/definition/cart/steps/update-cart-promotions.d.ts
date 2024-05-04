import { PromotionActions } from "@medusajs/utils";
interface StepInput {
    id: string;
    promo_codes?: string[];
    action?: PromotionActions.ADD | PromotionActions.REMOVE | PromotionActions.REPLACE;
}
export declare const updateCartPromotionsStepId = "update-cart-promotions";
export declare const updateCartPromotionsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, null>;
export {};
