import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, PaymentWebhookEvents } from "@medusajs/framework/utils"
import { POST } from "../payment/[provider]/route"

describe("POST /hooks/payment/:provider", () => {
  it("queues the webhook with the time it was received", async () => {
    const emit = jest.fn()
    const req = {
      params: { provider: "stripe_stripe" },
      body: { id: "evt_test_route" },
      rawBody: Buffer.from(JSON.stringify({ id: "evt_test_route" })),
      headers: { "stripe-signature": "t=1,v1=test" },
      scope: {
        resolve: (key: string) => {
          if (key === Modules.PAYMENT) {
            return { options: {} }
          }
          if (key === Modules.EVENT_BUS) {
            return { emit }
          }
          throw new Error(`Unexpected resolve: ${key}`)
        },
      },
    } as unknown as MedusaRequest
    const res = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as MedusaResponse

    const before = Date.now()
    await POST(req, res)
    const after = Date.now()

    expect(res.sendStatus).toHaveBeenCalledWith(200)
    expect(emit).toHaveBeenCalledTimes(1)

    const [message, options] = emit.mock.calls[0]
    expect(message).toEqual({
      name: PaymentWebhookEvents.WebhookReceived,
      data: {
        provider: "stripe_stripe",
        payload: {
          data: req.body,
          rawData: req.rawBody,
          headers: req.headers,
          receivedAt: expect.any(Number),
        },
      },
    })
    expect(message.data.payload.receivedAt).toBeGreaterThanOrEqual(before)
    expect(message.data.payload.receivedAt).toBeLessThanOrEqual(after)
    expect(options).toEqual({ delay: 5000, attempts: 3 })
  })
})
