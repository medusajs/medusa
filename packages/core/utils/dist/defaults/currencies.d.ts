export type Currency = {
    symbol: string;
    name: string;
    symbol_native: string;
    decimal_digits: number;
    rounding: number;
    code: string;
    name_plural: string;
};
export declare const defaultCurrencies: Record<string, Currency>;
