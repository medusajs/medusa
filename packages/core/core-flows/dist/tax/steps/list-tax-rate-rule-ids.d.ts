import { FilterableTaxRateRuleProps } from "@medusajs/types";
type StepInput = {
    selector: FilterableTaxRateRuleProps;
};
export declare const listTaxRateRuleIdsStepId = "list-tax-rate-rule-ids";
export declare const listTaxRateRuleIdsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, string[]>;
export {};
