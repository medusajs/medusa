import { CartLineItemDTO, CartShippingMethodDTO, CartWorkflowDTO } from "@medusajs/types";
type WorkflowInput = {
    cart_or_cart_id: string | CartWorkflowDTO;
    items?: CartLineItemDTO[];
    shipping_methods?: CartShippingMethodDTO[];
    force_tax_calculation?: boolean;
};
export declare const updateTaxLinesWorkflowId = "update-tax-lines";
export declare const updateTaxLinesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
