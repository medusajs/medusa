import { OrderLineItemDTO, OrderShippingMethodDTO } from "@medusajs/types";
interface StepInput {
    order_id: string;
    items?: OrderLineItemDTO[];
    shipping_methods?: OrderShippingMethodDTO[];
    force_tax_calculation?: boolean;
}
export declare const updateOrderTaxLinesStepId = "update-order-tax-lines-step";
export declare const updateOrderTaxLinesStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, null>;
export {};
