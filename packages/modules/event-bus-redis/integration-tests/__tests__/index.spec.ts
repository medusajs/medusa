import {
  CommonEvents,
  composeMessage,
  Modules,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"

moduleIntegrationTestRunner<IEventBusModuleService>({
  moduleName: Modules.EVENT_BUS,
  moduleOptions: {
    redis: {
      host: "localhost",
      port: 6379,
    },
  },
  testSuite: ({ service: eventBus }) => {
    describe("Event Bus Redis Service", () => {
      it("should emit an event", async () => {
        const subscriber = jest.fn()
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

      it("should release grouped events", async () => {
        const subscriber = jest.fn()
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
        const subscriber = jest.fn()
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
        const subscriber = jest.fn()
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

      it("should apply a TTL to the staging key on the first emit", async () => {
        const eventGroupId = "ttl-test-456"
        const redisConnection = (eventBus as any).eventBusRedisConnection_

        await eventBus.emit(
          composeMessage("test", {
            data: {
              test: "test",
            },
            context: {
              eventGroupId,
            },
            action: CommonEvents.CREATED,
            source: "test",
            object: "test",
          })
        )

        const ttl = await redisConnection.ttl(`staging:${eventGroupId}`)

        // TTL must be set (a positive number of seconds remaining) immediately
        // after the very first emit() for this group — previously EXPIRE was
        // issued before the key existed and silently no-opped, leaving TTL at -1.
        expect(ttl).toBeGreaterThan(0)

        await eventBus.clearGroupedEvents(eventGroupId)
      })
    })
  },
})
