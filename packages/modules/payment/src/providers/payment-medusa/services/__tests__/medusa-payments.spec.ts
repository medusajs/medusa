import { PaymentSessionStatus } from "@medusajs/framework/utils"
import { MedusaPaymentsProvider } from "../medusa-payments"

describe("MedusaPaymentsProvider", () => {
  const options = {
    endpoint: "https://api.medusapayments.com",
    webhook_secret: "whsec_test",
    api_key: "test_key",
    payment_account: "test_account",
    environment_handle: "test_env",
  }

  describe("capturePayment", () => {
    it("should capture full payment when amount is omitted", async () => {
      const provider = new MedusaPaymentsProvider({}, options)

      const requestSpy = jest.spyOn(provider, "request").mockResolvedValue({
        payment: {
          id: "pay_123",
          status: "succeeded",
        },
      } as any)

      jest.spyOn(provider as any, "getStatus").mockReturnValue({
        status: PaymentSessionStatus.CAPTURED,
      })

      const result = await provider.capturePayment({
        data: { id: "pay_123", currency: "usd" },
        context: { idempotency_key: "idem_123" },
      })

      expect(requestSpy).toHaveBeenCalledWith("/payments/pay_123/capture", {
        method: "POST",
        body: {
          idempotency_key: "idem_123",
        },
      })
      expect(result.data).toEqual({ id: "pay_123", status: "succeeded" })
    })

    it("should pass amount_to_capture in smallest currency unit when partial amount is provided", async () => {
      const provider = new MedusaPaymentsProvider({}, options)

      const requestSpy = jest.spyOn(provider, "request").mockResolvedValue({
        payment: {
          id: "pay_123",
          status: "succeeded",
        },
      } as any)

      jest.spyOn(provider as any, "getStatus").mockReturnValue({
        status: PaymentSessionStatus.CAPTURED,
      })

      const result = await provider.capturePayment({
        amount: 60,
        data: { id: "pay_123", currency: "usd" },
        context: { idempotency_key: "idem_123" },
      })

      expect(requestSpy).toHaveBeenCalledWith("/payments/pay_123/capture", {
        method: "POST",
        body: {
          idempotency_key: "idem_123",
          amount: 6000,
        },
      })
      expect(result.data).toEqual({ id: "pay_123", status: "succeeded" })
    })
  })
})
