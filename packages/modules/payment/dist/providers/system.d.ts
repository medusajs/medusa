import { CreatePaymentProviderSession, PaymentProviderError, PaymentProviderSessionResponse, PaymentSessionStatus, ProviderWebhookPayload, WebhookActionResult } from "@medusajs/types";
import { AbstractPaymentProvider } from "@medusajs/utils";
export declare class SystemProviderService extends AbstractPaymentProvider {
    static identifier: string;
    static PROVIDER: string;
    getStatus(_: any): Promise<string>;
    getPaymentData(_: any): Promise<Record<string, unknown>>;
    initiatePayment(context: CreatePaymentProviderSession): Promise<PaymentProviderSessionResponse>;
    getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus>;
    retrievePayment(paymentSessionData: Record<string, unknown>): Promise<Record<string, unknown> | PaymentProviderError>;
    authorizePayment(_: any): Promise<PaymentProviderError | {
        status: PaymentSessionStatus;
        data: PaymentProviderSessionResponse["data"];
    }>;
    updatePayment(_: any): Promise<PaymentProviderError | PaymentProviderSessionResponse>;
    deletePayment(_: any): Promise<Record<string, unknown>>;
    capturePayment(_: any): Promise<Record<string, unknown>>;
    refundPayment(_: any): Promise<Record<string, unknown>>;
    cancelPayment(_: any): Promise<Record<string, unknown>>;
    getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult>;
}
export default SystemProviderService;
