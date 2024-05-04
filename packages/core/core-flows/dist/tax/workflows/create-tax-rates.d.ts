import { CreateTaxRateDTO, TaxRateDTO } from "@medusajs/types";
type WorkflowInput = CreateTaxRateDTO[];
export declare const createTaxRatesWorkflowId = "create-tax-rates";
export declare const createTaxRatesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, TaxRateDTO[], Record<string, Function>>;
export {};
