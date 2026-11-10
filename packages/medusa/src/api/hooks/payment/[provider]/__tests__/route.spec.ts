import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, PaymentWebhookEvents } from "@medusajs/framework/utils"
import { POST } from "../route"

describe("POST /hooks/payment/:provider", () => {
  let eventBus
  let paymentService
  let req
  let res

  beforeEach(() => {
    eventBus = {
      emit: jest.fn(),
    }
    paymentService = {
      listPaymentProviders: jest.fn(),
      options: {
        webhook_delay: 1000,
        webhook_retries: 2,
      },
    }
    req = {
      body: { id: "evt_123" },
      headers: { "payment-signature": "signature" },
      params: { provider: "test_test" },
      rawBody: Buffer.from("raw-body"),
      scope: {
        resolve: jest.fn((key) => {
          if (key === Modules.PAYMENT) {
            return paymentService
          }

          if (key === Modules.EVENT_BUS) {
            return eventBus
          }
        }),
      },
    }
    res = {
      send: jest.fn(),
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnThis(),
    }
  })

  it("does not emit an event when the provider is not configured", async () => {
    paymentService.listPaymentProviders.mockResolvedValue([])

    await POST(req as MedusaRequest, res as unknown as MedusaResponse)

    expect(paymentService.listPaymentProviders).toHaveBeenCalledWith({
      id: "pp_test_test",
      is_enabled: true,
    })
    expect(eventBus.emit).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.sendStatus).not.toHaveBeenCalled()
  })

  it("preserves asynchronous processing for a configured provider", async () => {
    paymentService.listPaymentProviders.mockResolvedValue([
      { id: "pp_test_test", is_enabled: true },
    ])

    await POST(req as MedusaRequest, res as unknown as MedusaResponse)

    expect(eventBus.emit).toHaveBeenCalledWith(
      {
        name: PaymentWebhookEvents.WebhookReceived,
        data: {
          provider: "test_test",
          payload: {
            data: req.body,
            headers: req.headers,
            rawData: req.rawBody,
          },
        },
      },
      {
        attempts: 2,
        delay: 1000,
      }
    )
    expect(res.sendStatus).toHaveBeenCalledWith(200)
  })
})
