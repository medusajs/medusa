import { CreatePriceListPricesWorkflowDTO } from "@medusajs/types";
import { PricingTypes } from "@medusajs/types/src";
export declare const createPriceListPricesWorkflowId = "create-price-list-prices";
export declare const createPriceListPricesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<{
    data: CreatePriceListPricesWorkflowDTO[];
}, PricingTypes.PriceDTO[], Record<string, Function>>;
