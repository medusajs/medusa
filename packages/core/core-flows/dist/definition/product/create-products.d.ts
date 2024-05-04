import { TransactionStepsDefinition } from "@medusajs/orchestration";
import { ProductTypes, WorkflowTypes } from "@medusajs/types";
export declare enum CreateProductsActions {
    prepare = "prepare",
    createProducts = "createProducts",
    attachToSalesChannel = "attachToSalesChannel",
    attachShippingProfile = "attachShippingProfile",
    createPrices = "createPrices",
    createInventoryItems = "createInventoryItems",
    attachInventoryItems = "attachInventoryItems"
}
export declare const workflowSteps: TransactionStepsDefinition;
export declare const createProducts: import("@medusajs/workflows-sdk").MainExportedWorkflow<WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO, ProductTypes.ProductDTO[]>;
