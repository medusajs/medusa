import { PricingTypes, ProductTypes } from "@medusajs/types";
type UpdateProductVariantsStepInput = {
    selector: ProductTypes.FilterableProductVariantProps;
    update: ProductTypes.UpdateProductVariantDTO & {
        prices?: Partial<PricingTypes.CreateMoneyAmountDTO>[];
    };
} | {
    product_variants: (ProductTypes.UpsertProductVariantDTO & {
        prices?: Partial<PricingTypes.CreateMoneyAmountDTO>[];
    })[];
};
export declare const updateProductVariantsWorkflowId = "update-product-variants";
export declare const updateProductVariantsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateProductVariantsStepInput, ProductTypes.ProductVariantDTO[], Record<string, Function>>;
export {};
