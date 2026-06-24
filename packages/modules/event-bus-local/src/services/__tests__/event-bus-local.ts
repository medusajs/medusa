import LocalEventBusService from "../event-bus-local"

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

        eventBus = new LocalEventBusService(moduleDeps as any, {}, {} as any)
        eventEmitter = (eventBus as any).eventEmitter_
      })

      it("should emit an event", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve())

        eventEmitter.emit = jest.fn((data) => data)
        eventEmitter.listenerCount = jest.fn((event) =>
          event === "eventName" ? 1 : 0
        )

        await eventBus.emit({
          name: "eventName",
          data: { hi: "1234" },
        })

        // Wait for async emission to complete
        await new Promise((resolve) => setImmediate(resolve))

        expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "eventName",
          expect.objectContaining({
            data: { hi: "1234" },
            name: "eventName",
            metadata: expect.objectContaining({
              published_at: expect.any(Date),
              created_at: expect.any(Date),
            }),
          })
        )

        expect(loggerMock.info).toHaveBeenCalledTimes(1)
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Processing eventName which has 1 subscribers"
        )
      })

      it("should emit an event but not log anything if it is internal", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve())

        eventEmitter.emit = jest.fn((data) => data)
        eventEmitter.listenerCount = jest.fn((event) =>
          event === "eventName" ? 1 : 0
        )

        await eventBus.emit({
          name: "eventName",
          data: { hi: "1234" },
          options: {
            internal: true,
          },
        })

        // Wait for async emission to complete
        await new Promise((resolve) => setImmediate(resolve))

        expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "eventName",
          expect.objectContaining({
            data: { hi: "1234" },
            name: "eventName",
            metadata: expect.objectContaining({
              published_at: expect.any(Date),
              created_at: expect.any(Date),
            }),
          })
        )

        await eventBus.emit(
          {
            name: "eventName",
            data: { hi: "1234" },
          },
          {
            internal: true,
          }
        )

        // Wait for async emission to complete
        await new Promise((resolve) => setImmediate(resolve))

        expect(eventEmitter.emit).toHaveBeenCalledTimes(2)
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "eventName",
          expect.objectContaining({
            data: { hi: "1234" },
            name: "eventName",
            metadata: expect.objectContaining({
              published_at: expect.any(Date),
              created_at: expect.any(Date),
            }),
          })
        )

        expect(loggerMock.info).toHaveBeenCalledTimes(1)
      })

      it("should emit multiple events", async () => {
        eventBus.subscribe("event-1", () => Promise.resolve())
        eventBus.subscribe("event-2", () => Promise.resolve())

        eventEmitter.emit = jest.fn((data) => data)
        eventEmitter.listenerCount = jest.fn((event) =>
          event === "event-1" || event === "event-2" ? 1 : 0
        )

        await eventBus.emit([
          { name: "event-1", data: { hi: "1234" } },
          { name: "event-2", data: { hi: "5678" } },
        ])

        // Wait for async emission to complete
        await new Promise((resolve) => setImmediate(resolve))

        expect(eventEmitter.emit).toHaveBeenCalledTimes(2)
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "event-1",
          expect.objectContaining({
            data: { hi: "1234" },
            name: "event-1",
            metadata: expect.objectContaining({
              published_at: expect.any(Date),
              created_at: expect.any(Date),
            }),
          })
        )
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "event-2",
          expect.objectContaining({
            data: { hi: "5678" },
            name: "event-2",
            metadata: expect.objectContaining({
              published_at: expect.any(Date),
              created_at: expect.any(Date),
            }),
          })
        )
      })

      it("should group an event if data consists of eventGroupId", async () => {
        let groupEventFn = jest.spyOn(eventBus, "groupEvent" as any)
        eventEmitter.emit = jest.fn((data) => data)

        await eventBus.emit({
          name: "test-event",
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
          metadata: { eventGroupId: "test", created_at: expect.any(Date) },
          name: "test-event",
          options: {},
        })

        jest.clearAllMocks()

        groupEventFn = jest.spyOn(eventBus, "groupEvent" as any)
        eventEmitter.emit = jest.fn((data) => data)

        await eventBus.emit([
          {
            name: "test-event",
            data: { test: "1234" },
            metadata: { eventGroupId: "test" },
          },
          {
            name: "test-event",
            data: { test: "test-1" },
          },
        ])

        expect(groupEventFn).toHaveBeenCalledTimes(1)

        expect((eventBus as any).groupedEventsMap_.get("test")).toEqual([
          expect.objectContaining({ name: "test-event" }),
          expect.objectContaining({ name: "test-event" }),
        ])

        await eventBus.emit({
          name: "test-event",
          data: { test: "1234" },
          metadata: { eventGroupId: "test-2" },
        })

        expect((eventBus as any).groupedEventsMap_.get("test-2")).toEqual([
          expect.objectContaining({ name: "test-event" }),
        ])
      })

      it("should release events when requested with eventGroupId", async () => {
        eventBus.subscribe("event-1", () => Promise.resolve())
        eventBus.subscribe("event-2", () => Promise.resolve())

        eventEmitter.emit = jest.fn((data) => data)
        eventEmitter.listenerCount = jest.fn((event) =>
          event === "event-1" || event === "event-2" ? 1 : 0
        )

        await eventBus.emit([
          {
            name: "event-1",
            data: { test: "1" },
            metadata: { eventGroupId: "group-1" },
          },
          {
            name: "event-2",
            data: { test: "2" },
            metadata: { eventGroupId: "group-1" },
          },
          {
            name: "event-1",
            data: { test: "1" },
            metadata: { eventGroupId: "group-2" },
          },
          {
            name: "event-2",
            data: { test: "2" },
            metadata: { eventGroupId: "group-2" },
          },
          { name: "event-1", data: { test: "1" } },
        ])

        // Wait for async emission to complete
        await new Promise((resolve) => setImmediate(resolve))

        expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "event-1",
          expect.objectContaining({
            data: { test: "1" },
            name: "event-1",
            metadata: expect.objectContaining({
              published_at: expect.any(Date),
              created_at: expect.any(Date),
            }),
          })
        )

        expect((eventBus as any).groupedEventsMap_.get("group-1")).toHaveLength(
          2
        )
        expect((eventBus as any).groupedEventsMap_.get("group-2")).toHaveLength(
          2
        )

        jest.clearAllMocks()
        eventEmitter.emit = jest.fn((data) => data)
        await eventBus.releaseGroupedEvents("group-1")

        // Wait for async emission to complete
        await new Promise((resolve) => setImmediate(resolve))

        expect(
          (eventBus as any).groupedEventsMap_.get("group-1")
        ).not.toBeDefined()
        expect((eventBus as any).groupedEventsMap_.get("group-2")).toHaveLength(
          2
        )

        expect(eventEmitter.emit).toHaveBeenCalledTimes(2)
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "event-1",
          expect.objectContaining({
            data: { test: "1" },
            name: "event-1",
            metadata: expect.objectContaining({
              eventGroupId: "group-1",
              published_at: expect.any(Date),
              created_at: expect.any(Date),
            }),
          })
        )
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "event-2",
          expect.objectContaining({
            data: { test: "2" },
            name: "event-2",
            metadata: expect.objectContaining({
              eventGroupId: "group-1",
              published_at: expect.any(Date),
              created_at: expect.any(Date),
            }),
          })
        )
      })

      it("should set created_at at emit and published_at at release for grouped events", async () => {
        jest.useFakeTimers()

        try {
          jest.setSystemTime(new Date("2026-06-20T10:00:00.000Z"))

          eventEmitter.emit = jest.fn((data) => data)
          eventEmitter.listenerCount = jest.fn((event) =>
            event === "grouped-event" ? 1 : 0
          )

          await eventBus.emit({
            name: "grouped-event",
            data: { test: "1" },
            metadata: { eventGroupId: "timed-group" },
          })

          const stagedEvent = (eventBus as any).groupedEventsMap_.get(
            "timed-group"
          )[0]
          expect(stagedEvent.metadata.created_at).toEqual(
            new Date("2026-06-20T10:00:00.000Z")
          )
          expect(stagedEvent.metadata.published_at).toBeUndefined()

          jest.setSystemTime(new Date("2026-06-20T11:00:00.000Z"))
          jest.clearAllMocks()
          eventEmitter.emit = jest.fn((data) => data)
          eventEmitter.listenerCount = jest.fn((event) =>
            event === "grouped-event" ? 1 : 0
          )

          await eventBus.releaseGroupedEvents("timed-group")
          await Promise.resolve()

          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "grouped-event",
            expect.objectContaining({
              metadata: expect.objectContaining({
                created_at: new Date("2026-06-20T10:00:00.000Z"),
                published_at: new Date("2026-06-20T11:00:00.000Z"),
              }),
            })
          )
        } finally {
          jest.useRealTimers()
        }
      })

      it("should clear events from grouped events when requested with eventGroupId", async () => {
        eventEmitter.emit = jest.fn((data) => data)
        const getMap = () => (eventBus as any).groupedEventsMap_

        await eventBus.emit([
          {
            name: "event-1",
            data: { test: "1" },
            metadata: { eventGroupId: "group-1" },
          },
          {
            name: "event-1",
            data: { test: "1" },
            metadata: { eventGroupId: "group-2" },
          },
        ])

        expect(getMap().get("group-1")).toHaveLength(1)
        expect(getMap().get("group-2")).toHaveLength(1)

        await eventBus.clearGroupedEvents("group-1")

        expect(getMap().get("group-1")).not.toBeDefined()
        expect(getMap().get("group-2")).toHaveLength(1)

        await eventBus.clearGroupedEvents("group-2")

        expect(getMap().get("group-2")).not.toBeDefined()
      })
    })

    describe("Events without subscribers", () => {
      beforeEach(() => {
        jest.clearAllMocks()

        eventBus = new LocalEventBusService(moduleDeps as any, {}, {} as any)
        eventEmitter = (eventBus as any).eventEmitter_
      })

      it("should not emit events when there are no subscribers", async () => {
        eventEmitter.emit = jest.fn((data) => data)
        eventEmitter.listenerCount = jest.fn(() => 0)

        await eventBus.emit({
          name: "eventWithoutSubscribers",
          data: { test: "data" },
        })

        expect(eventEmitter.emit).not.toHaveBeenCalled()
      })

      it("should still call interceptors even when there are no subscribers", async () => {
        const callInterceptorsSpy = jest.spyOn(
          eventBus as any,
          "callInterceptors"
        )

        eventEmitter.emit = jest.fn((data) => data)
        eventEmitter.listenerCount = jest.fn(() => 0)

        await eventBus.emit({
          name: "eventWithoutSubscribers",
          data: { test: "data" },
        })

        expect(callInterceptorsSpy).toHaveBeenCalledTimes(1)
        expect(callInterceptorsSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "eventWithoutSubscribers",
            data: { test: "data" },
            metadata: expect.objectContaining({
              created_at: expect.any(Date),
            }),
          }),
          { isGrouped: false }
        )

        expect(eventEmitter.emit).not.toHaveBeenCalled()

        callInterceptorsSpy.mockRestore()
      })

      it("should emit events with wildcard subscriber", async () => {
        eventBus.subscribe("*", () => Promise.resolve())

        eventEmitter.emit = jest.fn((data) => data)
        eventEmitter.listenerCount = jest.fn((event) => (event === "*" ? 1 : 0))

        await eventBus.emit({
          name: "anyEvent",
          data: { test: "data" },
        })

        // Wait for async emission to complete
        await new Promise((resolve) => setImmediate(resolve))

        expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "*",
          expect.objectContaining({
            data: { test: "data" },
            name: "anyEvent",
            metadata: expect.objectContaining({
              published_at: expect.any(Date),
              created_at: expect.any(Date),
            }),
          })
        )
      })

      it("should not emit grouped events when releasing if there are no subscribers", async () => {
        eventEmitter.emit = jest.fn((data) => data)
        eventEmitter.listenerCount = jest.fn(() => 0)

        await eventBus.emit({
          name: "grouped-event-no-sub",
          data: { hi: "1234" },
          metadata: { eventGroupId: "test-group-no-sub" },
        })

        expect(
          (eventBus as any).groupedEventsMap_.get("test-group-no-sub")
        ).toHaveLength(1)
        expect(eventEmitter.emit).not.toHaveBeenCalled()

        jest.clearAllMocks()
        eventEmitter.emit = jest.fn((data) => data)

        await eventBus.releaseGroupedEvents("test-group-no-sub")

        expect(eventEmitter.emit).not.toHaveBeenCalled()

        expect(
          (eventBus as any).groupedEventsMap_.get("test-group-no-sub")
        ).not.toBeDefined()
      })

      it("should still call interceptors for grouped events without subscribers", async () => {
        eventEmitter.emit = jest.fn((data) => data)
        eventEmitter.listenerCount = jest.fn(() => 0)

        await eventBus.emit({
          name: "grouped-event-no-sub-2",
          data: { hi: "1234" },
          metadata: { eventGroupId: "test-group-no-sub-2" },
        })

        expect(
          (eventBus as any).groupedEventsMap_.get("test-group-no-sub-2")
        ).toHaveLength(1)

        jest.clearAllMocks()
        eventEmitter.emit = jest.fn((data) => data)

        const callInterceptorsSpy = jest.spyOn(
          eventBus as any,
          "callInterceptors"
        )

        await eventBus.releaseGroupedEvents("test-group-no-sub-2")

        expect(callInterceptorsSpy).toHaveBeenCalledTimes(1)
        expect(callInterceptorsSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "grouped-event-no-sub-2",
            data: { hi: "1234" },
            metadata: expect.objectContaining({
              eventGroupId: "test-group-no-sub-2",
              created_at: expect.any(String),
            }),
          }),
          { isGrouped: true, eventGroupId: "test-group-no-sub-2" }
        )

        expect(eventEmitter.emit).not.toHaveBeenCalled()

        callInterceptorsSpy.mockRestore()
      })
    })
  })
})
