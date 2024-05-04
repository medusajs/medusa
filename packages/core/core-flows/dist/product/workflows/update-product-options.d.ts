import { ProductTypes } from "@medusajs/types";
type UpdateProductOptionsStepInput = {
    selector: ProductTypes.FilterableProductOptionProps;
    update: ProductTypes.UpdateProductOptionDTO;
};
export declare const updateProductOptionsWorkflowId = "update-product-options";
export declare const updateProductOptionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateProductOptionsStepInput, ProductTypes.ProductOptionDTO[], Record<string, Function>>;
export {};
