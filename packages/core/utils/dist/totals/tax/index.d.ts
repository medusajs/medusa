import { BigNumberInput, TaxLineDTO } from "@medusajs/types";
export declare function calculateTaxTotal({ taxLines, includesTax, taxableAmount, setTotalField, }: {
    taxLines: Pick<TaxLineDTO, "rate">[];
    includesTax?: boolean;
    taxableAmount: BigNumberInput;
    setTotalField?: string;
}): import("bignumber.js").BigNumber;
