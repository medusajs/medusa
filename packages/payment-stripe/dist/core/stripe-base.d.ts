import Stripe from "stripe";
import { MedusaContainer, PaymentProviderError, PaymentProviderSessionResponse, PaymentSessionStatus, ProviderWebhookPayload, UpdatePaymentProviderSession, WebhookActionResult } from "@medusajs/types";
import { AbstractPaymentProvider } from "@medusajs/utils";
import { CreatePaymentProviderSession } from "@medusajs/types";
import { PaymentIntentOptions, StripeCredentials, StripeOptions } from "../types";
declare abstract class StripeBase extends AbstractPaymentProvider<StripeCredentials> {
    protected readonly options_: StripeOptions;
    protected stripe_: Stripe;
    protected container_: MedusaContainer;
    protected constructor(container: MedusaContainer, options: StripeOptions);
    protected init(): Stripe;
    abstract get paymentIntentOptions(): PaymentIntentOptions;
    private validateOptions;
    get options(): StripeOptions;
    getPaymentIntentOptions(): PaymentIntentOptions;
    getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus>;
    initiatePayment(input: CreatePaymentProviderSession): Promise<PaymentProviderError | PaymentProviderSessionResponse>;
    authorizePayment(paymentSessionData: Record<string, unknown>, context: Record<string, unknown>): Promise<PaymentProviderError | {
        status: PaymentSessionStatus;
        data: PaymentProviderSessionResponse["data"];
    }>;
    cancelPayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>;
    capturePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>;
    deletePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>;
    refundPayment(paymentSessionData: Record<string, unknown>, refundAmount: number): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>;
    retrievePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>;
    updatePayment(input: UpdatePaymentProviderSession): Promise<PaymentProviderError | PaymentProviderSessionResponse>;
    updatePaymentData(sessionId: string, data: Record<string, unknown>): Promise<PaymentProviderError | Record<string, unknown>>;
    getWebhookActionAndData(webhookData: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult>;
    /**
     * Constructs Stripe Webhook event
     * @param {object} data - the data of the webhook request: req.body
     *    ensures integrity of the webhook event
     * @return {object} Stripe Webhook event
     */
    constructWebhookEvent(data: ProviderWebhookPayload["payload"]): Stripe.Event;
    protected buildError(message: string, error: Stripe.StripeRawError | PaymentProviderError | Error): PaymentProviderError;
}
export default StripeBase;
