type StepInput = {
    links: {
        variant_id: string;
        price_set_id: string;
    }[];
};
export declare const createVariantPricingLinkStepId = "create-variant-pricing-link";
export declare const createVariantPricingLinkStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
