import { StockLocationDTO } from "@medusajs/types";
import { FilterableStockLocationProps } from "@medusajs/types";
import { UpdateStockLocationInput } from "@medusajs/types";
interface WorkflowInput {
    selector: FilterableStockLocationProps;
    update: UpdateStockLocationInput;
}
export declare const updateStockLocationsWorkflowId = "update-stock-locations-workflow";
export declare const updateStockLocationsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, StockLocationDTO[], Record<string, Function>>;
export {};
