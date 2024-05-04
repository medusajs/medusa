import { PaymentProviderContext, PaymentSessionDTO } from "@medusajs/types";
interface WorkflowInput {
    payment_collection_id: string;
    provider_id: string;
    data?: Record<string, unknown>;
    context?: PaymentProviderContext;
}
export declare const createPaymentSessionsWorkflowId = "create-payment-sessions";
export declare const createPaymentSessionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, PaymentSessionDTO, Record<string, Function>>;
export {};
