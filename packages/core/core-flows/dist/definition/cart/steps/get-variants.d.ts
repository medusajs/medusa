import { FilterableProductVariantProps, FindConfig, ProductVariantDTO } from "@medusajs/types";
interface StepInput {
    filter?: FilterableProductVariantProps;
    config?: FindConfig<ProductVariantDTO>;
}
export declare const getVariantsStepId = "get-variants";
export declare const getVariantsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, ProductVariantDTO[]>;
export {};
