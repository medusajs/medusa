import type { ProviderWebhookPayload } from "@medusajs/framework/types"
import Stripe from "stripe"
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

    describe("signature timestamp", () => {
      const rawData = JSON.stringify({
        id: "evt_test_received_at",
        object: "event",
        type: "payment_intent.succeeded",
        data: {
          object: { id: "pi_test_received_at", object: "payment_intent" },
        },
      })

      // Signed 400 seconds ago, more than Stripe's default 300 second tolerance,
      // as when the event waited in the event bus before being processed.
      const signedAt = Math.floor(Date.now() / 1000) - 400

      const headers = {
        "stripe-signature": new Stripe(
          defaultOptions.apiKey
        ).webhooks.generateTestHeaderString({
          payload: rawData,
          secret: defaultOptions.webhookSecret,
          timestamp: signedAt,
        }),
      }

      it("checks the timestamp against receivedAt when it is set", () => {
        const service = new StripeProviderService({}, defaultOptions)

        const event = service.constructWebhookEvent({
          data: JSON.parse(rawData),
          rawData,
          headers,
          receivedAt: (signedAt + 1) * 1000,
        })

        expect(event.id).toBe("evt_test_received_at")
      })

      it("rejects a delivery received after the tolerance", () => {
        const service = new StripeProviderService({}, defaultOptions)

        expect(() =>
          service.constructWebhookEvent({
            data: JSON.parse(rawData),
            rawData,
            headers,
            receivedAt: (signedAt + 301) * 1000,
          })
        ).toThrow("Timestamp outside the tolerance zone")
      })

      it("checks the timestamp against the current time when receivedAt is not set", () => {
        const service = new StripeProviderService({}, defaultOptions)

        expect(() =>
          service.constructWebhookEvent({
            data: JSON.parse(rawData),
            rawData,
            headers,
          })
        ).toThrow("Timestamp outside the tolerance zone")
      })
    })
  })
})
