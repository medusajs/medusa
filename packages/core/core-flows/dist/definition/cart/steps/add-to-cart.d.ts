import { CreateLineItemForCartDTO } from "@medusajs/types";
interface StepInput {
    items: CreateLineItemForCartDTO[];
}
export declare const addToCartStepId = "add-to-cart-step";
export declare const addToCartStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").CartLineItemDTO[]>;
export {};
