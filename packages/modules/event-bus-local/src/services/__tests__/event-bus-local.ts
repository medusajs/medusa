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
  let eventBus: LocalEventBusService
  let eventEmitter

  describe("emit", () => {
    describe("Successfully emits events", () => {
      beforeEach(() => {
        jest.clearAllMocks()

        eventBus = new LocalEventBusService(moduleDeps as any)
        eventEmitter = (eventBus as any).eventEmitter_
      })

      it("should emit an event", async () => {
        eventEmitter.emit = jest.fn((data) => data)

        await eventBus.emit({
          eventName: "eventName",
          data: { hi: "1234" },
        })

        expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
        expect(eventEmitter.emit).toHaveBeenCalledWith("eventName", {
          data: { hi: "1234" },
          eventName: "eventName",
        })
      })

      it("should emit multiple events", async () => {
        eventEmitter.emit = jest.fn((data) => data)

        await eventBus.emit([
          { eventName: "event-1", data: { hi: "1234" } },
          { eventName: "event-2", data: { hi: "5678" } },
        ])

        expect(eventEmitter.emit).toHaveBeenCalledTimes(2)
        expect(eventEmitter.emit).toHaveBeenCalledWith("event-1", {
          data: { hi: "1234" },
          eventName: "event-1",
        })
        expect(eventEmitter.emit).toHaveBeenCalledWith("event-2", {
          data: { hi: "5678" },
          eventName: "event-2",
        })
      })

      it("should group an event if data consists of eventGroupId", async () => {
        let groupEventFn = jest.spyOn(eventBus, "groupEvent" as any)
        eventEmitter.emit = jest.fn((data) => data)

        await eventBus.emit({
          eventName: "test-event",
          data: {
            test: "1234",
          },
          metadata: {
            eventGroupId: "test",
          },
        })

        expect(eventEmitter.emit).not.toHaveBeenCalled()
        expect(groupEventFn).toHaveBeenCalledTimes(1)
        expect(groupEventFn).toHaveBeenCalledWith("test", {
          data: { test: "1234" },
          metadata: { eventGroupId: "test" },
          eventName: "test-event",
        })

        jest.clearAllMocks()

        groupEventFn = jest.spyOn(eventBus, "groupEvent" as any)
        eventEmitter.emit = jest.fn((data) => data)

        eventBus.emit([
          {
            eventName: "test-event",
            data: { test: "1234" },
            metadata: { eventGroupId: "test" },
          },
          {
            eventName: "test-event",
            data: { test: "test-1" },
          },
        ])

        expect(groupEventFn).toHaveBeenCalledTimes(1)

        expect((eventBus as any).groupedEventsMap_.get("test")).toEqual([
          expect.objectContaining({ eventName: "test-event" }),
          expect.objectContaining({ eventName: "test-event" }),
        ])

        await eventBus.emit({
          eventName: "test-event",
          data: { test: "1234" },
          metadata: { eventGroupId: "test-2" },
        })

        expect((eventBus as any).groupedEventsMap_.get("test-2")).toEqual([
          expect.objectContaining({ eventName: "test-event" }),
        ])
      })

      it("should release events when requested with eventGroupId", async () => {
        eventEmitter.emit = jest.fn((data) => data)

        await eventBus.emit([
          {
            eventName: "event-1",
            data: { test: "1" },
            metadata: { eventGroupId: "group-1" },
          },
          {
            eventName: "event-2",
            data: { test: "2" },
            metadata: { eventGroupId: "group-1" },
          },
          {
            eventName: "event-1",
            data: { test: "1" },
            metadata: { eventGroupId: "group-2" },
          },
          {
            eventName: "event-2",
            data: { test: "2" },
            metadata: { eventGroupId: "group-2" },
          },
          { eventName: "event-1", data: { test: "1" } },
        ])

        expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
        expect(eventEmitter.emit).toHaveBeenCalledWith("event-1", {
          data: { test: "1" },
          eventName: "event-1",
        })

        expect((eventBus as any).groupedEventsMap_.get("group-1")).toHaveLength(
          2
        )
        expect((eventBus as any).groupedEventsMap_.get("group-2")).toHaveLength(
          2
        )

        jest.clearAllMocks()
        eventEmitter.emit = jest.fn((data) => data)
        await eventBus.releaseGroupedEvents("group-1")

        expect(
          (eventBus as any).groupedEventsMap_.get("group-1")
        ).not.toBeDefined()
        expect((eventBus as any).groupedEventsMap_.get("group-2")).toHaveLength(
          2
        )

        expect(eventEmitter.emit).toHaveBeenCalledTimes(2)
        expect(eventEmitter.emit).toHaveBeenCalledWith("event-1", {
          data: { test: "1" },
          eventName: "event-1",
          metadata: { eventGroupId: "group-1" },
        })
        expect(eventEmitter.emit).toHaveBeenCalledWith("event-2", {
          data: { test: "2" },
          eventName: "event-2",
          metadata: { eventGroupId: "group-1" },
        })
      })

      it("should clear events from grouped events when requested with eventGroupId", async () => {
        eventEmitter.emit = jest.fn((data) => data)
        const getMap = () => (eventBus as any).groupedEventsMap_

        await eventBus.emit([
          {
            eventName: "event-1",
            data: { test: "1" },
            metadata: { eventGroupId: "group-1" },
          },
          {
            eventName: "event-1",
            data: { test: "1" },
            metadata: { eventGroupId: "group-2" },
          },
        ])

        expect(getMap().get("group-1")).toHaveLength(1)
        expect(getMap().get("group-2")).toHaveLength(1)

        eventBus.clearGroupedEvents("group-1")

        expect(getMap().get("group-1")).not.toBeDefined()
        expect(getMap().get("group-2")).toHaveLength(1)

        eventBus.clearGroupedEvents("group-2")

        expect(getMap().get("group-2")).not.toBeDefined()
      })
    })
  })
})
