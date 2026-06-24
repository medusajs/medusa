import {
  CommonEvents,
  composeMessage,
  Modules,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"

moduleIntegrationTestRunner<IEventBusModuleService>({
  moduleName: Modules.EVENT_BUS,
  testSuite: ({ service: eventBus }) => {
    describe("Event Bus Local Service", () => {
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
    })
  },
})
