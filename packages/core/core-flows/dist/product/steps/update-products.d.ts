import { ProductTypes } from "@medusajs/types";
type UpdateProductsStepInput = {
    selector: ProductTypes.FilterableProductProps;
    update: ProductTypes.UpdateProductDTO;
} | {
    products: ProductTypes.UpsertProductDTO[];
};
export declare const updateProductsStepId = "update-products";
export declare const updateProductsStep: import("@medusajs/workflows-sdk").StepFunction<UpdateProductsStepInput, ProductTypes.ProductDTO[]>;
export {};
