import LocalEventBusService from "../event-bus-local"

jest.genMockFromModule("events")
jest.mock("events")

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
}

const moduleDeps = {
  logger: loggerMock,
}

describe("LocalEventBusService", () => {
  let eventBus

  describe("emit", () => {
    describe("Successfully emits events", () => {
      beforeEach(() => {
        jest.clearAllMocks()

        eventBus = new LocalEventBusService(moduleDeps as any)
      })

      it("should emit an event", () => {
        eventBus = new LocalEventBusService(
          moduleDeps,
          {},
          {
            resources: "shared",
          }
        )

        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)

        eventBus.emit("eventName", { hi: "1234" })

        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledTimes(1)
        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledWith("eventName", {
          hi: "1234",
        })
      })

      it("should emit multiple events", async () => {
        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)

        await eventBus.emit([
          { eventName: "event-1", data: { hi: "1234" } },
          { eventName: "event-2", data: { hi: "5678" } },
        ])

        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledTimes(2)
        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledWith("event-1", {
          hi: "1234",
        })
        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledWith("event-2", {
          hi: "5678",
        })
      })

      it("should group an event if data consists of eventGroupId", async () => {
        const groupEventFn = jest.spyOn(eventBus, "groupEvent")

        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)

        await eventBus.emit("test-event", {
          test: "1234",
          eventGroupId: "test",
        })

        expect(eventBus.eventEmitter_.emit).not.toHaveBeenCalled()
        expect(groupEventFn).toHaveBeenCalledTimes(1)
        expect(groupEventFn).toHaveBeenCalledWith("test", "test-event", {
          test: "1234",
        })

        jest.clearAllMocks()

        eventBus.emit("test-event", { test: "1234", eventGroupId: "test" })
        eventBus.emit("test-event", { test: "test-1" })

        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledTimes(1)
        expect(groupEventFn).toHaveBeenCalledTimes(1)

        expect(eventBus.groupedEventsMap_.get("test")).toEqual([
          expect.objectContaining({ eventName: "test-event" }),
          expect.objectContaining({ eventName: "test-event" }),
        ])

        eventBus.emit("test-event", { test: "1234", eventGroupId: "test-2" })

        expect(eventBus.groupedEventsMap_.get("test-2")).toEqual([
          expect.objectContaining({ eventName: "test-event" }),
        ])
      })

      it("should release events when requested with eventGroupId", async () => {
        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)

        await eventBus.emit([
          {
            eventName: "event-1",
            data: { test: "1", eventGroupId: "group-1" },
          },
          {
            eventName: "event-2",
            data: { test: "2", eventGroupId: "group-1" },
          },
          {
            eventName: "event-1",
            data: { test: "1", eventGroupId: "group-2" },
          },
          {
            eventName: "event-2",
            data: { test: "2", eventGroupId: "group-2" },
          },
          { eventName: "event-1", data: { test: "1" } },
        ])

        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledTimes(1)
        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledWith("event-1", {
          test: "1",
        })

        expect(eventBus.groupedEventsMap_.get("group-1")).toHaveLength(2)
        expect(eventBus.groupedEventsMap_.get("group-2")).toHaveLength(2)

        jest.clearAllMocks()
        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)
        eventBus.releaseGroupedEvents("group-1")

        expect(eventBus.groupedEventsMap_.get("group-1")).not.toBeDefined()
        expect(eventBus.groupedEventsMap_.get("group-2")).toHaveLength(2)

        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledTimes(2)
        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledWith("event-1", {
          test: "1",
        })
        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledWith("event-2", {
          test: "2",
        })
      })

      it("should clear events from grouped events when requested with eventGroupId", async () => {
        await eventBus.emit([
          {
            eventName: "event-1",
            data: { test: "1", eventGroupId: "group-1" },
          },
          {
            eventName: "event-1",
            data: { test: "1", eventGroupId: "group-2" },
          },
        ])

        expect(eventBus.groupedEventsMap_.get("group-1")).toHaveLength(1)
        expect(eventBus.groupedEventsMap_.get("group-2")).toHaveLength(1)

        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)
        eventBus.clearGroupedEvents("group-1")

        expect(eventBus.groupedEventsMap_.get("group-1")).not.toBeDefined()
        expect(eventBus.groupedEventsMap_.get("group-2")).toHaveLength(1)

        eventBus.clearGroupedEvents("group-2")

        expect(eventBus.groupedEventsMap_.get("group-2")).not.toBeDefined()
      })
    })
  })
})
