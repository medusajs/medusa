import Bull from "bull"
import EventBusService from "../event-bus"
import config from "../../config"

jest.genMockFromModule("bull")
jest.mock("bull")
jest.mock("../../config")

config.redisURI = "testhost"

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
}

describe("EventBusService", () => {
  describe("constructor", () => {
    beforeAll(() => {
      jest.resetAllMocks()
      const eventBus = new EventBusService({ logger: loggerMock })
    })

    it("creates bull queue", () => {
      expect(Bull).toHaveBeenCalledTimes(2)
      expect(Bull).toHaveBeenCalledWith("EventBusService:queue", "testhost")
    })
  })

  describe("subscribe", () => {
    let eventBus
    describe("successfully adds subscriber", () => {
      beforeAll(() => {
        jest.resetAllMocks()
        eventBus = new EventBusService({ logger: loggerMock })
        eventBus.subscribe("eventName", () => "test")
      })

      it("added the subscriber to the queue", () => {
        expect(eventBus.observers_["eventName"].length).toEqual(1)
      })
    })

    describe("fails when adding non-function subscriber", () => {
      beforeAll(() => {
        jest.resetAllMocks()
        eventBus = new EventBusService({ logger: loggerMock })
      })

      it("rejects subscriber with error", () => {
        try {
          eventBus.subscribe("eventName", 1234)
        } catch (err) {
          expect(err.message).toEqual("Subscriber must be a function")
        }
      })
    })
  })

  describe("emit", () => {
    let eventBus, job
    describe("successfully adds job to queue", () => {
      beforeAll(() => {
        jest.resetAllMocks()
        eventBus = new EventBusService({ logger: loggerMock })

        eventBus.queue_.add.mockImplementationOnce(() => "hi")

        job = eventBus.emit("eventName", { hi: "1234" })
      })

      it("calls queue.add", () => {
        expect(eventBus.queue_.add).toHaveBeenCalled()
      })

      it("returns the job", () => {
        expect(job).toEqual("hi")
      })
    })
  })

  describe("worker", () => {
    let eventBus, result
    describe("successfully runs the worker", () => {
      beforeAll(async () => {
        jest.resetAllMocks()
        eventBus = new EventBusService({ logger: loggerMock })
        eventBus.subscribe("eventName", () => Promise.resolve("hi"))
        result = await eventBus.worker_({
          data: { eventName: "eventName", data: {} },
        })
      })

      it("calls logger", () => {
        expect(loggerMock.info).toHaveBeenCalled()
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Processing eventName which has 1 subscribers"
        )
      })

      it("returns array with hi", async () => {
        expect(result).toEqual(["hi"])
      })
    })

    describe("continue if errors occur", () => {
      beforeAll(async () => {
        jest.resetAllMocks()
        eventBus = new EventBusService({ logger: loggerMock })
        eventBus.subscribe("eventName", () => Promise.resolve("hi"))
        eventBus.subscribe("eventName", () => Promise.resolve("hi2"))
        eventBus.subscribe("eventName", () => Promise.resolve("hi3"))
        eventBus.subscribe("eventName", () => Promise.reject("fail1"))
        eventBus.subscribe("eventName", () => Promise.reject("fail2"))
        eventBus.subscribe("eventName", () => Promise.reject("fail3"))

        result = await eventBus.worker_({
          data: { eventName: "eventName", data: {} },
        })
      })

      it("calls logger warn on rejections", () => {
        expect(loggerMock.warn).toHaveBeenCalledTimes(3)
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occured while processing eventName: fail1"
        )
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occured while processing eventName: fail2"
        )
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occured while processing eventName: fail3"
        )
      })

      it("returns result from all subscribers", async () => {
        expect(result.length).toEqual(6)
      })
    })
  })
})
