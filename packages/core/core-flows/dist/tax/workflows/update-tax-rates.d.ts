import { FilterableTaxRateProps, TaxRateDTO, UpdateTaxRateDTO } from "@medusajs/types";
type UpdateTaxRatesStepInput = {
    selector: FilterableTaxRateProps;
    update: UpdateTaxRateDTO;
};
export declare const updateTaxRatesWorkflowId = "update-tax-rates";
export declare const updateTaxRatesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateTaxRatesStepInput, TaxRateDTO[], Record<string, Function>>;
export {};
