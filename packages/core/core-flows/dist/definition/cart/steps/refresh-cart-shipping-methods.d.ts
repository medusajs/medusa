import { CartDTO } from "@medusajs/types";
interface StepInput {
    cart: CartDTO;
}
export declare const refreshCartShippingMethodsStepId = "refresh-cart-shipping-methods";
export declare const refreshCartShippingMethodsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
