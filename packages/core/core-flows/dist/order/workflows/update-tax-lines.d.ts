import { OrderLineItemDTO, OrderShippingMethodDTO } from "@medusajs/types";
type WorkflowInput = {
    order_id: string;
    items?: OrderLineItemDTO[];
    shipping_methods?: OrderShippingMethodDTO[];
    force_tax_calculation?: boolean;
};
export declare const updateOrderTaxLinesWorkflowId = "update-order-tax-lines";
export declare const updateOrderTaxLinesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
