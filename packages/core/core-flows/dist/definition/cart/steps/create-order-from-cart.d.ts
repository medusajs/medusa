import { CartWorkflowDTO } from "@medusajs/types";
interface StepInput {
    cart: CartWorkflowDTO;
}
export declare const createOrderFromCartStepId = "create-order-from-cart";
export declare const createOrderFromCartStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").OrderDTO>;
export {};
