import { PriceDTO, PriceListRuleDTO, PriceRuleDTO, ProductVariantDTO, UpdatePriceListPriceDTO } from "@medusajs/types";
export declare function buildPriceListRules(priceListRules?: PriceListRuleDTO[]): Record<string, string[]> | undefined;
export declare function buildPriceSetRules(priceRules?: PriceRuleDTO[]): Record<string, string> | undefined;
export declare function buildPriceSetPricesForCore(prices: (PriceDTO & {
    price_set?: PriceDTO["price_set"] & {
        variant?: ProductVariantDTO;
    };
})[]): Record<string, any>[];
export declare function buildPriceSetPricesForModule(prices: PriceDTO[]): UpdatePriceListPriceDTO[];
