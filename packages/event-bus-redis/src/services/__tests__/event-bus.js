import { StagedJobServiceMock } from "@medusajs/medusa/dist/services/__mocks__/staged-job"
import Bull from "bullmq"
import { MockManager } from "medusa-test-utils"
import EventBusService from "../event-bus-redis"

jest.genMockFromModule("bullmq")
jest.mock("bullmq")

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

      eventBus = new EventBusService(
        {
          manager: MockManager,
          logger: loggerMock,
        },
        {
          redisUrl: "test-url",
        },
        {
          resources: "shared",
        }
      )
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

  describe("emit", () => {
    let eventBus

    describe("successfully adds job to queue", () => {
      beforeAll(() => {
        jest.resetAllMocks()

        eventBus = new EventBusService(
          {
            manager: MockManager,
            logger: loggerMock,
          },
          {
            redisUrl: "test-url",
          },
          {
            resources: "shared",
          }
        )

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
