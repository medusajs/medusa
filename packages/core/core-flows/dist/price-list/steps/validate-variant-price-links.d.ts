export declare const validateVariantPriceLinksStepId = "validate-variant-price-links";
export declare const validateVariantPriceLinksStep: import("@medusajs/workflows-sdk").StepFunction<{
    prices?: {
        variant_id: string;
    }[] | undefined;
}[], Record<string, string>>;
