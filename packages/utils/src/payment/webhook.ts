export enum PaymentWebhookEvents {
  WebhookReceived = "payment.webhook_received",
}

export enum PaymentActions {
  CAPTURED = "captured",
  AUTHORIZED = "authorized",
  FAILED = "failed",
}
