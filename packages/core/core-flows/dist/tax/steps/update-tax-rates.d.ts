import { FilterableTaxRateProps, UpdateTaxRateDTO } from "@medusajs/types";
type UpdateTaxRatesStepInput = {
    selector: FilterableTaxRateProps;
    update: UpdateTaxRateDTO;
};
export declare const updateTaxRatesStepId = "update-tax-rates";
export declare const updateTaxRatesStep: import("@medusajs/workflows-sdk").StepFunction<UpdateTaxRatesStepInput, import("@medusajs/types").TaxRateDTO[]>;
export {};
