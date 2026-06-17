import { PaymentActions } from "@medusajs/framework/utils"
import Stripe from "stripe"
import StripeBase from "../stripe-base"
import StripeProviderService from "../../services/stripe-provider"
import { ProviderWebhookPayload } from "@medusajs/framework/types"
import { StripeOptions } from "../../types"

const buildProvider = () => {
  return new StripeProviderService(
    {},
    { apiKey: "sk_test_123", webhookSecret: "whsec_test" }
  )
}

const buildWebhookPayload = (): ProviderWebhookPayload["payload"] => ({
  data: {},
  rawData: "{}",
  headers: { "stripe-signature": "sig" },
})

const buildEvent = (
  metadata: Stripe.PaymentIntent["metadata"]
): Stripe.Event =>
  ({
    type: "payment_intent.succeeded",
    data: {
      object: {
        amount: 1000,
        amount_received: 1000,
        currency: "usd",
        metadata,
      },
    },
  } as unknown as Stripe.Event)

describe("StripeBase: getWebhookActionAndData", () => {
  it("returns NOT_SUPPORTED when the payment intent has no session_id in its metadata", async () => {
    const provider = buildProvider()

    // The intent originates from another integration sharing the Stripe
    // account, so it carries no Medusa session id.
    jest
      .spyOn(provider, "constructWebhookEvent")
      .mockReturnValue(buildEvent({}))

    const result = await provider.getWebhookActionAndData(
      buildWebhookPayload()
    )

    expect(result).toEqual({ action: PaymentActions.NOT_SUPPORTED })
  })

  it("returns NOT_SUPPORTED when the payment intent metadata is missing entirely", async () => {
    const provider = buildProvider()

    jest
      .spyOn(provider, "constructWebhookEvent")
      .mockReturnValue(buildEvent(undefined as any))

    const result = await provider.getWebhookActionAndData(
      buildWebhookPayload()
    )

    expect(result).toEqual({ action: PaymentActions.NOT_SUPPORTED })
  })

  it("returns the SUCCESSFUL action carrying the session_id when present", async () => {
    const provider = buildProvider()

    jest
      .spyOn(provider, "constructWebhookEvent")
      .mockReturnValue(buildEvent({ session_id: "payses_123" }))

    const result = await provider.getWebhookActionAndData(
      buildWebhookPayload()
    )

    expect(result).toEqual({
      action: PaymentActions.SUCCESSFUL,
      data: {
        session_id: "payses_123",
        // 1000 (smallest unit / cents) normalized to the major unit.
        amount: 10,
      },
    })
  })
})

describe("StripeBase: validateOptions", () => {
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    // Reset on StripeBase itself: validateOptions reads and writes the flag on
    // the base class, so resetting through a subclass would only shadow it.
    ;(StripeBase as any).hasWarnedMissingWebhookSecret = false
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it("throws when apiKey is missing", () => {
    expect(() =>
      StripeProviderService.validateOptions({
        webhookSecret: "whsec_test",
      } as StripeOptions)
    ).toThrow("Required option `apiKey` is missing in Stripe plugin")
  })

  it("warns when webhookSecret is missing", () => {
    StripeProviderService.validateOptions({
      apiKey: "sk_test_123",
    } as StripeOptions)

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Option `webhookSecret` is missing")
    )
  })

  it("does not warn when webhookSecret is provided", () => {
    StripeProviderService.validateOptions({
      apiKey: "sk_test_123",
      webhookSecret: "whsec_test",
    } as StripeOptions)

    expect(warnSpy).not.toHaveBeenCalled()
  })

  it("warns only once even when every Stripe service variant is validated", () => {
    const options = { apiKey: "sk_test_123" } as StripeOptions

    StripeProviderService.validateOptions(options)
    StripeProviderService.validateOptions(options)
    StripeProviderService.validateOptions(options)

    expect(warnSpy).toHaveBeenCalledTimes(1)
  })
})
