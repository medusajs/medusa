import { UpdatePriceListWorkflowInputDTO } from "@medusajs/types";
export declare const updatePriceListsWorkflowId = "update-price-lists";
export declare const updatePriceListsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<{
    price_lists_data: UpdatePriceListWorkflowInputDTO[];
}, void, Record<string, Function>>;
