import { PaymentEvents, PaymentSessionStatus } from "@medusajs/framework/utils"
import { authorizePaymentSessionForOrderWorkflow } from "../authorize-payment-session-for-order"

describe("authorizePaymentSessionForOrderWorkflow", () => {
  it("should have correct workflow id and export workflow definition", () => {
    expect(authorizePaymentSessionForOrderWorkflow.getName()).toEqual(
      "authorize-payment-session-for-order"
    )
  })

  it("should be defined and registered", () => {
    expect(authorizePaymentSessionForOrderWorkflow).toBeDefined()
  })
})
