import { ProductTypes } from "@medusajs/types";
type WorkflowInput = {
    product_types: ProductTypes.CreateProductTypeDTO[];
};
export declare const createProductTypesWorkflowId = "create-product-types";
export declare const createProductTypesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, ProductTypes.ProductTypeDTO[], Record<string, Function>>;
export {};
