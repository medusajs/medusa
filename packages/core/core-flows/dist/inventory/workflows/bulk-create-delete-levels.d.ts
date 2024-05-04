import { InventoryLevelDTO, InventoryNext } from "@medusajs/types";
interface WorkflowInput {
    creates: InventoryNext.CreateInventoryLevelInput[];
    deletes: {
        inventory_item_id: string;
        location_id: string;
    }[];
}
export declare const bulkCreateDeleteLevelsWorkflowId = "bulk-create-delete-levels-workflow";
export declare const bulkCreateDeleteLevelsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, InventoryLevelDTO[], Record<string, Function>>;
export {};
