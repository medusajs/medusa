import { BigNumberInput, CartLikeWithTotals } from "@medusajs/types";
interface TotalsConfig {
    includeTaxes?: boolean;
}
export interface DecorateCartLikeInputDTO {
    items?: {
        id?: string;
        unit_price: BigNumberInput;
        quantity: BigNumberInput;
        adjustments?: {
            amount: BigNumberInput;
        }[];
        tax_lines?: {
            rate: BigNumberInput;
            is_tax_inclusive?: boolean;
        }[];
    }[];
    shipping_methods?: {
        id?: string;
        amount: BigNumberInput;
        adjustments?: {
            amount: BigNumberInput;
        }[];
        tax_lines?: {
            rate: BigNumberInput;
            is_tax_inclusive?: boolean;
        }[];
    }[];
    region?: {
        automatic_taxes?: boolean;
    };
}
export declare function decorateCartTotals(cartLike: DecorateCartLikeInputDTO, config?: TotalsConfig): CartLikeWithTotals;
export {};
