import { UpdatePriceListPricesWorkflowDTO } from "@medusajs/types";
import { PricingTypes } from "@medusajs/types/src";
export declare const updatePriceListPricesWorkflowId = "update-price-list-prices";
export declare const updatePriceListPricesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<{
    data: UpdatePriceListPricesWorkflowDTO[];
}, PricingTypes.PriceDTO[], Record<string, Function>>;
