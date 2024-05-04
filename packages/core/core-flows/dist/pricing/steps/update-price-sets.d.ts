import { PricingTypes } from "@medusajs/types";
type UpdatePriceSetsStepInput = {
    selector?: PricingTypes.FilterablePriceSetProps;
    update?: PricingTypes.UpdatePriceSetDTO;
} | {
    price_sets: PricingTypes.UpsertPriceSetDTO[];
};
export declare const updatePriceSetsStepId = "update-price-sets";
export declare const updatePriceSetsStep: import("@medusajs/workflows-sdk").StepFunction<UpdatePriceSetsStepInput, PricingTypes.PriceSetDTO[]>;
export {};
