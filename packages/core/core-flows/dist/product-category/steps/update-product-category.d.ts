import { UpdateProductCategoryDTO } from "@medusajs/types";
type UpdateProductCategoryStepInput = {
    id: string;
    data: UpdateProductCategoryDTO;
};
export declare const updateProductCategoryStepId = "update-product-category";
export declare const updateProductCategoryStep: import("@medusajs/workflows-sdk").StepFunction<UpdateProductCategoryStepInput, import("@medusajs/types").ProductCategoryDTO>;
export {};
