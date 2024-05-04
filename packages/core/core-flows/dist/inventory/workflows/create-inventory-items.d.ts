import { InventoryNext } from "@medusajs/types";
interface WorkflowInput {
    items: InventoryNext.CreateInventoryItemInput[];
}
export declare const createInventoryItemsWorkflowId = "create-inventory-items-workflow";
export declare const createInventoryItemsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, InventoryNext.InventoryItemDTO[], Record<string, Function>>;
export {};
