import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules, PaymentWebhookEvents } from "@medusajs/utils"
import { setTimeout } from "timers/promises"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, api }) => {
    describe("POST /hooks/payment/:provider", () => {
      it("should emit the webhook event with the time the request was received", async () => {
        const eventBus = getContainer().resolve(Modules.EVENT_BUS)
        const subscriber = jest.fn()

        eventBus.subscribe(PaymentWebhookEvents.WebhookReceived, subscriber)

        const body = { id: "evt_test", type: "payment_intent.succeeded" }

        const before = Date.now()
        const response = await api.post("/hooks/payment/system_default", body)
        const after = Date.now()

        expect(response.status).toEqual(200)

        // The event is delivered after the payment module's webhook delay
        const start = Date.now()
        while (!subscriber.mock.calls.length && Date.now() - start < 15000) {
          await setTimeout(100)
        }

        expect(subscriber).toHaveBeenCalledTimes(1)

        const eventData = subscriber.mock.calls[0][0]

        expect(eventData.data).toEqual({
          provider: "system_default",
          payload: expect.objectContaining({
            data: body,
            receivedAt: expect.any(Number),
          }),
        })
        expect(eventData.data.payload.receivedAt).toBeGreaterThanOrEqual(before)
        expect(eventData.data.payload.receivedAt).toBeLessThanOrEqual(after)

        eventBus.unsubscribe(PaymentWebhookEvents.WebhookReceived, subscriber)
      })
    })
  },
})
