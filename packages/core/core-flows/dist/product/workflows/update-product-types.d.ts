import { ProductTypes } from "@medusajs/types";
type UpdateProductTypesStepInput = {
    selector: ProductTypes.FilterableProductTypeProps;
    update: ProductTypes.UpdateProductTypeDTO;
};
export declare const updateProductTypesWorkflowId = "update-product-types";
export declare const updateProductTypesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateProductTypesStepInput, ProductTypes.ProductTypeDTO[], Record<string, Function>>;
export {};
