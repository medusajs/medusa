import { CreateProductCategoryDTO } from "@medusajs/types";
type CreateProductCategoryStepInput = {
    product_category: CreateProductCategoryDTO;
};
export declare const createProductCategoryStepId = "create-product-category";
export declare const createProductCategoryStep: import("@medusajs/workflows-sdk").StepFunction<CreateProductCategoryStepInput, import("@medusajs/types").ProductCategoryDTO>;
export {};
