import { ProductTypes } from "@medusajs/types";
type UpdateProductsStepInput = {
    selector: ProductTypes.FilterableProductProps;
    update: ProductTypes.UpdateProductDTO;
} | {
    products: ProductTypes.UpsertProductDTO[];
};
export declare const updateProductsWorkflowId = "update-products";
export declare const updateProductsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateProductsStepInput, ProductTypes.ProductDTO[], Record<string, Function>>;
export {};
