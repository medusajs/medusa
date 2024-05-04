import { CartDTO, CreatePaymentCollectionForCartWorkflowInputDTO } from "@medusajs/types";
export declare const createPaymentCollectionForCartWorkflowId = "create-payment-collection-for-cart";
export declare const createPaymentCollectionForCartWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<CreatePaymentCollectionForCartWorkflowInputDTO, CartDTO, Record<string, Function>>;
