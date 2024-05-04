import { BatchPriceListPricesWorkflowDTO, BatchPriceListPricesWorkflowResult } from "@medusajs/types";
export declare const batchPriceListPricesWorkflowId = "batch-price-list-prices";
export declare const batchPriceListPricesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<{
    data: BatchPriceListPricesWorkflowDTO;
}, BatchPriceListPricesWorkflowResult, Record<string, Function>>;
