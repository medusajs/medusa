export const PaymentIntentDataByStatus = {
  REQUIRES_PAYMENT_METHOD: {
    id: "requires_payment_method",
    status: "requires_payment_method",
    invoice_id: "invoice_id"
  },
  REQUIRES_CONFIRMATION: {
    id: "requires_confirmation",
    status: "requires_confirmation",
    invoice_id: "invoice_id"
  },
  PROCESSING: {
    id: "processing",
    status: "processing",
    invoice_id: "invoice_id"
  },
  REQUIRES_ACTION: {
    id: "requires_action",
    status: "requires_action",
    invoice_id: "invoice_id"
  },
  CANCELED: {
    id: "canceled",
    status: "canceled",
    invoice_id: "invoice_id"
  },
  REQUIRES_CAPTURE: {
    id: "requires_capture",
    status: "requires_capture",
    invoice_id: "invoice_id"
  },
  SUCCEEDED: {
    id: "succeeded",
    status: "succeeded",
    invoice_id: "invoice_id"
  },
}
