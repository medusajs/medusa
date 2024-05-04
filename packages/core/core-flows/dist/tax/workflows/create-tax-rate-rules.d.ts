import { CreateTaxRateRuleDTO, TaxRateRuleDTO } from "@medusajs/types";
type WorkflowInput = {
    rules: CreateTaxRateRuleDTO[];
};
export declare const createTaxRateRulesWorkflowId = "create-tax-rate-rules";
export declare const createTaxRateRulesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, TaxRateRuleDTO[], Record<string, Function>>;
export {};
