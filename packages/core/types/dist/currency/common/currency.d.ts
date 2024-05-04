import { BaseFilterable } from "../../dal";
/**
 * @interface
 *
 * A currency's data.
 */
export interface CurrencyDTO {
    /**
     * The ISO 3 character code of the currency.
     *
     * @example
     * usd
     */
    code: string;
    /**
     * The symbol of the currency.
     *
     * @example
     * $
     */
    symbol: string;
    /**
     * The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
     *
     * @example
     * $
     */
    symbol_native: string;
    /**
     * The name of the currency.
     *
     * @example
     * US Dollar
     */
    name: string;
}
/**
 * @interface
 *
 * Filters to apply on a currency.
 */
export interface FilterableCurrencyProps extends BaseFilterable<FilterableCurrencyProps> {
    /**
     * Search through currencies using this search term.
     */
    q?: string;
    /**
     * The codes to filter the currencies by.
     */
    code?: string[];
}
//# sourceMappingURL=currency.d.ts.map