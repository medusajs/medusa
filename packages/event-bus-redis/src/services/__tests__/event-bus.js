import config from "@medusajs/medusa/src/loaders/config"
import StagedJobServiceMock from "@medusajs/medusa/src/services/__mocks__/staged-job"
import Bull from "bull"
import { MockManager } from "medusa-test-utils"
import EventBusService from "../event-bus-redis"

jest.genMockFromModule("bull")
jest.mock("bull")
jest.mock("@medusajs/medusa/src/loaders/config")

config.redisURI = "testhost"

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
}

describe("EventBusService", () => {
  describe("constructor", () => {
    let eventBus
    beforeAll(() => {
      jest.resetAllMocks()

      eventBus = new EventBusService({
        manager: MockManager,
        logger: loggerMock,
      })
    })

    afterAll(async () => {
      await eventBus.stopEnqueuer()
    })

    it("creates bull queue", () => {
      expect(Bull).toHaveBeenCalledTimes(2)
      expect(Bull).toHaveBeenCalledWith("EventBusService:queue", {
        createClient: expect.any(Function),
      })
    })
  })

  describe("subscribe", () => {
    let eventBus

    beforeEach(() => {
      jest.resetAllMocks()

      eventBus = new EventBusService({
        manager: MockManager,
        logger: loggerMock,
      })
    })

    afterAll(async () => {
      await eventBus.stopEnqueuer()
    })

    it("throws when subscriber already exists", async () => {
      expect.assertions(1)

      eventBus.subscribe("eventName", () => "test", {
        subscriberId: "my-subscriber",
      })

      try {
        eventBus.subscribe("eventName", () => "new", {
          subscriberId: "my-subscriber",
        })
      } catch (error) {
        expect(error.message).toBe(
          "Subscriber with id my-subscriber already exists"
        )
      }
    })

    it("successfully adds subscriber", () => {
      eventBus.subscribe("eventName", () => "test", {
        subscriberId: "my-subscriber",
      })

      expect(eventBus.eventToSubscribersMap_.get("eventName").length).toEqual(1)
    })

    describe("fails when adding non-function subscriber", () => {
      let eventBus
      beforeAll(() => {
        jest.resetAllMocks()

        eventBus = new EventBusService({
          manager: MockManager,
          logger: loggerMock,
        })
      })

      afterAll(async () => {
        await eventBus.stopEnqueuer()
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
    let eventBus

    describe("successfully adds job to queue", () => {
      beforeAll(() => {
        jest.resetAllMocks()

        eventBus = new EventBusService({
          logger: loggerMock,
          manager: MockManager,
        })

        eventBus.queue_.add.mockImplementationOnce(() => "hi")

        eventBus.emit("eventName", { hi: "1234" })
      })
      afterAll(async () => {
        await eventBus.stopEnqueuer()
      })

      it("calls queue.add", () => {
        expect(eventBus.queue_.add).toHaveBeenCalled()
      })
    })
  })

  describe("worker", () => {
    let eventBus
    let result
    describe("successfully runs the worker", () => {
      beforeAll(async () => {
        jest.resetAllMocks()

        eventBus = new EventBusService(
          {
            manager: MockManager,
            stagedJobService: StagedJobServiceMock,
            logger: loggerMock,
          },
          {}
        )
        eventBus.subscribe("eventName", () => Promise.resolve("hi"))

        result = await eventBus.worker_({
          data: { eventName: "eventName", data: {} },
        })
      })

      afterAll(async () => {
        await eventBus.stopEnqueuer()
      })

      it("calls logger", () => {
        expect(loggerMock.info).toHaveBeenCalled()
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Processing eventName which has 1 subscribers"
        )
      })

      it("calls staged job service", () => {
        expect(StagedJobServiceMock.list).toHaveBeenCalled()
      })

      it("returns array with hi", async () => {
        expect(result).toEqual(["hi"])
      })
    })

    describe("continue if errors occur", () => {
      let eventBus
      beforeAll(async () => {
        jest.resetAllMocks()

        eventBus = new EventBusService({
          manager: MockManager,
          logger: loggerMock,
        })

        eventBus.subscribe("eventName", () => Promise.resolve("hi"))
        eventBus.subscribe("eventName", () => Promise.resolve("hi2"))
        eventBus.subscribe("eventName", () => Promise.resolve("hi3"))
        eventBus.subscribe("eventName", () => Promise.reject("fail1"))
        eventBus.subscribe("eventName", () => Promise.reject("fail2"))
        eventBus.subscribe("eventName", () => Promise.reject("fail3"))

        result = await eventBus.worker_({
          data: { eventName: "eventName", data: {} },
          update: (data) => data,
          opts: { attempts: 1 },
        })
      })

      afterAll(async () => {
        await eventBus.stopEnqueuer()
      })

      it("calls logger warn on rejections", () => {
        expect(loggerMock.warn).toHaveBeenCalledTimes(4)
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occurred while processing eventName: fail1"
        )
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occurred while processing eventName: fail2"
        )
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occurred while processing eventName: fail3"
        )
      })

      it("calls logger warn from retry not kicking in", () => {
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "One or more subscribers of eventName failed. Retrying is not configured. Use 'attempts' option when emitting events."
        )
      })
    })
  })
})
