import { ProductTypes } from "@medusajs/types";
type UpdateCollectionsStepInput = {
    selector: ProductTypes.FilterableProductCollectionProps;
    update: ProductTypes.UpdateProductCollectionDTO;
};
export declare const updateCollectionsStepId = "update-collections";
export declare const updateCollectionsStep: import("@medusajs/workflows-sdk").StepFunction<UpdateCollectionsStepInput, ProductTypes.ProductCollectionDTO[]>;
export {};
