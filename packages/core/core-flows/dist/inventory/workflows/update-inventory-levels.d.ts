import { InventoryLevelDTO, InventoryNext } from "@medusajs/types";
interface WorkflowInput {
    updates: InventoryNext.BulkUpdateInventoryLevelInput[];
}
export declare const updateInventoryLevelsWorkflowId = "update-inventory-levels-workflow";
export declare const updateInventoryLevelsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, InventoryLevelDTO[], Record<string, Function>>;
export {};
