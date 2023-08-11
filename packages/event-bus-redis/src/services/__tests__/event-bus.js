import { Queue, Worker } from "bullmq"
import { MockManager } from "medusa-test-utils"
import RedisEventBusService from "../event-bus-redis"

jest.genMockFromModule("bullmq")
jest.genMockFromModule("ioredis")
jest.mock("bullmq")
jest.mock("ioredis")

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
}

const simpleModuleOptions = { redisUrl: "test-url" }
const moduleDeps = {
  manager: MockManager,
  logger: loggerMock,
  eventBusRedisConnection: {},
}

describe("RedisEventBusService", () => {
  let eventBus

  describe("constructor", () => {
    beforeAll(() => {
      jest.clearAllMocks()
    })

    it("Creates a queue + worker", () => {
      eventBus = new RedisEventBusService(moduleDeps, simpleModuleOptions, {
        resources: "shared",
      })

      expect(Queue).toHaveBeenCalledTimes(1)
      expect(Queue).toHaveBeenCalledWith("events-queue", {
        connection: expect.any(Object),
        prefix: "RedisEventBusService",
      })

      expect(Worker).toHaveBeenCalledTimes(1)
      expect(Worker).toHaveBeenCalledWith(
        "events-queue",
        expect.any(Function),
        {
          connection: expect.any(Object),
          prefix: "RedisEventBusService",
        }
      )
    })

    it("Throws on isolated module declaration", () => {
      try {
        eventBus = new RedisEventBusService(moduleDeps, simpleModuleOptions, {
          resources: "isolated",
        })
      } catch (error) {
        expect(error.message).toEqual(
          "At the moment this module can only be used with shared resources"
        )
      }
    })
  })

  describe("emit", () => {
    describe("Successfully emits events", () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      it("Adds job to queue with default options", () => {
        eventBus = new RedisEventBusService(moduleDeps, simpleModuleOptions, {
          resources: "shared",
        })

        eventBus.queue_.addBulk.mockImplementationOnce(() => "hi")
        eventBus.emit("eventName", { hi: "1234" })

        expect(eventBus.queue_.addBulk).toHaveBeenCalledTimes(1)
        expect(eventBus.queue_.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { eventName: "eventName", data: { hi: "1234" } },
            opts: {
              attempts: 1,
              removeOnComplete: true,
            },
          },
        ])
      })

      it("Adds job to queue with custom options passed directly upon emitting", () => {
        eventBus = new RedisEventBusService(moduleDeps, simpleModuleOptions, {
          resources: "shared",
        })

        eventBus.queue_.addBulk.mockImplementationOnce(() => "hi")
        eventBus.emit(
          "eventName",
          { hi: "1234" },
          { attempts: 3, backoff: 5000, delay: 1000 }
        )

        expect(eventBus.queue_.addBulk).toHaveBeenCalledTimes(1)
        expect(eventBus.queue_.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { eventName: "eventName", data: { hi: "1234" } },
            opts: {
              attempts: 3,
              backoff: 5000,
              delay: 1000,
              removeOnComplete: true,
            },
          },
        ])
      })

      it("Adds job to queue with module job options", () => {
        eventBus = new RedisEventBusService(
          moduleDeps,
          {
            ...simpleModuleOptions,
            jobOptions: {
              removeOnComplete: {
                age: 5,
              },
              attempts: 7,
            },
          },
          {
            resources: "shared",
          }
        )

        eventBus.queue_.addBulk.mockImplementationOnce(() => "hi")
        eventBus.emit("eventName", { hi: "1234" })

        expect(eventBus.queue_.addBulk).toHaveBeenCalledTimes(1)
        expect(eventBus.queue_.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { eventName: "eventName", data: { hi: "1234" } },
            opts: {
              attempts: 7,
              removeOnComplete: {
                age: 5,
              },
            },
          },
        ])
      })

      it("Adds job to queue with default, local, and global options merged", () => {
        eventBus = new RedisEventBusService(
          moduleDeps,
          {
            ...simpleModuleOptions,
            jobOptions: {
              removeOnComplete: 5,
            },
          },
          {
            resources: "shared",
          }
        )

        eventBus.queue_.addBulk.mockImplementationOnce(() => "hi")
        eventBus.emit("eventName", { hi: "1234" }, { delay: 1000 })

        expect(eventBus.queue_.addBulk).toHaveBeenCalledTimes(1)
        expect(eventBus.queue_.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { eventName: "eventName", data: { hi: "1234" } },
            opts: {
              attempts: 1,
              removeOnComplete: 5,
              delay: 1000,
            },
          },
        ])
      })
    })
  })

  describe("worker_", () => {
    let result

    describe("Successfully processes the jobs", () => {
      beforeEach(async () => {
        jest.clearAllMocks()

        eventBus = new RedisEventBusService(moduleDeps, simpleModuleOptions, {
          resources: "shared",
        })
      })

      it("Processes a simple event with no options", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve("hi"))

        result = await eventBus.worker_({
          data: { eventName: "eventName", data: {} },
          opts: { attempts: 1 },
        })

        expect(loggerMock.info).toHaveBeenCalledTimes(1)
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Processing eventName which has 1 subscribers"
        )

        expect(result).toEqual(["hi"])
      })

      it("Processes event with failing subscribers", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve("hi"))
        eventBus.subscribe("eventName", () => Promise.reject("fail1"))
        eventBus.subscribe("eventName", () => Promise.resolve("hi2"))
        eventBus.subscribe("eventName", () => Promise.reject("fail2"))

        result = await eventBus.worker_({
          data: { eventName: "eventName", data: {} },
          update: (data) => data,
          opts: { attempts: 1 },
        })

        expect(loggerMock.info).toHaveBeenCalledTimes(1)
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Processing eventName which has 4 subscribers"
        )

        expect(loggerMock.warn).toHaveBeenCalledTimes(3)
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occurred while processing eventName: fail1"
        )
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occurred while processing eventName: fail2"
        )

        expect(loggerMock.warn).toHaveBeenCalledWith(
          "One or more subscribers of eventName failed. Retrying is not configured. Use 'attempts' option when emitting events."
        )

        expect(result).toEqual(["hi", "fail1", "hi2", "fail2"])
      })

      it("Retries processing when subcribers fail, if configured - final attempt", async () => {
        eventBus.subscribe("eventName", async () => Promise.resolve("hi"), {
          subscriberId: "1",
        })
        eventBus.subscribe("eventName", async () => Promise.reject("fail1"), {
          subscriberId: "2",
        })

        result = await eventBus
          .worker_({
            data: {
              eventName: "eventName",
              data: {},
              completedSubscriberIds: ["1"],
            },
            attemptsMade: 2,
            update: (data) => data,
            opts: { attempts: 2 },
          })
          .catch((error) => void 0)

        expect(loggerMock.warn).toHaveBeenCalledTimes(1)
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occurred while processing eventName: fail1"
        )

        expect(loggerMock.info).toHaveBeenCalledTimes(2)
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Final retry attempt for eventName"
        )
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Retrying eventName which has 2 subscribers (1 of them failed)"
        )
      })

      it("Retries processing when subcribers fail, if configured", async () => {
        eventBus.subscribe("eventName", async () => Promise.resolve("hi"), {
          subscriberId: "1",
        })
        eventBus.subscribe("eventName", async () => Promise.reject("fail1"), {
          subscriberId: "2",
        })

        result = await eventBus
          .worker_({
            data: {
              eventName: "eventName",
              data: {},
              completedSubscriberIds: ["1"],
            },
            attemptsMade: 2,
            update: (data) => data,
            opts: { attempts: 3 },
          })
          .catch((err) => void 0)

        expect(loggerMock.warn).toHaveBeenCalledTimes(2)
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occurred while processing eventName: fail1"
        )
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "One or more subscribers of eventName failed. Retrying..."
        )

        expect(loggerMock.info).toHaveBeenCalledTimes(1)
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Retrying eventName which has 2 subscribers (1 of them failed)"
        )
      })
    })
  })
})
