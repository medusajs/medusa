import { BatchWorkflowInput, CreateProductVariantWorkflowInputDTO, UpdateProductVariantWorkflowInputDTO } from "@medusajs/types";
export declare const batchProductVariantsStepId = "batch-product-variants";
export declare const batchProductVariantsStep: import("@medusajs/workflows-sdk").StepFunction<BatchWorkflowInput<CreateProductVariantWorkflowInputDTO, UpdateProductVariantWorkflowInputDTO>, {
    created: import("@medusajs/types").ProductVariantDTO[];
    updated: import("@medusajs/types").ProductVariantDTO[];
    deleted: {
        ids: string[];
        object: string;
        deleted: boolean;
    };
}>;
