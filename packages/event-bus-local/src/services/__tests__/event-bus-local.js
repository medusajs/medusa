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

      it("Emits an event", () => {
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

      it("Emits multiple events", () => {
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
    })
  })
})
