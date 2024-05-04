import { CartWorkflowDTO, ItemTaxLineDTO, ShippingTaxLineDTO } from "@medusajs/types";
interface StepInput {
    cart: CartWorkflowDTO;
    item_tax_lines: ItemTaxLineDTO[];
    shipping_tax_lines: ShippingTaxLineDTO[];
}
export declare const setTaxLinesForItemsStepId = "set-tax-lines-for-items";
export declare const setTaxLinesForItemsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, null>;
export {};
