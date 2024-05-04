import { FilterableTaxRateProps } from "@medusajs/types";
type StepInput = {
    selector: FilterableTaxRateProps;
};
export declare const listTaxRateIdsStepId = "list-tax-rate-ids";
export declare const listTaxRateIdsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, string[]>;
export {};
