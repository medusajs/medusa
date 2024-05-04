import { ProductTypes } from "@medusajs/types";
type UpdateProductTypesStepInput = {
    selector: ProductTypes.FilterableProductTypeProps;
    update: ProductTypes.UpdateProductTypeDTO;
};
export declare const updateProductTypesStepId = "update-product-types";
export declare const updateProductTypesStep: import("@medusajs/workflows-sdk").StepFunction<UpdateProductTypesStepInput, ProductTypes.ProductTypeDTO[]>;
export {};
