import { CartDTO, CreateCartWorkflowInputDTO } from "@medusajs/types";
export declare const createCartWorkflowId = "create-cart";
export declare const createCartWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<CreateCartWorkflowInputDTO, CartDTO, Record<string, Function>>;
