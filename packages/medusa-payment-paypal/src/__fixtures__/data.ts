import { INVOICE_ID } from "../__mocks__/@paypal/checkout-server-sdk"

export const PaymentIntentDataByStatus = {
  CREATED: {
    id: "CREATED",
    status: "CREATED",
    invoice_id: INVOICE_ID,
  },
  COMPLETED: {
    id: "COMPLETED",
    status: "COMPLETED",
    invoice_id: INVOICE_ID,
  },
  SAVED: {
    id: "SAVED",
    status: "SAVED",
    invoice_id: INVOICE_ID,
  },
  APPROVED: {
    id: "APPROVED",
    status: "APPROVED",
    invoice_id: INVOICE_ID,
  },
  PAYER_ACTION_REQUIRED: {
    id: "PAYER_ACTION_REQUIRED",
    status: "PAYER_ACTION_REQUIRED",
    invoice_id: INVOICE_ID,
  },
  VOIDED: {
    id: "VOIDED",
    status: "VOIDED",
    invoice_id: INVOICE_ID,
  },
}
