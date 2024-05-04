import { ProductTypes, PricingTypes } from "@medusajs/types";
type WorkflowInput = {
    product_variants: (ProductTypes.CreateProductVariantDTO & {
        prices?: PricingTypes.CreateMoneyAmountDTO[];
    })[];
};
export declare const createProductVariantsWorkflowId = "create-product-variants";
export declare const createProductVariantsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, ProductTypes.ProductVariantDTO[], Record<string, Function>>;
export {};
