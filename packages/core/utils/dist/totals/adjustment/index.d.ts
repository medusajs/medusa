import { AdjustmentLineDTO, BigNumberInput } from "@medusajs/types";
export declare function calculateAdjustmentTotal({ adjustments, includesTax, taxRate, }: {
    adjustments: Pick<AdjustmentLineDTO, "amount">[];
    includesTax?: boolean;
    taxRate?: BigNumberInput;
}): import("bignumber.js").BigNumber;
