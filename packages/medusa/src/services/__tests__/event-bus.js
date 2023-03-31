import Bull from "bull"
import { MockManager, MockRepository } from "medusa-test-utils"
import config from "../../loaders/config"
import EventBusService from "../event-bus"

jest.genMockFromModule("bull")
jest.mock("bull")
jest.mock("../../loaders/config")

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
      const stagedJobRepository = MockRepository({
        find: () => Promise.resolve([]),
      })

      eventBus = new EventBusService(
        {
          manager: MockManager,
          stagedJobRepository,
          logger: loggerMock,
        },
        {
          projectConfig: {
            redis_url: "localhost",
          },
        }
      )
    })

    afterAll(async () => {
      await eventBus.stopEnqueuer()
    })

    it("creates bull queue", () => {
      expect(Bull).toHaveBeenCalledTimes(1)
      expect(Bull).toHaveBeenCalledWith("EventBusService:queue", {
        createClient: expect.any(Function),
      })
    })
  })

  describe("subscribe", () => {
    let eventBus

    beforeEach(() => {
      jest.resetAllMocks()

      eventBus = new EventBusService(
        {
          manager: MockManager,
          logger: loggerMock,
        },
        {
          projectConfig: {
            redis_url: "localhost",
          },
        }
      )
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
        const stagedJobRepository = MockRepository({
          find: () => Promise.resolve([]),
        })

        eventBus = new EventBusService({
          manager: MockManager,
          stagedJobRepository,
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
    const eventName = "eventName"
    const defaultOptions = {
      attempts: 1,
      removeOnComplete: true,
    }

    const data = { hi: "1234" }
    const bulkData = [{ hi: "1234" }, { hi: "12345" }]

    const mockManager = MockManager

    describe("successfully adds job to queue", () => {
      let eventBus
      let stagedJobRepository

      beforeEach(() => {
        stagedJobRepository = MockRepository({
          insertBulk: async (data) => data,
          create: (data) => data,
        })

        eventBus = new EventBusService(
          {
            logger: loggerMock,
            manager: mockManager,
            stagedJobRepository,
          },
          {
            projectConfig: {
              redis_url: "localhost",
            },
          }
        )

        eventBus.queue_.addBulk.mockImplementationOnce(() => "hi")
      })

      afterEach(async () => {
        await eventBus.stopEnqueuer()
        jest.clearAllMocks()
      })

      it("calls queue.addBulk", async () => {
        await eventBus.emit(eventName, data)

        expect(eventBus.queue_.addBulk).toHaveBeenCalled()
        expect(eventBus.queue_.addBulk).toHaveBeenCalledWith([
          {
            data: {
              data,
              eventName,
            },
            opts: defaultOptions,
          },
        ])
      })

      it("calls stagedJob repository insertBulk", async () => {
        await eventBus.withTransaction(mockManager).emit(eventName, data)

        expect(stagedJobRepository.create).toHaveBeenCalled()
        expect(stagedJobRepository.create).toHaveBeenCalledWith({
          event_name: eventName,
          data: data,
          options: defaultOptions,
        })

        expect(stagedJobRepository.insertBulk).toHaveBeenCalled()
        expect(stagedJobRepository.insertBulk).toHaveBeenCalledWith([
          {
            event_name: eventName,
            data,
            options: defaultOptions,
          },
        ])
      })
    })

    describe("successfully adds jobs in bulk to queue", () => {
      let eventBus
      let stagedJobRepository

      beforeEach(() => {
        stagedJobRepository = MockRepository({
          insertBulk: async (data) => data,
          create: (data) => data,
        })

        eventBus = new EventBusService(
          {
            logger: loggerMock,
            manager: mockManager,
            stagedJobRepository,
          },
          {
            projectConfig: {
              redis_url: "localhost",
            },
          }
        )

        eventBus.queue_.addBulk.mockImplementationOnce(() => "hi")
      })

      afterEach(async () => {
        jest.clearAllMocks()
        await eventBus.stopEnqueuer()
      })

      it("calls queue.addBulk", async () => {
        await eventBus.emit([
          { eventName, data: bulkData[0] },
          { eventName, data: bulkData[1] },
        ])

        expect(eventBus.queue_.addBulk).toHaveBeenCalledTimes(1)
        expect(eventBus.queue_.addBulk).toHaveBeenCalledWith([
          {
            data: {
              data: bulkData[0],
              eventName,
            },
            opts: defaultOptions,
          },
          {
            data: {
              data: bulkData[1],
              eventName,
            },
            opts: defaultOptions,
          },
        ])
      })

      it("calls stagedJob repository insertBulk", async () => {
        await eventBus.withTransaction(mockManager).emit([
          { eventName, data: bulkData[0] },
          { eventName, data: bulkData[1] },
        ])

        expect(stagedJobRepository.create).toHaveBeenCalledTimes(2)
        expect(stagedJobRepository.create).toHaveBeenNthCalledWith(1, {
          data: bulkData[0],
          event_name: eventName,
          options: defaultOptions,
        })
        expect(stagedJobRepository.create).toHaveBeenNthCalledWith(2, {
          data: bulkData[1],
          event_name: eventName,
          options: defaultOptions,
        })

        expect(stagedJobRepository.insertBulk).toHaveBeenCalledTimes(1)
        expect(stagedJobRepository.insertBulk).toHaveBeenCalledWith([
          {
            data: bulkData[0],
            event_name: eventName,
            options: defaultOptions,
          },
          {
            data: bulkData[1],
            event_name: eventName,
            options: defaultOptions,
          },
        ])
      })
    })

    describe("successfully adds job to queue with global options", () => {
      let eventBus
      let stagedJobRepository

      beforeEach(() => {
        stagedJobRepository = MockRepository({
          insertBulk: async (data) => data,
          create: (data) => data,
        })

        eventBus = new EventBusService(
          {
            logger: loggerMock,
            manager: mockManager,
            stagedJobRepository,
          },
          {
            projectConfig: {
              event_options: { removeOnComplete: 10 },
              redis_url: "localhost",
            },
          }
        )

        eventBus.queue_.addBulk.mockImplementationOnce(() => "hi")

        eventBus.emit(eventName, data)
      })

      afterEach(async () => {
        jest.clearAllMocks()
        await eventBus.stopEnqueuer()
      })

      it("calls queue.addBulk", () => {
        expect(eventBus.queue_.addBulk).toHaveBeenCalled()
        expect(eventBus.queue_.addBulk).toHaveBeenCalledWith([
          {
            data: {
              data,
              eventName,
            },
            opts: { removeOnComplete: 10, attempts: 1 },
          },
        ])
      })
    })

    describe("successfully adds job to queue with default options", () => {
      let eventBus
      let stagedJobRepository

      beforeEach(() => {
        stagedJobRepository = MockRepository({
          insertBulk: async (data) => data,
          create: (data) => data,
        })

        eventBus = new EventBusService(
          {
            logger: loggerMock,
            manager: mockManager,
            stagedJobRepository,
          },
          {
            projectConfig: {
              redis_url: "localhost",
            },
          }
        )

        eventBus.queue_.addBulk.mockImplementationOnce(() => "hi")

        eventBus.emit(eventName, data)
      })

      afterEach(async () => {
        jest.clearAllMocks()
        await eventBus.stopEnqueuer()
      })

      it("calls queue.addBulk", () => {
        expect(eventBus.queue_.addBulk).toHaveBeenCalled()
        expect(eventBus.queue_.addBulk).toHaveBeenCalledWith([
          {
            data: {
              data,
              eventName,
            },
            opts: { removeOnComplete: true, attempts: 1 },
          },
        ])
      })
    })

    describe("successfully adds job to queue with local options and global options merged", () => {
      let eventBus
      let stagedJobRepository

      beforeEach(() => {
        stagedJobRepository = MockRepository({
          insertBulk: async (data) => data,
          create: (data) => data,
        })

        eventBus = new EventBusService(
          {
            logger: loggerMock,
            manager: MockManager,
            stagedJobRepository,
          },
          {
            projectConfig: {
              event_options: { removeOnComplete: 10 },
              redis_url: "localhost",
            },
          }
        )

        eventBus.queue_.addBulk.mockImplementationOnce(() => "hi")

        eventBus.emit(eventName, data, {
          attempts: 10,
          delay: 1000,
          backoff: { type: "exponential" },
        })
      })

      afterEach(async () => {
        jest.clearAllMocks()
        await eventBus.stopEnqueuer()
      })

      it("calls queue.add", () => {
        expect(eventBus.queue_.addBulk).toHaveBeenCalled()
        expect(eventBus.queue_.addBulk).toHaveBeenCalledWith([
          {
            data: {
              data,
              eventName,
            },
            opts: {
              removeOnComplete: 10, // global option
              attempts: 10, // local option
              delay: 1000, // local option
              backoff: { type: "exponential" }, // local option
            },
          },
        ])
      })
    })
  })

  describe("worker", () => {
    let eventBus
    let result
    describe("successfully runs the worker", () => {
      beforeAll(async () => {
        jest.resetAllMocks()
        const stagedJobRepository = MockRepository({
          find: () => Promise.resolve([]),
        })

        eventBus = new EventBusService({
          manager: MockManager,
          stagedJobRepository,
          logger: loggerMock,
        })
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
