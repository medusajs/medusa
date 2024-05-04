import { AdjustmentLineDTO, TaxLineDTO } from "@medusajs/types";
import { BigNumber } from "../big-number";
interface GetShippingMethodsTotalsContext {
    includeTax?: boolean;
}
export interface GetShippingMethodTotalInput {
    id: string;
    amount: BigNumber;
    is_tax_inclusive?: boolean;
    tax_lines?: TaxLineDTO[];
    adjustments?: Pick<AdjustmentLineDTO, "amount">[];
}
export interface GetShippingMethodTotalOutput {
    amount: BigNumber;
    subtotal: BigNumber;
    total: BigNumber;
    original_total: BigNumber;
    discount_total: BigNumber;
    discount_tax_total: BigNumber;
    tax_total: BigNumber;
    original_tax_total: BigNumber;
}
export declare function getShippingMethodsTotals(shippingMethods: GetShippingMethodTotalInput[], context: GetShippingMethodsTotalsContext): {};
export declare function getShippingMethodTotals(shippingMethod: GetShippingMethodTotalInput, context: GetShippingMethodsTotalsContext): GetShippingMethodTotalOutput;
export {};
