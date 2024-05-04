interface PriceCurrencyCode {
    currency_code: string;
    amount: number;
}
interface PriceRegionId {
    region_id: string;
    amount: number;
}
type StepInput = {
    id: string;
    prices: (PriceCurrencyCode | PriceRegionId)[];
}[];
export declare const createShippingOptionsPriceSetsStepId = "add-shipping-options-prices-step";
export declare const createShippingOptionsPriceSetsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, {
    id: string;
    priceSetId: string;
}[]>;
export {};
