import { ProductTypes } from "@medusajs/types";
type UpdateProductOptionsStepInput = {
    selector: ProductTypes.FilterableProductOptionProps;
    update: ProductTypes.UpdateProductOptionDTO;
};
export declare const updateProductOptionsStepId = "update-product-options";
export declare const updateProductOptionsStep: import("@medusajs/workflows-sdk").StepFunction<UpdateProductOptionsStepInput, ProductTypes.ProductOptionDTO[]>;
export {};
