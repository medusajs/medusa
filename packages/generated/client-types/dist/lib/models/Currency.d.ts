/**
 * Currency
 */
export interface Currency {
    /**
     * The 3 character ISO code for the currency.
     */
    code: string;
    /**
     * The symbol used to indicate the currency.
     */
    symbol: string;
    /**
     * The native symbol used to indicate the currency.
     */
    symbol_native: string;
    /**
     * The written name of the currency
     */
    name: string;
    /**
     * Whether the currency prices include tax
     */
    includes_tax?: boolean;
}
