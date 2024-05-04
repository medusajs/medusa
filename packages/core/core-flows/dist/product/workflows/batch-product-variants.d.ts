import { BatchWorkflowInput, BatchWorkflowOutput, ProductTypes, UpdateProductVariantWorkflowInputDTO, CreateProductVariantWorkflowInputDTO } from "@medusajs/types";
export declare const batchProductVariantsWorkflowId = "batch-product-variants";
export declare const batchProductVariantsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<BatchWorkflowInput<CreateProductVariantWorkflowInputDTO, UpdateProductVariantWorkflowInputDTO>, BatchWorkflowOutput<ProductTypes.ProductVariantDTO>, Record<string, Function>>;
