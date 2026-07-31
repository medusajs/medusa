import { MedusaError } from "@medusajs/framework/utils"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { POST } from "../route"

const PAYMENT_MODULE = "payment"
const EVENT_BUS_MODULE = "event_bus"

describe("POST /hooks/payment/:provider", () => {
  let req
  let res
  let paymentServiceMock
  let eventBusMock

  beforeEach(() => {
    paymentServiceMock = {
      getWebhookActionAndData: jest.fn(),
      options: { webhook_delay: 5000, webhook_retries: 3 },
    }
    eventBusMock = { emit: jest.fn() }

    req = {
      params: { provider: "stripe_stripe" },
      body: { id: "evt_123" },
      rawBody: Buffer.from("raw-body"),
      headers: { "stripe-signature": "t=1,v1=abc" },
      scope: {
        resolve: jest.fn((key: string) => {
          if (key === PAYMENT_MODULE) {
            return paymentServiceMock
          }
          if (key === EVENT_BUS_MODULE) {
            return eventBusMock
          }
        }),
      },
    }

    res = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("returns 200 and publishes the WebhookReceived event for a registered provider with a valid signature", async () => {
    paymentServiceMock.getWebhookActionAndData.mockResolvedValueOnce({
      action: "authorized",
    })

    await POST(req as MedusaRequest, res as unknown as MedusaResponse)

    expect(paymentServiceMock.getWebhookActionAndData).toHaveBeenCalledWith({
      provider: "stripe_stripe",
      payload: {
        data: req.body,
        rawData: req.rawBody,
        headers: req.headers,
      },
    })
    expect(eventBusMock.emit).toHaveBeenCalledWith(
      {
        name: "payment.webhook_received",
        data: {
          provider: "stripe_stripe",
          payload: {
            data: req.body,
            rawData: req.rawBody,
            headers: req.headers,
          },
        },
      },
      { delay: 5000, attempts: 3 }
    )
    expect(res.sendStatus).toHaveBeenCalledWith(200)
    expect(res.status).not.toHaveBeenCalled()
  })

  it("returns 404 and does not publish an event for an unregistered provider", async () => {
    paymentServiceMock.getWebhookActionAndData.mockRejectedValueOnce(
      new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Payment provider not registered: pp_unknown_unknown"
      )
    )

    await POST(req as MedusaRequest, res as unknown as MedusaResponse)

    expect(eventBusMock.emit).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalled()
    expect(res.sendStatus).not.toHaveBeenCalled()
  })

  it("returns 400 and does not publish an event when the webhook signature is invalid", async () => {
    paymentServiceMock.getWebhookActionAndData.mockRejectedValueOnce(
      new Error("Webhook signature verification failed.")
    )

    await POST(req as MedusaRequest, res as unknown as MedusaResponse)

    expect(eventBusMock.emit).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalled()
    expect(res.sendStatus).not.toHaveBeenCalled()
  })
})
