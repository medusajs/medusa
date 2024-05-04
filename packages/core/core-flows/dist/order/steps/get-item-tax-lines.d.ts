import { ItemTaxLineDTO, OrderLineItemDTO, OrderShippingMethodDTO, OrderWorkflowDTO, ShippingTaxLineDTO } from "@medusajs/types";
interface StepInput {
    order: OrderWorkflowDTO;
    items: OrderLineItemDTO[];
    shipping_methods: OrderShippingMethodDTO[];
    force_tax_calculation?: boolean;
}
export declare const getOrderItemTaxLinesStepId = "get-order-item-tax-lines";
export declare const getOrderItemTaxLinesStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, {
    lineItemTaxLines: ItemTaxLineDTO[];
    shippingMethodsTaxLines: ShippingTaxLineDTO[];
}>;
export {};
