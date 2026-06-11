import { PaymentActions } from "@medusajs/framework/utils"
import Stripe from "stripe"
import StripeProviderService from "../../services/stripe-provider"
import { ProviderWebhookPayload } from "@medusajs/framework/types"

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
