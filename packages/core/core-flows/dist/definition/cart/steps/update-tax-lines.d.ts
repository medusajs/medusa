import { CartLineItemDTO, CartShippingMethodDTO, CartWorkflowDTO } from "@medusajs/types";
interface StepInput {
    cart_or_cart_id: CartWorkflowDTO | string;
    items?: CartLineItemDTO[];
    shipping_methods?: CartShippingMethodDTO[];
    force_tax_calculation?: boolean;
}
export declare const updateTaxLinesStepId = "update-tax-lines-step";
export declare const updateTaxLinesStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, null>;
export {};
