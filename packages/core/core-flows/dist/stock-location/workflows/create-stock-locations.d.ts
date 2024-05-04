import { CreateStockLocationInput } from "@medusajs/types";
interface WorkflowInput {
    locations: CreateStockLocationInput[];
}
export declare const createStockLocationsWorkflowId = "create-stock-locations-workflow";
export declare const createStockLocationsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, import("@medusajs/types").StockLocationDTO[], Record<string, Function>>;
export {};
