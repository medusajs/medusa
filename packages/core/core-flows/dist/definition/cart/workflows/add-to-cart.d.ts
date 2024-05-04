import { AddToCartWorkflowInputDTO } from "@medusajs/types";
export declare const addToCartWorkflowId = "add-to-cart";
export declare const addToCartWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<AddToCartWorkflowInputDTO, import("@medusajs/types").CartLineItemDTO[], Record<string, Function>>;
