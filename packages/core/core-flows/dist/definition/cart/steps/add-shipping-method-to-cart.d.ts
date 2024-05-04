import { CreateShippingMethodDTO } from "@medusajs/types";
interface StepInput {
    shipping_methods: CreateShippingMethodDTO[];
}
export declare const addShippingMethodToCartStepId = "add-shipping-method-to-cart-step";
export declare const addShippingMethodToCartStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").CartShippingMethodDTO[]>;
export {};
