import { BigNumberInput, PaymentDTO } from "@medusajs/types";
export declare const capturePaymentWorkflowId = "capture-payment-workflow";
export declare const capturePaymentWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<{
    payment_id: string;
    captured_by?: string | undefined;
    amount?: BigNumberInput | undefined;
}, PaymentDTO, Record<string, Function>>;
