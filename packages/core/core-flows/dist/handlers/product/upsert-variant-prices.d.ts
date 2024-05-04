import { BigNumberInput, PricingTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type VariantPrice = {
    id?: string;
    region_id?: string;
    currency_code: string;
    amount: BigNumberInput;
    min_quantity?: BigNumberInput;
    max_quantity?: BigNumberInput;
    rules: Record<string, string>;
};
type HandlerInput = {
    variantPricesMap: Map<string, VariantPrice[]>;
};
export declare function upsertVariantPrices({ container, data, }: WorkflowArguments<HandlerInput>): Promise<{
    createdLinks: any;
    originalMoneyAmounts: any;
    createdPriceSets: PricingTypes.PriceSetDTO[];
}>;
export declare namespace upsertVariantPrices {
    var aliases: {
        productVariantsPrices: string;
    };
}
export {};
