import {
  CommonEvents,
  composeMessage,
  Modules,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"

const waitForCalls = async (subscriber: jest.Mock, times: number) => {
  const timeout = Date.now() + 5000
  while (subscriber.mock.calls.length < times && Date.now() < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
}

moduleIntegrationTestRunner<IEventBusModuleService>({
  moduleName: Modules.EVENT_BUS,
  resolve: __dirname + "/../..",
  moduleOptions: {
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  },
  testSuite: ({ service: eventBus }) => {
    describe("Event Bus Redis Service", () => {
      // The runner doesn't call module shutdown hooks, so each test's worker
      // would otherwise keep consuming the next test's jobs
      afterEach(async () => {
        await (eventBus as any).__hooks?.onApplicationPrepareShutdown?.()
        await (eventBus as any).__hooks?.onApplicationShutdown?.()
      })

      it("should emit an event", async () => {
        const subscriber = jest.fn().mockResolvedValue(undefined)

        eventBus.subscribe("test", subscriber)

        await eventBus.emit(
          composeMessage("test", {
            data: {
              test: "test",
            },
            action: CommonEvents.CREATED,
            source: "test",
            object: "test",
          })
        )

        await waitForCalls(subscriber, 1)

        expect(subscriber).toHaveBeenCalledWith({
          data: {
            test: "test",
          },
          metadata: expect.objectContaining({
            source: "test",
            object: "test",
            action: "created",
            published_at: expect.any(Date),
            created_at: expect.any(Date),
          }),
          name: "test",
        })

        eventBus.unsubscribe("test", subscriber)
      })

      it("should emit an internal event with the lowest priority", async () => {
        const subscriber = jest.fn().mockResolvedValue(undefined)

        eventBus.subscribe("test", subscriber)

        await eventBus.emit(
          composeMessage("test", {
            data: {
              test: "test",
            },
            action: CommonEvents.CREATED,
            source: "test",
            object: "test",
          }),
          { internal: true }
        )

        await waitForCalls(subscriber, 1)

        expect(subscriber).toHaveBeenCalledTimes(1)

        eventBus.unsubscribe("test", subscriber)
      })

      it("should emit an event with a custom job id containing colons", async () => {
        const subscriber = jest.fn().mockResolvedValue(undefined)

        eventBus.subscribe("test", subscriber)

        await eventBus.emit(
          composeMessage("test", {
            data: {
              test: "test",
            },
            action: CommonEvents.CREATED,
            source: "test",
            object: "test",
          }),
          { jobId: "test:job:id:1" }
        )

        await waitForCalls(subscriber, 1)

        expect(subscriber).toHaveBeenCalledTimes(1)

        eventBus.unsubscribe("test", subscriber)
      })

      it("should deduplicate events emitted with the deprecated debounce option", async () => {
        const subscriber = jest.fn().mockResolvedValue(undefined)

        eventBus.subscribe("test", subscriber)

        const message = composeMessage("test", {
          data: {
            test: "test",
          },
          action: CommonEvents.CREATED,
          source: "test",
          object: "test",
        })
        const options = { debounce: { id: "test-debounce", ttl: 2000 } }

        await eventBus.emit(message, options)
        await eventBus.emit(message, options)

        await waitForCalls(subscriber, 1)
        await new Promise((resolve) => setTimeout(resolve, 500))

        expect(subscriber).toHaveBeenCalledTimes(1)

        eventBus.unsubscribe("test", subscriber)
      })

      it("should release grouped events", async () => {
        const subscriber = jest.fn().mockResolvedValue(undefined)

        eventBus.subscribe("test", subscriber)

        await eventBus.emit(
          composeMessage("test", {
            data: {
              test: "test",
            },
            context: {
              eventGroupId: "123",
            },
            action: CommonEvents.CREATED,
            source: "test",
            object: "test",
          })
        )

        expect(subscriber).toHaveBeenCalledTimes(0)

        await eventBus.releaseGroupedEvents("123")
        await waitForCalls(subscriber, 1)

        expect(subscriber).toHaveBeenCalledTimes(1)

        expect(subscriber).toHaveBeenCalledWith({
          data: {
            test: "test",
          },
          metadata: expect.objectContaining({
            source: "test",
            eventGroupId: "123",
            object: "test",
            action: "created",
            published_at: expect.any(Date),
            created_at: expect.any(Date),
          }),
          name: "test",
        })

        eventBus.unsubscribe("test", subscriber)
      })

      it("should clear grouped events", async () => {
        const subscriber = jest.fn().mockResolvedValue(undefined)

        eventBus.subscribe("test", subscriber)

        await eventBus.emit(
          composeMessage("test", {
            data: {
              test: "test",
            },
            context: {
              eventGroupId: "123",
            },
            action: CommonEvents.CREATED,
            source: "test",
            object: "test",
          })
        )

        expect(subscriber).toHaveBeenCalledTimes(0)

        await eventBus.clearGroupedEvents("123")
        await eventBus.releaseGroupedEvents("123")

        expect(subscriber).toHaveBeenCalledTimes(0)

        eventBus.unsubscribe("test", subscriber)
      })

      it("should clear grouped events with event names", async () => {
        const subscriber = jest.fn().mockResolvedValue(undefined)

        eventBus.subscribe("test", subscriber)

        await eventBus.emit(
          composeMessage("test", {
            data: {
              test: "test",
            },
            context: {
              eventGroupId: "123",
            },
            action: CommonEvents.CREATED,
            source: "test",
            object: "test",
          })
        )

        await eventBus.clearGroupedEvents("123", {
          eventNames: ["test"],
        })

        await eventBus.releaseGroupedEvents("123")

        expect(subscriber).toHaveBeenCalledTimes(0)

        eventBus.unsubscribe("test", subscriber)
      })
    })
  },
})
