import { ProductTypes } from "@medusajs/types";
type UpdateProductVariantsStepInput = {
    selector: ProductTypes.FilterableProductVariantProps;
    update: ProductTypes.UpdateProductVariantDTO;
} | {
    product_variants: ProductTypes.UpsertProductVariantDTO[];
};
export declare const updateProductVariantsStepId = "update-product-variants";
export declare const updateProductVariantsStep: import("@medusajs/workflows-sdk").StepFunction<UpdateProductVariantsStepInput, ProductTypes.ProductVariantDTO[]>;
export {};
