import { AdjustmentLineDTO, TaxLineDTO } from "@medusajs/types";
import { BigNumber } from "../big-number";
interface GetLineItemsTotalsContext {
    includeTax?: boolean;
}
export interface GetItemTotalInput {
    id: string;
    unit_price: BigNumber;
    quantity: BigNumber;
    is_tax_inclusive?: boolean;
    tax_lines?: Pick<TaxLineDTO, "rate">[];
    adjustments?: Pick<AdjustmentLineDTO, "amount">[];
}
export interface GetItemTotalOutput {
    quantity: BigNumber;
    unit_price: BigNumber;
    subtotal: BigNumber;
    total: BigNumber;
    original_total: BigNumber;
    discount_total: BigNumber;
    discount_tax_total: BigNumber;
    tax_total: BigNumber;
    original_tax_total: BigNumber;
}
export declare function getLineItemsTotals(items: GetItemTotalInput[], context: GetLineItemsTotalsContext): {};
export {};
