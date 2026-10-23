import type { ProviderWebhookPayload } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
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

  describe("initiatePayment", () => {
    const stripeError = (param: string) =>
      Object.assign(new Error(`No such ${param}`), {
        type: "StripeInvalidRequestError",
        code: "resource_missing",
        param,
      })

    const initiate = (service: StripeProviderService) =>
      service.initiatePayment({
        amount: 100,
        currency_code: "usd",
        context: { account_holder: { data: { id: "cus_123" } } },
      } as any)

    it("reports a customer that doesn't exist in the Stripe account", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest
        .spyOn(service["stripe_"].paymentIntents, "create")
        .mockRejectedValue(stripeError("customer"))

      await expect(initiate(service)).rejects.toMatchObject({
        type: MedusaError.Types.NOT_FOUND,
        code: MedusaError.Codes.ACCOUNT_HOLDER_NOT_FOUND,
      })
    })

    it("doesn't report other missing resources as a missing customer", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest
        .spyOn(service["stripe_"].paymentIntents, "create")
        .mockRejectedValue(stripeError("payment_method"))

      await expect(initiate(service)).rejects.toThrow(
        "An error occurred in InitiatePayment"
      )
    })
  })

  describe("deleteAccountHolder", () => {
    const context = { account_holder: { data: { id: "cus_123" } } }

    it("doesn't throw when the customer is already gone", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest.spyOn(service["stripe_"].customers, "del").mockRejectedValue(
        Object.assign(new Error("No such customer: 'cus_123'"), {
          code: "resource_missing",
        })
      )

      expect(await service.deleteAccountHolder({ context } as any)).toEqual({})
    })

    it("still throws other errors", async () => {
      const service = new StripeProviderService({}, defaultOptions)
      jest
        .spyOn(service["stripe_"].customers, "del")
        .mockRejectedValue(new Error("Stripe is down"))

      await expect(
        service.deleteAccountHolder({ context } as any)
      ).rejects.toThrow("An error occurred in deleteAccountHolder")
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
