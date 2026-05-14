import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"
import { composeMessage, Modules, PaymentWebhookEvents } from "@medusajs/utils"
import path from "path"

jest.setTimeout(100000)

function getJobCounts(queue) {
  return queue.waiting + queue.delayed + (queue.prioritized || 0)
}

medusaIntegrationTestRunner({
  medusaConfigFile: path.join(
    __dirname,
    "../../__fixtures__/worker-mode-server"
  ),
  testSuite: ({ getContainer }) => {
    describe("Event Bus - Server Worker Mode", () => {
      let eventBus: IEventBusModuleService

      beforeAll(() => {
        eventBus = getContainer().resolve(Modules.EVENT_BUS)
      })

      it("should register subscribers, queue events with subscribers, and skip events without subscribers", async () => {
        const subscribersMap = (eventBus as any).eventToSubscribersMap
        expect(subscribersMap).toBeDefined()
        expect(subscribersMap.size).toBeGreaterThan(0)

        const paymentWebhookSubscribers = subscribersMap.get(
          PaymentWebhookEvents.WebhookReceived
        )
        expect(paymentWebhookSubscribers).toBeDefined()
        expect(paymentWebhookSubscribers.length).toBeGreaterThan(0)

        const bullWorker = (eventBus as any).bullWorker_
        expect(bullWorker).toBeUndefined()

        const testEventName = "test.server-mode-event"
        const subscriberMock = jest.fn()

        eventBus.subscribe(testEventName, subscriberMock, {
          subscriberId: "test-server-mode-subscriber",
        })
        expect(subscribersMap.get(testEventName)).toBeDefined()

        const queue = (eventBus as any).queue_
        const jobCountsBefore = await queue.getJobCounts()
        const totalJobsBefore = getJobCounts(jobCountsBefore)

        await eventBus.emit(
          composeMessage(testEventName, {
            data: { test: "data" },
            object: "test",
            source: "integration-test",
            action: "created",
          })
        )

        const jobCountsAfterWithSubscriber = await queue.getJobCounts()
        const totalJobsAfterWithSubscriber = getJobCounts(
          jobCountsAfterWithSubscriber
        )

        expect(totalJobsAfterWithSubscriber).toBeGreaterThan(totalJobsBefore)

        await new Promise((resolve) => setTimeout(resolve, 500))

        expect(subscriberMock).not.toHaveBeenCalled()

        const eventWithNoSubscribers = "test.event-without-subscribers"
        expect(subscribersMap.get(eventWithNoSubscribers)).toBeUndefined()

        const jobCountsBeforeNoSub = await queue.getJobCounts()
        const totalJobsBeforeNoSub =
          jobCountsBeforeNoSub.waiting + jobCountsBeforeNoSub.delayed

        await eventBus.emit(
          composeMessage(eventWithNoSubscribers, {
            data: { test: "should-not-be-queued" },
            object: "test",
            source: "integration-test",
            action: "created",
          })
        )

        const jobCountsAfterNoSub = await queue.getJobCounts()
        const totalJobsAfterNoSub =
          jobCountsAfterNoSub.waiting + jobCountsAfterNoSub.delayed

        expect(totalJobsAfterNoSub).toBe(totalJobsBeforeNoSub)
      })
    })
  },
})
