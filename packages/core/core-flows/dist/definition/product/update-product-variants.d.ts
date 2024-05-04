import { TransactionStepsDefinition } from "@medusajs/orchestration";
import { ProductTypes, WorkflowTypes } from "@medusajs/types";
export declare enum UpdateProductVariantsActions {
    prepare = "prepare",
    updateProductVariants = "updateProductVariants",
    revertProductVariantsUpdate = "revertProductVariantsUpdate",
    upsertPrices = "upsertPrices"
}
export declare const workflowSteps: TransactionStepsDefinition;
export declare const updateProductVariants: import("@medusajs/workflows-sdk").MainExportedWorkflow<WorkflowTypes.ProductWorkflow.UpdateProductVariantsWorkflowInputDTO, ProductTypes.ProductVariantDTO[]>;
