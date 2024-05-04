interface StepInput {
    variantIds: string[];
    context?: Record<string, unknown>;
}
export declare const getVariantPriceSetsStepId = "get-variant-price-sets";
export declare const getVariantPriceSetsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, any>;
export {};
