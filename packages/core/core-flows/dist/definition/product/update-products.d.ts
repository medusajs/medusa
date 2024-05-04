import { ProductTypes, WorkflowTypes } from "@medusajs/types";
import { TransactionStepsDefinition } from "@medusajs/orchestration";
export declare enum UpdateProductsActions {
    prepare = "prepare",
    updateProducts = "updateProducts",
    attachSalesChannels = "attachSalesChannels",
    detachSalesChannels = "detachSalesChannels",
    createInventoryItems = "createInventoryItems",
    attachInventoryItems = "attachInventoryItems",
    detachInventoryItems = "detachInventoryItems",
    removeInventoryItems = "removeInventoryItems"
}
export declare const updateProductsWorkflowSteps: TransactionStepsDefinition;
export declare const updateProducts: import("@medusajs/workflows-sdk").MainExportedWorkflow<WorkflowTypes.ProductWorkflow.UpdateProductsWorkflowInputDTO, ProductTypes.ProductDTO[]>;
