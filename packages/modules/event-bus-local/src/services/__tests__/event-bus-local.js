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

      it("should emit multiple events", () => {
        eventBus = new LocalEventBusService(
          moduleDeps,
          {},
          {
            resources: "shared",
          }
        )

        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)

        eventBus.emit([
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

      it("should stage an event if data consists of eventGroupId", () => {
        eventBus = new LocalEventBusService(
          moduleDeps,
          {},
          { resources: "shared" }
        )

        const stageEventFn = jest.spyOn(eventBus, "stageEvent")

        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)

        eventBus.emit("test-event", { test: "1234", eventGroupId: "test" })

        expect(eventBus.eventEmitter_.emit).not.toHaveBeenCalled()
        expect(stageEventFn).toHaveBeenCalledTimes(1)
        expect(stageEventFn).toHaveBeenCalledWith("test", "test-event", {
          test: "1234",
        })

        eventBus.emit("test-event", { test: "1234", eventGroupId: "test" })

        expect(eventBus.stagedEventsMap_.get("test")).toEqual([
          expect.objectContaining({ eventName: "test-event" }),
          expect.objectContaining({ eventName: "test-event" }),
        ])

        eventBus.emit("test-event", { test: "1234", eventGroupId: "test-2" })

        expect(eventBus.stagedEventsMap_.get("test-2")).toEqual([
          expect.objectContaining({ eventName: "test-event" }),
        ])
      })

      it("should release events when requested with eventGroupId", () => {
        eventBus = new LocalEventBusService(
          moduleDeps,
          {},
          { resources: "shared" }
        )

        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)

        eventBus.emit([
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

        expect(eventBus.stagedEventsMap_.get("group-1")).toHaveLength(2)
        expect(eventBus.stagedEventsMap_.get("group-2")).toHaveLength(2)

        jest.clearAllMocks()
        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)
        eventBus.releaseStagedEvents("group-1")

        expect(eventBus.stagedEventsMap_.get("group-1")).not.toBeDefined()
        expect(eventBus.stagedEventsMap_.get("group-2")).toHaveLength(2)

        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledTimes(2)
        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledWith("event-1", {
          test: "1",
        })
        expect(eventBus.eventEmitter_.emit).toHaveBeenCalledWith("event-2", {
          test: "2",
        })
      })

      it("should clear events from staged events when requested with eventGroupId", () => {
        eventBus = new LocalEventBusService(
          moduleDeps,
          {},
          { resources: "shared" }
        )

        eventBus.emit([
          {
            eventName: "event-1",
            data: { test: "1", eventGroupId: "group-1" },
          },
          {
            eventName: "event-1",
            data: { test: "1", eventGroupId: "group-2" },
          },
        ])

        expect(eventBus.stagedEventsMap_.get("group-1")).toHaveLength(1)
        expect(eventBus.stagedEventsMap_.get("group-2")).toHaveLength(1)

        eventBus.eventEmitter_.emit.mockImplementationOnce((data) => data)
        eventBus.clearStagedEvents("group-1")

        expect(eventBus.stagedEventsMap_.get("group-1")).not.toBeDefined()
        expect(eventBus.stagedEventsMap_.get("group-2")).toHaveLength(1)

        eventBus.clearStagedEvents("group-2")

        expect(eventBus.stagedEventsMap_.get("group-2")).not.toBeDefined()
      })
    })
  })
})
