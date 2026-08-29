import {
  CommonEvents,
  composeMessage,
  Modules,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"
import Redis from "ioredis"

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

      it("should set a TTL on the grouped events key from a single emit() call", async () => {
        // Regression test: EXPIRE was previously issued before the RPUSH that
        // creates the staging:<groupId> key, so a group whose events all arrive
        // in one emit() call ended up with no expiry at all (EXPIRE against a
        // nonexistent key is a no-op). This checks the real TTL in Redis
        // directly, since the module's own API doesn't expose it.
        const redis = new Redis({ host: "localhost", port: 6379 })
        const eventGroupId = "ttl-single-emit-test"

        try {
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

          const ttl = await redis.ttl(`staging:${eventGroupId}`)
          expect(ttl).toBeGreaterThan(0)
        } finally {
          await eventBus.clearGroupedEvents(eventGroupId)
          await redis.quit()
        }
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
    })
  },
})
