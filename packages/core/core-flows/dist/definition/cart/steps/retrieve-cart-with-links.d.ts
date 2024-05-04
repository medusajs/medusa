import { CartWorkflowDTO } from "@medusajs/types";
interface StepInput {
    cart_or_cart_id: string | CartWorkflowDTO;
    fields: string[];
}
export declare const retrieveCartWithLinksStepId = "retrieve-cart-with-links";
export declare const retrieveCartWithLinksStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, any>;
export {};
