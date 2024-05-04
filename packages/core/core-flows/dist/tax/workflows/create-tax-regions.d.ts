import { CreateTaxRegionDTO, TaxRegionDTO } from "@medusajs/types";
type WorkflowInput = CreateTaxRegionDTO[];
export declare const createTaxRegionsWorkflowId = "create-tax-regions";
export declare const createTaxRegionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, TaxRegionDTO[], Record<string, Function>>;
export {};
