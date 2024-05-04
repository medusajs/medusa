import { ProductTypes, BatchWorkflowInput, CreateProductWorkflowInputDTO, UpdateProductWorkflowInputDTO } from "@medusajs/types";
import { BatchWorkflowOutput } from "@medusajs/types/src";
export declare const batchProductsWorkflowId = "batch-products";
export declare const batchProductsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<BatchWorkflowInput<CreateProductWorkflowInputDTO, UpdateProductWorkflowInputDTO>, BatchWorkflowOutput<ProductTypes.ProductDTO>, Record<string, Function>>;
