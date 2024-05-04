import { InventoryLevelDTO, InventoryNext } from "@medusajs/types";
interface WorkflowInput {
    inventory_levels: InventoryNext.CreateInventoryLevelInput[];
}
export declare const createInventoryLevelsWorkflowId = "create-inventory-levels-workflow";
export declare const createInventoryLevelsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, InventoryLevelDTO[], Record<string, Function>>;
export {};
