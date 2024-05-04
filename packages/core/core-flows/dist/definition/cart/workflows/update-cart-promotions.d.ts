import { PromotionActions } from "@medusajs/utils";
type WorkflowInput = {
    promoCodes: string[];
    cartId: string;
    action?: PromotionActions.ADD | PromotionActions.REMOVE | PromotionActions.REPLACE;
};
export declare const updateCartPromotionsWorkflowId = "update-cart-promotions";
export declare const updateCartPromotionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
