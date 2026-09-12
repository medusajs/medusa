import { PaymentEvents } from "@medusajs/framework/utils"
import {
  authorizePaymentSessionForOrderWorkflow,
  paymentCapturedEventData,
} from "../authorize-payment-session-for-order"

describe("authorizePaymentSessionForOrderWorkflow", () => {
  it("should have correct workflow id and export workflow definition", () => {
    expect(authorizePaymentSessionForOrderWorkflow.getName()).toEqual(
      "authorize-payment-session-for-order"
    )
  })

  it("should be defined and registered", () => {
    expect(authorizePaymentSessionForOrderWorkflow).toBeDefined()
  })

  it("builds a payment.captured event for captured payments", () => {
    expect(
      paymentCapturedEventData({ id: "pay_123", captures: [{ id: "cap_123" }] })
    ).toEqual({
      eventName: PaymentEvents.CAPTURED,
      data: { id: "pay_123" },
    })

    expect(
      paymentCapturedEventData({ id: "pay_123", captured_at: new Date() })
    ).toEqual({
      eventName: PaymentEvents.CAPTURED,
      data: { id: "pay_123" },
    })
  })

  it("does not build a payment.captured event before capture", () => {
    expect(paymentCapturedEventData({ id: "pay_123", captures: [] })).toBeNull()
    expect(paymentCapturedEventData(undefined)).toBeNull()
  })
})
