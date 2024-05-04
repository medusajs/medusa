import { CreateTaxRateRuleDTO, TaxRateRuleDTO } from "@medusajs/types";
type WorkflowInput = {
    tax_rate_ids: string[];
    rules: Omit<CreateTaxRateRuleDTO, "tax_rate_id">[];
};
export declare const setTaxRateRulesWorkflowId = "set-tax-rate-rules";
export declare const setTaxRateRulesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, TaxRateRuleDTO[], Record<string, Function>>;
export {};
