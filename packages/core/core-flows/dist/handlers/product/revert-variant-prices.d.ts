import { PricingTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type HandlerInput = {
    createdLinks: Record<any, any>[];
    originalMoneyAmounts: PricingTypes.MoneyAmountDTO[];
    createdPriceSets: PricingTypes.PriceSetDTO[];
};
export declare function revertVariantPrices({ container, context, data, }: WorkflowArguments<HandlerInput>): Promise<void>;
export declare namespace revertVariantPrices {
    var aliases: {
        productVariantsPrices: string;
    };
}
export {};
