import { ProductTypes } from "@medusajs/types";
type WorkflowInput = {
    collections: ProductTypes.CreateProductCollectionDTO[];
};
export declare const createCollectionsWorkflowId = "create-collections";
export declare const createCollectionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, ProductTypes.ProductCollectionDTO[], Record<string, Function>>;
export {};
