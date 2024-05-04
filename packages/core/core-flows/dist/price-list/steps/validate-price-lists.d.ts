import { PriceListDTO, UpdatePriceListDTO } from "@medusajs/types";
export declare const validatePriceListsStepId = "validate-price-lists";
export declare const validatePriceListsStep: import("@medusajs/workflows-sdk").StepFunction<Pick<UpdatePriceListDTO, "id">[], Record<string, PriceListDTO>>;
