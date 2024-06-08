import { Logger } from "@medusajs/types"
import { Queue, Worker } from "bullmq"
import { Redis } from "ioredis"
import RedisEventBusService from "../event-bus-redis"

// const redisURL = "redis://localhost:6379"
// const client = new Redis(6379, redisURL, {
//   // Lazy connect to properly handle connection errors
//   lazyConnect: true,
//   maxRetriesPerRequest: 0,
// })

jest.genMockFromModule("bullmq")
jest.genMockFromModule("ioredis")
jest.mock("bullmq")
jest.mock("ioredis")

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
} as unknown as Logger

const redisMock = {
  del: () => jest.fn(),
  rpush: () => jest.fn(),
  lrange: () => jest.fn(),
  disconnect: () => jest.fn(),
} as unknown as Redis

const simpleModuleOptions = { redisUrl: "test-url" }
const moduleDeps = {
  logger: loggerMock,
  eventBusRedisConnection: redisMock,
}

describe("RedisEventBusService", () => {
  let eventBus: RedisEventBusService
  let queue
  let redis

  describe("constructor", () => {
    beforeEach(async () => {
      jest.clearAllMocks()

      eventBus = new RedisEventBusService(moduleDeps, simpleModuleOptions, {
        scope: "internal",
        resources: "shared",
      })
    })

    it("Creates a queue + worker", () => {
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
          scope: "internal",
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
      beforeEach(async () => {
        jest.clearAllMocks()

        eventBus = new RedisEventBusService(moduleDeps, simpleModuleOptions, {
          scope: "internal",
          resources: "shared",
        })

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()
        redis = (eventBus as any).eventBusRedisConnection_
        redis.rpush = jest.fn()
      })

      it("should add job to queue with default options", async () => {
        await eventBus.emit([
          {
            eventName: "eventName",
            body: {
              data: {
                hi: "1234",
              },
            },
          },
        ])

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
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

      it("should add job to queue with custom options passed directly upon emitting", async () => {
        await eventBus.emit(
          [
            {
              eventName: "eventName",
              body: {
                data: {
                  hi: "1234",
                },
              },
            },
          ],
          { attempts: 3, backoff: 5000, delay: 1000 }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
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

      it("should add job to queue with module job options", async () => {
        eventBus = new RedisEventBusService(
          moduleDeps,
          {
            ...simpleModuleOptions,
            jobOptions: {
              removeOnComplete: { age: 5 },
              attempts: 7,
            },
          },
          {
            resources: "shared",
            scope: "internal",
          }
        )

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()

        await eventBus.emit(
          [
            {
              eventName: "eventName",
              body: { data: { hi: "1234" } },
            },
          ],
          { attempts: 3, backoff: 5000, delay: 1000 }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { eventName: "eventName", data: { hi: "1234" } },
            opts: {
              attempts: 3,
              backoff: 5000,
              delay: 1000,
              removeOnComplete: {
                age: 5,
              },
            },
          },
        ])
      })

      it("should add job to queue with default, local, and global options merged", async () => {
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
            scope: "internal",
          }
        )

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()

        await eventBus.emit(
          {
            eventName: "eventName",
            body: { data: { hi: "1234" } },
          },
          { delay: 1000 }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
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

      it("should successfully group events", async () => {
        const options = { delay: 1000 }
        const event = {
          eventName: "eventName",
          body: {
            data: { hi: "1234" },
            metadata: { eventGroupId: "test-group-1" },
          },
        }

        const [builtEvent] = (eventBus as any).buildEvents([event], options)

        await eventBus.emit(event, options)

        expect(queue.addBulk).toHaveBeenCalledTimes(0)
        expect(redis.rpush).toHaveBeenCalledTimes(1)
        expect(redis.rpush).toHaveBeenCalledWith(
          "staging:test-group-1",
          JSON.stringify(builtEvent)
        )
      })

      it("should successfully group, release and clear events", async () => {
        const options = { delay: 1000 }
        const events = [
          {
            eventName: "grouped-event-1",
            body: {
              data: { hi: "1234" },
              metadata: { eventGroupId: "test-group-1" },
            },
          },
          {
            eventName: "ungrouped-event-2",
            body: {
              data: { hi: "1234" },
            },
          },
          {
            eventName: "grouped-event-2",
            body: {
              data: { hi: "1234" },
              metadata: { eventGroupId: "test-group-2" },
            },
          },
          {
            eventName: "grouped-event-3",
            body: {
              data: { hi: "1235" },
              metadata: { eventGroupId: "test-group-2" },
            },
          },
        ]

        redis.del = jest.fn()

        await eventBus.emit(events, options)

        // Expect 1 event to have been send
        // Expect 2 pushes to redis as there are 2 groups of events to push
        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(redis.rpush).toHaveBeenCalledTimes(2)
        expect(redis.del).not.toHaveBeenCalled()

        const [testGroup1Event] = (eventBus as any).buildEvents(
          [events[0]],
          options
        )
        const [testGroup2Event] = (eventBus as any).buildEvents(
          [events[2]],
          options
        )
        const [testGroup2Event2] = (eventBus as any).buildEvents(
          [events[3]],
          options
        )

        redis.lrange = jest.fn((key) => {
          if (key === "staging:test-group-1") {
            return Promise.resolve([JSON.stringify(testGroup1Event)])
          }

          if (key === "staging:test-group-2") {
            return Promise.resolve([
              JSON.stringify(testGroup2Event),
              JSON.stringify(testGroup2Event2),
            ])
          }
        })

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()

        await eventBus.releaseGroupedEvents("test-group-1")

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([testGroup1Event])
        expect(redis.del).toHaveBeenCalledTimes(1)
        expect(redis.del).toHaveBeenCalledWith("staging:test-group-1")

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()
        redis.del = jest.fn()

        await eventBus.releaseGroupedEvents("test-group-2")

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          testGroup2Event,
          testGroup2Event2,
        ])
        expect(redis.del).toHaveBeenCalledTimes(1)
        expect(redis.del).toHaveBeenCalledWith("staging:test-group-2")
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
          scope: "internal",
        })
      })

      it("should process a simple event with no options", async () => {
        const test: string[] = []

        eventBus.subscribe("eventName", () => {
          test.push("success")

          return Promise.resolve()
        })

        // TODO: The typing for this is all over the place
        await eventBus.worker_({
          data: { eventName: "eventName", data: { test: 1 } },
          opts: { attempts: 1 },
        } as any)

        expect(loggerMock.info).toHaveBeenCalledTimes(1)
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Processing eventName which has 1 subscribers"
        )

        expect(test).toEqual(["success"])
      })

      it("should process event with failing subscribers", async () => {
        const test: string[] = []

        eventBus.subscribe("eventName", () => {
          test.push("hi")
          return Promise.resolve()
        })
        eventBus.subscribe("eventName", () => {
          test.push("fail1")
          return Promise.reject("fail1")
        })
        eventBus.subscribe("eventName", () => {
          test.push("hi2")
          return Promise.resolve()
        })
        eventBus.subscribe("eventName", () => {
          test.push("fail2")
          return Promise.reject("fail2")
        })

        result = await eventBus.worker_({
          data: { eventName: "eventName", data: { test: 1 } },
          opts: { attempts: 1 },
          update: (data) => data,
        } as any)

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

        expect(test.sort()).toEqual(["hi", "fail1", "hi2", "fail2"].sort())
      })

      it("should retry processing when subcribers fail, if configured - final attempt", async () => {
        eventBus.subscribe("eventName", async () => Promise.resolve(), {
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
          } as any)
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

      it("should retry processing when subcribers fail, if configured", async () => {
        eventBus.subscribe("eventName", async () => Promise.resolve(), {
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
            updateData: (data) => data,
            opts: { attempts: 3 },
          } as any)
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
