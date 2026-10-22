import type { ProviderWebhookPayload } from "@medusajs/framework/types"
import type { StripeOptions } from "../../types"

import IdealProviderService from "../../services/stripe-ideal"
import StripeProviderService from "../../services/stripe-provider"

const defaultOptions: StripeOptions = {
  apiKey: "sk_test_123",
  webhookSecret: "whsec_test_123",
}

describe("StripeBase", () => {
  describe("normalizePaymentIntentParameters", () => {
    it("prefers extra.payment_method_configuration over options.paymentMethodConfiguration", () => {
      const service = new StripeProviderService(
        {},
        { ...defaultOptions, paymentMethodConfiguration: "pmc_option" }
      )

      const params = service.normalizePaymentIntentParameters({
        payment_method_configuration: "pmc_extra",
      })

      expect(params.payment_method_configuration).toBe("pmc_extra")
    })

    it("uses options.paymentMethodConfiguration when extra is not set", () => {
      const service = new StripeProviderService(
        {},
        { ...defaultOptions, paymentMethodConfiguration: "pmc_option" }
      )

      const params = service.normalizePaymentIntentParameters()

      expect(params.payment_method_configuration).toBe("pmc_option")
    })

    it("does not set payment_method_configuration for specialized providers with fixed payment_method_types", () => {
      const service = new IdealProviderService(
        {},
        {
          ...defaultOptions,
          paymentMethodConfiguration: "pmc_option",
        }
      )

      const params = service.normalizePaymentIntentParameters()

      expect(params.payment_method_types).toEqual(["ideal"])
      expect(params.payment_method_configuration).toBeUndefined()
    })

    it("does not set payment_method_configuration when extra.payment_method_types is provided", () => {
      const service = new StripeProviderService(
        {},
        {
          ...defaultOptions,
          paymentMethodConfiguration: "pmc_option",
        }
      )

      const params = service.normalizePaymentIntentParameters({
        payment_method_types: ["card"],
        payment_method_configuration: "pmc_extra",
      })

      expect(params.payment_method_types).toEqual(["card"])
      expect(params.payment_method_configuration).toBeUndefined()
    })

    it("keeps existing defaults when payment method configuration is not provided", () => {
      const service = new StripeProviderService({}, defaultOptions)

      const params = service.normalizePaymentIntentParameters()

      expect(params.payment_method_configuration).toBeUndefined()
      expect(params.capture_method).toBe("manual")
    })
  })

  describe("constructWebhookEvent", () => {
    it("wraps signature verification failures with a normalized error", () => {
      const service = new StripeProviderService({}, defaultOptions)

      expect(() =>
        service.constructWebhookEvent({
          data: {},
          rawData: "{}",
          headers: { "stripe-signature": "invalid-signature" },
        } as ProviderWebhookPayload["payload"])
      ).toThrow("An error occurred in constructWebhookEvent")
    })
  })

  describe("deletePayment", () => {
    const stripeError = (status: string) =>
      Object.assign(new Error("Unexpected state"), {
        payment_intent: { id: "pi_123", status },
      })

    it("doesn't throw when the payment intent already succeeded", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest
        .spyOn(service["stripe_"].paymentIntents, "cancel")
        .mockRejectedValue(stripeError("succeeded"))

      const result = await service.deletePayment({ data: { id: "pi_123" } })

      expect(result.data).toEqual({ id: "pi_123", status: "succeeded" })
    })

    it("still throws other cancelation errors", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest
        .spyOn(service["stripe_"].paymentIntents, "cancel")
        .mockRejectedValue(stripeError("processing"))

      await expect(
        service.deletePayment({ data: { id: "pi_123" } })
      ).rejects.toThrow("An error occurred in cancelPayment")
    })
  })

  describe("cancelPayment", () => {
    it("throws when the payment intent already succeeded", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest
        .spyOn(service["stripe_"].paymentIntents, "cancel")
        .mockRejectedValue(
          Object.assign(new Error("Unexpected state"), {
            payment_intent: { id: "pi_123", status: "succeeded" },
          })
        )

      await expect(
        service.cancelPayment({ data: { id: "pi_123" } })
      ).rejects.toThrow("An error occurred in cancelPayment")
    })
  })
})
