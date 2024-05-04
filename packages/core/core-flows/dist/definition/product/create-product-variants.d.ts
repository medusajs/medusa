import { TransactionStepsDefinition } from "@medusajs/orchestration";
import { ProductTypes, WorkflowTypes } from "@medusajs/types";
export declare enum CreateProductVariantsActions {
    prepare = "prepare",
    createProductVariants = "createProductVariants",
    revertProductVariantsCreate = "revertProductVariantsCreate",
    upsertPrices = "upsertPrices"
}
export declare const workflowSteps: TransactionStepsDefinition;
export declare const createProductVariants: import("@medusajs/workflows-sdk").MainExportedWorkflow<WorkflowTypes.ProductWorkflow.CreateProductVariantsWorkflowInputDTO, ProductTypes.ProductVariantDTO[]>;
