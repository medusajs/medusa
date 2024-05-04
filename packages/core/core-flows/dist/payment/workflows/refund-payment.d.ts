import { BigNumberInput } from "@medusajs/types";
export declare const refundPaymentWorkflowId = "refund-payment-workflow";
export declare const refundPaymentWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<{
    payment_id: string;
    created_by?: string | undefined;
    amount?: BigNumberInput | undefined;
}, import("@medusajs/types").PaymentDTO, Record<string, Function>>;
