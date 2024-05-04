import { BatchWorkflowInput, CreateProductWorkflowInputDTO, UpdateProductWorkflowInputDTO } from "@medusajs/types";
export declare const batchProductsStepId = "batch-products";
export declare const batchProductsStep: import("@medusajs/workflows-sdk").StepFunction<BatchWorkflowInput<CreateProductWorkflowInputDTO, UpdateProductWorkflowInputDTO>, {
    created: import("@medusajs/types").ProductDTO[];
    updated: import("@medusajs/types").ProductDTO[];
    deleted: {
        ids: string[];
        object: string;
        deleted: boolean;
    };
}>;
