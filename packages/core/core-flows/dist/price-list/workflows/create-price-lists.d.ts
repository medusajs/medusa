import { CreatePriceListWorkflowInputDTO, PriceListDTO } from "@medusajs/types";
type WorkflowInput = {
    price_lists_data: CreatePriceListWorkflowInputDTO[];
};
export declare const createPriceListsWorkflowId = "create-price-lists";
export declare const createPriceListsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, PriceListDTO[], Record<string, Function>>;
export {};
