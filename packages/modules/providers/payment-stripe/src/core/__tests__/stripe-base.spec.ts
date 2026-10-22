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

  describe("capturePayment", () => {
    const succeededIntent = {
      id: "pi_123",
      status: "succeeded",
      currency: "usd",
      amount_received: 6000,
    }

    const mockCapture = (service: StripeProviderService) => {
      return jest
        .spyOn(service["stripe_"].paymentIntents, "capture")
        .mockResolvedValue(succeededIntent as never)
    }

    it("captures the whole payment intent when no amount is given", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      const capture = mockCapture(service)

      const result = await service.capturePayment({
        data: { id: "pi_123", currency: "usd" },
        context: { idempotency_key: "capt_full" },
      })

      expect(capture).toHaveBeenCalledWith("pi_123", {
        idempotencyKey: "capt_full",
      })
      expect(result.data).toEqual(succeededIntent)
    })

    it("sends the requested amount as amount_to_capture in the smallest currency unit", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      const capture = mockCapture(service)

      await service.capturePayment({
        data: { id: "pi_123", currency: "usd", amount_capturable: 10000 },
        amount: 60,
        context: { idempotency_key: "capt_partial" },
      })

      expect(capture).toHaveBeenCalledWith(
        "pi_123",
        { amount_to_capture: 6000 },
        { idempotencyKey: "capt_partial" }
      )
    })

    it("converts a raw capture amount the same way the payment module stores it", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      const capture = mockCapture(service)

      await service.capturePayment({
        data: { id: "pi_123", currency: "usd", amount_capturable: 10000 },
        amount: { value: "60", precision: 20 },
        context: { idempotency_key: "capt_raw" },
      })

      expect(capture).toHaveBeenCalledWith(
        "pi_123",
        { amount_to_capture: 6000 },
        { idempotencyKey: "capt_raw" }
      )
    })

    it("does not scale a zero-decimal currency", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      const capture = mockCapture(service)

      await service.capturePayment({
        data: { id: "pi_123", currency: "jpy", amount_capturable: 100 },
        amount: 60,
        context: { idempotency_key: "capt_jpy" },
      })

      expect(capture).toHaveBeenCalledWith(
        "pi_123",
        { amount_to_capture: 60 },
        { idempotencyKey: "capt_jpy" }
      )
    })

    it("keeps a full capture on the original call when the amount covers what Stripe can capture", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      const capture = mockCapture(service)

      await service.capturePayment({
        data: { id: "pi_123", currency: "usd", amount_capturable: 10000 },
        amount: 100,
        context: { idempotency_key: "capt_rest" },
      })

      expect(capture).toHaveBeenCalledWith("pi_123", {
        idempotencyKey: "capt_rest",
      })
    })

    it("scales a three-decimal currency to Stripe's smallest unit", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      const capture = mockCapture(service)

      await service.capturePayment({
        data: { id: "pi_123", currency: "kwd", amount_capturable: 10000 },
        amount: 5.124,
        context: { idempotency_key: "capt_kwd" },
      })

      expect(capture).toHaveBeenCalledWith(
        "pi_123",
        { amount_to_capture: 5130 },
        { idempotencyKey: "capt_kwd" }
      )
    })

    it("returns the payment intent when Stripe says it already succeeded for this amount", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest
        .spyOn(service["stripe_"].paymentIntents, "capture")
        .mockRejectedValue(
          Object.assign(new Error("Unexpected state"), {
            code: "payment_intent_unexpected_state",
            payment_intent: succeededIntent,
          })
        )

      const result = await service.capturePayment({
        data: { id: "pi_123", currency: "usd", amount_capturable: 10000 },
        amount: 60,
        context: { idempotency_key: "capt_done" },
      })

      expect(result.data).toEqual(succeededIntent)
    })

    it("returns the payment intent when Stripe says it already succeeded and no amount was given", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest
        .spyOn(service["stripe_"].paymentIntents, "capture")
        .mockRejectedValue(
          Object.assign(new Error("Unexpected state"), {
            code: "payment_intent_unexpected_state",
            payment_intent: succeededIntent,
          })
        )

      const result = await service.capturePayment({
        data: { id: "pi_123", currency: "usd" },
        context: { idempotency_key: "capt_full_done" },
      })

      expect(result.data).toEqual(succeededIntent)
    })

    it("throws when a second equal capture finds the stored payment already succeeded", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      const collectedForty = {
        id: "pi_123",
        status: "succeeded",
        currency: "usd",
        amount_received: 4000,
      }
      jest
        .spyOn(service["stripe_"].paymentIntents, "capture")
        .mockRejectedValue(
          Object.assign(new Error("Unexpected state"), {
            code: "payment_intent_unexpected_state",
            payment_intent: collectedForty,
          })
        )

      await expect(
        service.capturePayment({
          data: {
            id: "pi_123",
            currency: "usd",
            status: "succeeded",
            amount_capturable: 10000,
          },
          amount: 40,
          context: { idempotency_key: "capt_second_forty" },
        })
      ).rejects.toThrow("An error occurred in capturePayment")
    })

    it("returns the payment intent when a retry still has requires_capture and the received amount matches", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      const collectedForty = {
        id: "pi_123",
        status: "succeeded",
        currency: "usd",
        amount_received: 4000,
      }
      jest
        .spyOn(service["stripe_"].paymentIntents, "capture")
        .mockRejectedValue(
          Object.assign(new Error("Unexpected state"), {
            code: "payment_intent_unexpected_state",
            payment_intent: collectedForty,
          })
        )

      const result = await service.capturePayment({
        data: {
          id: "pi_123",
          currency: "usd",
          status: "requires_capture",
          amount_capturable: 10000,
        },
        amount: 40,
        context: { idempotency_key: "capt_retry" },
      })

      expect(result.data).toEqual(collectedForty)
    })

    it("sends amount_to_capture when the stored intent has no capturable amount", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      const capture = mockCapture(service)

      await service.capturePayment({
        data: { id: "pi_123", currency: "usd" },
        amount: 40,
        context: { idempotency_key: "capt_unknown" },
      })

      expect(capture).toHaveBeenCalledWith(
        "pi_123",
        { amount_to_capture: 4000 },
        { idempotencyKey: "capt_unknown" }
      )
    })

    it("throws when a second capture hits a payment intent that already collected a different amount", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest
        .spyOn(service["stripe_"].paymentIntents, "capture")
        .mockRejectedValue(
          Object.assign(new Error("Unexpected state"), {
            code: "payment_intent_unexpected_state",
            payment_intent: succeededIntent,
          })
        )

      await expect(
        service.capturePayment({
          data: { id: "pi_123", currency: "usd", amount_capturable: 0 },
          amount: 40,
          context: { idempotency_key: "capt_second" },
        })
      ).rejects.toThrow("An error occurred in capturePayment")
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
