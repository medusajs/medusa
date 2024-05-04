import { InventoryNext } from "@medusajs/types";
interface WorkflowInput {
    updates: InventoryNext.UpdateInventoryItemInput[];
}
export declare const updateInventoryItemsWorkflowId = "update-inventory-items-workflow";
export declare const updateInventoryItemsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, InventoryNext.InventoryItemDTO[], Record<string, Function>>;
export {};
