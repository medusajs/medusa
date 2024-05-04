import { CartLineItemDTO, CartShippingMethodDTO, CartWorkflowDTO, ItemTaxLineDTO, ShippingTaxLineDTO } from "@medusajs/types";
interface StepInput {
    cart: CartWorkflowDTO;
    items: CartLineItemDTO[];
    shipping_methods: CartShippingMethodDTO[];
    force_tax_calculation?: boolean;
}
export declare const getItemTaxLinesStepId = "get-item-tax-lines";
export declare const getItemTaxLinesStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, {
    lineItemTaxLines: ItemTaxLineDTO[];
    shippingMethodsTaxLines: ShippingTaxLineDTO[];
}>;
export {};
