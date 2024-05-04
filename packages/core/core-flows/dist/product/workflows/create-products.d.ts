import { ProductTypes } from "@medusajs/types";
import { CreateProductWorkflowInputDTO } from "@medusajs/types/src";
type WorkflowInput = {
    products: CreateProductWorkflowInputDTO[];
};
export declare const createProductsWorkflowId = "create-products";
export declare const createProductsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, ProductTypes.ProductDTO[], Record<string, Function>>;
export {};
