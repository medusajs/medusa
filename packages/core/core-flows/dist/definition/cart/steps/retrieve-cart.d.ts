import { CartDTO, FindConfig } from "@medusajs/types";
interface StepInput {
    id: string;
    config?: FindConfig<CartDTO>;
}
export declare const retrieveCartStepId = "retrieve-cart";
export declare const retrieveCartStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, CartDTO>;
export {};
