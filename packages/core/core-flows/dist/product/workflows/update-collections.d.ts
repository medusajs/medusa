import { ProductTypes } from "@medusajs/types";
type UpdateCollectionsStepInput = {
    selector: ProductTypes.FilterableProductCollectionProps;
    update: ProductTypes.UpdateProductCollectionDTO;
};
export declare const updateCollectionsWorkflowId = "update-collections";
export declare const updateCollectionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateCollectionsStepInput, ProductTypes.ProductCollectionDTO[], Record<string, Function>>;
export {};
