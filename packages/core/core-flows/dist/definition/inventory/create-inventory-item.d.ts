import { InventoryTypes, WorkflowTypes } from "@medusajs/types";
export declare enum CreateInventoryItemActions {
    prepare = "prepare",
    createInventoryItems = "createInventoryItems"
}
export declare const createInventoryItems: import("@medusajs/workflows-sdk").MainExportedWorkflow<WorkflowTypes.InventoryWorkflow.CreateInventoryItemsWorkflowInputDTO, {
    tag: string;
    inventoryItem: InventoryTypes.InventoryItemDTO;
}[]>;
