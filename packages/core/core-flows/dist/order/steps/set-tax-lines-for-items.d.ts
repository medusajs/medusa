import { ItemTaxLineDTO, OrderDTO, ShippingTaxLineDTO } from "@medusajs/types";
interface StepInput {
    order: OrderDTO;
    item_tax_lines: ItemTaxLineDTO[];
    shipping_tax_lines: ShippingTaxLineDTO[];
}
export declare const setOrderTaxLinesForItemsStepId = "set-order-tax-lines-for-items";
export declare const setOrderTaxLinesForItemsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
