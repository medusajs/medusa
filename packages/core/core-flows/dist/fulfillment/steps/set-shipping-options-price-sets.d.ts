type SetShippingOptionsPriceSetsStepInput = {
    id: string;
    price_sets?: string[];
}[];
export declare const setShippingOptionsPriceSetsStepId = "set-shipping-options-price-sets-step";
export declare const setShippingOptionsPriceSetsStep: import("@medusajs/workflows-sdk").StepFunction<SetShippingOptionsPriceSetsStepInput, undefined>;
export {};
