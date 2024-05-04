import { ProductTypes } from "@medusajs/types";
type WorkflowInput = {
    product_options: ProductTypes.CreateProductOptionDTO[];
};
export declare const createProductOptionsWorkflowId = "create-product-options";
export declare const createProductOptionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, ProductTypes.ProductOptionDTO[], Record<string, Function>>;
export {};
