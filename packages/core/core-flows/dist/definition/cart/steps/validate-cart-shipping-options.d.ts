import { CartDTO } from "@medusajs/types";
interface StepInput {
    cart: CartDTO;
    option_ids: string[];
}
export declare const validateCartShippingOptionsStepId = "validate-cart-shipping-options";
export declare const validateCartShippingOptionsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
