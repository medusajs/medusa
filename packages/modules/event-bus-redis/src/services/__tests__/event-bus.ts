import { Logger } from "@medusajs/framework/types"
import { Queue, Worker } from "bullmq"
import { Redis } from "ioredis"
import RedisEventBusService from "../event-bus-redis"

jest.mock("bullmq")
jest.mock("ioredis")

const loggerMock = {
  info: jest.fn().mockImplementation(console.log),
  warn: jest.fn().mockImplementation(console.warn),
  error: jest.fn().mockImplementation(console.error),
} as unknown as Logger

const redisMock = {
  del: () => jest.fn(),
  rpush: () => jest.fn(),
  lrange: () => jest.fn(),
  disconnect: () => jest.fn(),
  expire: () => jest.fn(),
  unlink: () => jest.fn(),
} as unknown as Redis

const moduleDeps = {
  logger: loggerMock,
  eventBusRedisConnection: redisMock,
  eventBusRedisQueueName: "events-queue",
  eventBusRedisQueueOptions: {},
  eventBusRedisWorkerOptions: {},
  eventBusRedisJobOptions: {},
}

const moduleDeclaration = { scope: "internal" } as any

describe("RedisEventBusService", () => {
  let eventBus: RedisEventBusService
  let queue
  let redis

  describe("constructor", () => {
    beforeEach(async () => {
      jest.clearAllMocks()

      eventBus = new RedisEventBusService(moduleDeps, {}, moduleDeclaration)
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
          autorun: false,
        }
      )
    })

    it("Throws on isolated module declaration", () => {
      try {
        eventBus = new RedisEventBusService(moduleDeps, {}, moduleDeclaration)
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

        eventBus = new RedisEventBusService(moduleDeps, {}, moduleDeclaration)

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()
        redis = (eventBus as any).eventBusRedisConnection_
        redis.rpush = jest.fn()
      })

      it("should add job to queue with default options", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit([
          {
            name: "eventName",
            data: {
              hi: "1234",
            },
          },
        ])

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 1,
              removeOnComplete: true,
              priority: 100,
            },
          },
        ])
      })

      it("should add job to queue with custom options passed directly upon emitting", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit([{ name: "eventName", data: { hi: "1234" } }], {
          attempts: 3,
          backoff: 5000,
          delay: 1000,
        })

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 3,
              backoff: 5000,
              delay: 1000,
              removeOnComplete: true,
              priority: 100,
            },
          },
        ])
      })

      it("should add job to queue with module job options", async () => {
        eventBus = new RedisEventBusService(
          {
            ...moduleDeps,
            eventBusRedisJobOptions: {
              removeOnComplete: { age: 5 },
              attempts: 7,
            },
          },
          {},
          moduleDeclaration
        )

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()

        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit(
          [
            {
              name: "eventName",
              data: { hi: "1234" },
            },
          ],
          { attempts: 3, backoff: 5000, delay: 1000 }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 3,
              backoff: 5000,
              delay: 1000,
              removeOnComplete: {
                age: 5,
              },
              priority: 100,
            },
          },
        ])
      })

      it("should add job to queue with default, local, and global options merged", async () => {
        eventBus = new RedisEventBusService(
          {
            ...moduleDeps,
            eventBusRedisJobOptions: {
              removeOnComplete: 5,
            },
          },
          {},
          moduleDeclaration
        )

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()

        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit(
          {
            name: "eventName",
            data: { hi: "1234" },
          },
          { delay: 1000 }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 1,
              removeOnComplete: 5,
              delay: 1000,
              priority: 100,
            },
          },
        ])
      })

      it("should successfully group events", async () => {
        const options = { delay: 1000 }
        const event = {
          name: "eventName",
          data: { hi: "1234" },
          metadata: { eventGroupId: "test-group-1" },
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
            name: "grouped-event-1",
            data: { hi: "1234" },
            metadata: { eventGroupId: "test-group-1" },
          },
          {
            name: "ungrouped-event-2",
            data: { hi: "1234" },
          },
          {
            name: "grouped-event-2",
            data: { hi: "1234" },
            metadata: { eventGroupId: "test-group-2" },
          },
          {
            name: "grouped-event-3",
            data: { hi: "1235" },
            metadata: { eventGroupId: "test-group-2" },
          },
        ]

        eventBus.subscribe("ungrouped-event-2", () => Promise.resolve())
        eventBus.subscribe("grouped-event-1", () => Promise.resolve())
        eventBus.subscribe("grouped-event-2", () => Promise.resolve())
        eventBus.subscribe("grouped-event-3", () => Promise.resolve())

        redis.unlink = jest.fn()

        await eventBus.emit(events, options)

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(redis.rpush).toHaveBeenCalledTimes(2)
        expect(redis.unlink).not.toHaveBeenCalled()

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

          return
        })

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()

        await eventBus.releaseGroupedEvents("test-group-1")

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([testGroup1Event])
        expect(redis.unlink).toHaveBeenCalledTimes(1)
        expect(redis.unlink).toHaveBeenCalledWith("staging:test-group-1")

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()
        redis.unlink = jest.fn()

        await eventBus.releaseGroupedEvents("test-group-2")

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          testGroup2Event,
          testGroup2Event2,
        ])
        expect(redis.unlink).toHaveBeenCalledTimes(1)
        expect(redis.unlink).toHaveBeenCalledWith("staging:test-group-2")
      })
    })

    describe("Priority levels", () => {
      beforeEach(async () => {
        jest.clearAllMocks()

        eventBus = new RedisEventBusService(moduleDeps, {}, moduleDeclaration)

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()
        redis = (eventBus as any).eventBusRedisConnection_
        redis.rpush = jest.fn()
      })

      it("should add job to queue with default priority (100) for normal events", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit([
          {
            name: "eventName",
            data: { hi: "1234" },
          },
        ])

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 1,
              removeOnComplete: true,
              priority: 100,
            },
          },
        ])
      })

      it("should add job to queue with lowest priority (2097152) for internal events", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit(
          [
            {
              name: "eventName",
              data: { hi: "1234" },
            },
          ],
          { internal: true }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 1,
              removeOnComplete: true,
              priority: 2097152,
              internal: true,
            },
          },
        ])
      })

      it("should add job to queue with custom priority override at emit time", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit(
          [
            {
              name: "eventName",
              data: { hi: "1234" },
            },
          ],
          { priority: 50 }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 1,
              removeOnComplete: true,
              priority: 50,
            },
          },
        ])
      })

      it("should add job to queue with custom priority via module job options", async () => {
        eventBus = new RedisEventBusService(
          {
            ...moduleDeps,
            eventBusRedisJobOptions: {
              priority: 200,
            },
          },
          {},
          moduleDeclaration
        )

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()

        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit([
          {
            name: "eventName",
            data: { hi: "1234" },
          },
        ])

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 1,
              removeOnComplete: true,
              priority: 200,
            },
          },
        ])
      })

      it("should override module priority with emit options priority", async () => {
        eventBus = new RedisEventBusService(
          {
            ...moduleDeps,
            eventBusRedisJobOptions: {
              priority: 200,
            },
          },
          {},
          moduleDeclaration
        )

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()

        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit(
          [
            {
              name: "eventName",
              data: { hi: "1234" },
            },
          ],
          { priority: 25 }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 1,
              removeOnComplete: true,
              priority: 25,
            },
          },
        ])
      })

      it("should allow module priority to override internal flag default", async () => {
        eventBus = new RedisEventBusService(
          {
            ...moduleDeps,
            eventBusRedisJobOptions: {
              priority: 200,
            },
          },
          {},
          moduleDeclaration
        )

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()

        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit(
          [
            {
              name: "eventName",
              data: { hi: "1234" },
            },
          ],
          { internal: true }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 1,
              removeOnComplete: true,
              priority: 200,
              internal: true,
            },
          },
        ])
      })

      it("should allow explicit priority to override internal flag default", async () => {
        eventBus.subscribe("eventName", () => Promise.resolve())

        await eventBus.emit(
          [
            {
              name: "eventName",
              data: { hi: "1234" },
            },
          ],
          { internal: true, priority: 50 }
        )

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).toHaveBeenCalledWith([
          {
            name: "eventName",
            data: { data: { hi: "1234" }, metadata: undefined },
            opts: {
              attempts: 1,
              removeOnComplete: true,
              priority: 50,
              internal: true,
            },
          },
        ])
      })

      describe("Message-level options", () => {
        it("should allow message-level priority to override emit-level priority", async () => {
          eventBus.subscribe("eventName", () => Promise.resolve())

          await eventBus.emit(
            [
              {
                name: "eventName",
                data: { hi: "1234" },
                options: { priority: 10 },
              },
            ],
            { priority: 100 }
          )

          expect(queue.addBulk).toHaveBeenCalledTimes(1)
          expect(queue.addBulk).toHaveBeenCalledWith([
            {
              name: "eventName",
              data: { data: { hi: "1234" }, metadata: undefined },
              opts: {
                attempts: 1,
                removeOnComplete: true,
                priority: 10,
              },
            },
          ])
        })

        it("should allow different priorities per message in same emit call", async () => {
          eventBus.subscribe("eventName1", () => Promise.resolve())
          eventBus.subscribe("eventName2", () => Promise.resolve())
          eventBus.subscribe("eventName3", () => Promise.resolve())

          await eventBus.emit(
            [
              {
                name: "eventName1",
                data: { id: "1" },
                options: { priority: 10 },
              },
              {
                name: "eventName2",
                data: { id: "2" },
                options: { priority: 50 },
              },
              {
                name: "eventName3",
                data: { id: "3" },
                // No options - should use emit-level priority
              },
            ],
            { priority: 200 }
          )

          expect(queue.addBulk).toHaveBeenCalledTimes(1)
          expect(queue.addBulk).toHaveBeenCalledWith([
            {
              name: "eventName1",
              data: { data: { id: "1" }, metadata: undefined },
              opts: {
                attempts: 1,
                removeOnComplete: true,
                priority: 10,
              },
            },
            {
              name: "eventName2",
              data: { data: { id: "2" }, metadata: undefined },
              opts: {
                attempts: 1,
                removeOnComplete: true,
                priority: 50,
              },
            },
            {
              name: "eventName3",
              data: { data: { id: "3" }, metadata: undefined },
              opts: {
                attempts: 1,
                removeOnComplete: true,
                priority: 200,
              },
            },
          ])
        })

        it("should allow message-level priority to override module-level priority", async () => {
          eventBus = new RedisEventBusService(
            {
              ...moduleDeps,
              eventBusRedisJobOptions: {
                priority: 300,
              },
            },
            {},
            moduleDeclaration
          )

          queue = (eventBus as any).queue_
          queue.addBulk = jest.fn()

          eventBus.subscribe("eventName", () => Promise.resolve())

          await eventBus.emit([
            {
              name: "eventName",
              data: { hi: "1234" },
              options: { priority: 5 },
            },
          ])

          expect(queue.addBulk).toHaveBeenCalledTimes(1)
          expect(queue.addBulk).toHaveBeenCalledWith([
            {
              name: "eventName",
              data: { data: { hi: "1234" }, metadata: undefined },
              opts: {
                attempts: 1,
                removeOnComplete: true,
                priority: 5,
              },
            },
          ])
        })

        it("should allow message-level priority to override internal flag", async () => {
          eventBus.subscribe("eventName", () => Promise.resolve())

          await eventBus.emit(
            [
              {
                name: "eventName",
                data: { hi: "1234" },
                options: { priority: 15 },
              },
            ],
            { internal: true }
          )

          expect(queue.addBulk).toHaveBeenCalledTimes(1)
          expect(queue.addBulk).toHaveBeenCalledWith([
            {
              name: "eventName",
              data: { data: { hi: "1234" }, metadata: undefined },
              opts: {
                attempts: 1,
                removeOnComplete: true,
                priority: 15,
                internal: true,
              },
            },
          ])
        })
      })

      describe("Grouped events priority", () => {
        it("should stage grouped events with default priority (100)", async () => {
          const event = {
            name: "grouped-event",
            data: { hi: "1234" },
            metadata: { eventGroupId: "test-group-priority" },
          }

          await eventBus.emit(event)

          expect(redis.rpush).toHaveBeenCalledTimes(1)
          const calledWith = redis.rpush.mock.calls[0]
          const stagedEvent = JSON.parse(calledWith[1])

          expect(stagedEvent.opts.priority).toBe(100)
        })

        it("should stage grouped events with lowest priority (2097152) for internal events", async () => {
          const event = {
            name: "grouped-event",
            data: { hi: "1234" },
            metadata: { eventGroupId: "test-group-priority" },
          }

          await eventBus.emit(event, { internal: true })

          expect(redis.rpush).toHaveBeenCalledTimes(1)
          const calledWith = redis.rpush.mock.calls[0]
          const stagedEvent = JSON.parse(calledWith[1])

          expect(stagedEvent.opts.priority).toBe(2097152)
          expect(stagedEvent.opts.internal).toBe(true)
        })

        it("should stage grouped events with custom priority", async () => {
          const event = {
            name: "grouped-event",
            data: { hi: "1234" },
            metadata: { eventGroupId: "test-group-priority" },
          }

          await eventBus.emit(event, { priority: 50 })

          expect(redis.rpush).toHaveBeenCalledTimes(1)
          const calledWith = redis.rpush.mock.calls[0]
          const stagedEvent = JSON.parse(calledWith[1])

          expect(stagedEvent.opts.priority).toBe(50)
        })

        it("should preserve priority when releasing grouped events", async () => {
          const event = {
            name: "grouped-event",
            data: { hi: "1234" },
            metadata: { eventGroupId: "test-group-priority" },
          }

          const [builtEvent] = (eventBus as any).buildEvents([event], {
            priority: 75,
          })

          eventBus.subscribe("grouped-event", () => Promise.resolve())

          redis.lrange = jest.fn((key) => {
            if (key === "staging:test-group-priority") {
              return Promise.resolve([JSON.stringify(builtEvent)])
            }
            return Promise.resolve([])
          })
          redis.unlink = jest.fn()

          await eventBus.releaseGroupedEvents("test-group-priority")

          expect(queue.addBulk).toHaveBeenCalledTimes(1)
          expect(queue.addBulk).toHaveBeenCalledWith([builtEvent])
          expect(builtEvent.opts.priority).toBe(75)
        })

        it("should stage grouped events with message-level priority overriding emit-level priority", async () => {
          const event = {
            name: "grouped-event",
            data: { hi: "1234" },
            metadata: { eventGroupId: "test-group-priority" },
            options: { priority: 20 },
          }

          await eventBus.emit(event, { priority: 100 })

          expect(redis.rpush).toHaveBeenCalledTimes(1)
          const calledWith = redis.rpush.mock.calls[0]
          const stagedEvent = JSON.parse(calledWith[1])

          expect(stagedEvent.opts.priority).toBe(20)
        })

        it("should allow different priorities per grouped message in same emit call", async () => {
          const events = [
            {
              name: "grouped-event-1",
              data: { id: "1" },
              metadata: { eventGroupId: "test-group-multi" },
              options: { priority: 10 },
            },
            {
              name: "grouped-event-2",
              data: { id: "2" },
              metadata: { eventGroupId: "test-group-multi" },
              options: { priority: 50 },
            },
            {
              name: "grouped-event-3",
              data: { id: "3" },
              metadata: { eventGroupId: "test-group-multi" },
              // No options - should use emit-level priority
            },
          ]

          await eventBus.emit(events, { priority: 200 })

          expect(redis.rpush).toHaveBeenCalledTimes(1)
          const calledWith = redis.rpush.mock.calls[0]

          // First argument is the key, rest are the events
          const stagedEvent1 = JSON.parse(calledWith[1])
          const stagedEvent2 = JSON.parse(calledWith[2])
          const stagedEvent3 = JSON.parse(calledWith[3])

          expect(stagedEvent1.opts.priority).toBe(10)
          expect(stagedEvent2.opts.priority).toBe(50)
          expect(stagedEvent3.opts.priority).toBe(200)
        })
      })
    })

    describe("Events without subscribers", () => {
      beforeEach(async () => {
        jest.clearAllMocks()

        eventBus = new RedisEventBusService(moduleDeps, {}, moduleDeclaration)

        queue = (eventBus as any).queue_
        queue.addBulk = jest.fn()
        redis = (eventBus as any).eventBusRedisConnection_
        redis.rpush = jest.fn()
      })

      it("should not add events to queue when there are no subscribers", async () => {
        await eventBus.emit([
          {
            name: "eventWithoutSubscribers",
            data: { test: "data" },
          },
        ])

        expect(queue.addBulk).not.toHaveBeenCalled()
      })

      it("should still call interceptors even when there are no subscribers", async () => {
        const callInterceptorsSpy = jest.spyOn(
          eventBus as any,
          "callInterceptors"
        )

        await eventBus.emit([
          {
            name: "eventWithoutSubscribers",
            data: { test: "data" },
          },
        ])

        expect(callInterceptorsSpy).toHaveBeenCalledTimes(1)
        expect(callInterceptorsSpy).toHaveBeenCalledWith(
          {
            name: "eventWithoutSubscribers",
            data: { test: "data" },
          },
          { isGrouped: false }
        )

        expect(queue.addBulk).not.toHaveBeenCalled()

        callInterceptorsSpy.mockRestore()
      })

      it("should add events to queue only for events with subscribers using wildcard", async () => {
        eventBus.subscribe("*", () => Promise.resolve())

        await eventBus.emit([
          {
            name: "anyEvent",
            data: { test: "data" },
          },
        ])

        expect(queue.addBulk).toHaveBeenCalledTimes(1)
      })

      it("should not add grouped events to queue when releasing if there are no subscribers", async () => {
        const options = { delay: 1000 }
        const event = {
          name: "grouped-event-no-sub",
          data: { hi: "1234" },
          metadata: { eventGroupId: "test-group-no-sub" },
        }

        await eventBus.emit(event, options)

        expect(redis.rpush).toHaveBeenCalledTimes(1)
        expect(queue.addBulk).not.toHaveBeenCalled()

        const [builtEvent] = (eventBus as any).buildEvents([event], options)

        redis.lrange = jest.fn((key) => {
          if (key === "staging:test-group-no-sub") {
            return Promise.resolve([JSON.stringify(builtEvent)])
          }
          return Promise.resolve([])
        })

        redis.unlink = jest.fn()
        queue.addBulk = jest.fn()

        await eventBus.releaseGroupedEvents("test-group-no-sub")

        expect(queue.addBulk).not.toHaveBeenCalled()

        expect(redis.unlink).toHaveBeenCalledWith("staging:test-group-no-sub")
      })

      it("should still call interceptors for grouped events without subscribers", async () => {
        const options = { delay: 1000 }
        const event = {
          name: "grouped-event-no-sub-2",
          data: { hi: "1234" },
          metadata: { eventGroupId: "test-group-no-sub-2" },
        }

        await eventBus.emit(event, options)

        const [builtEvent] = (eventBus as any).buildEvents([event], options)

        redis.lrange = jest.fn((key) => {
          if (key === "staging:test-group-no-sub-2") {
            return Promise.resolve([JSON.stringify(builtEvent)])
          }
          return Promise.resolve([])
        })

        redis.unlink = jest.fn()
        queue.addBulk = jest.fn()

        const callInterceptorsSpy = jest.spyOn(
          eventBus as any,
          "callInterceptors"
        )

        await eventBus.releaseGroupedEvents("test-group-no-sub-2")

        expect(callInterceptorsSpy).toHaveBeenCalledTimes(1)
        expect(callInterceptorsSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "grouped-event-no-sub-2",
          }),
          {
            isGrouped: true,
            eventGroupId: "test-group-no-sub-2",
          }
        )

        expect(queue.addBulk).not.toHaveBeenCalled()

        callInterceptorsSpy.mockRestore()
      })
    })
  })

  describe("worker_", () => {
    describe("Successfully processes the jobs", () => {
      beforeEach(async () => {
        jest.clearAllMocks()

        eventBus = new RedisEventBusService(moduleDeps, {}, moduleDeclaration)
      })

      it("should process a simple event with no options", async () => {
        const test: string[] = []

        eventBus.subscribe("eventName", () => {
          test.push("success")

          return Promise.resolve()
        })

        await eventBus.worker_({
          name: "eventName",
          data: { data: { test: 1 } },
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
          throw new Error("fail1")
        })
        eventBus.subscribe("eventName", () => {
          test.push("hi2")
          return Promise.resolve()
        })
        eventBus.subscribe("eventName", () => {
          test.push("fail2")
          return Promise.reject("fail2")
        })

        await eventBus.worker_({
          name: "eventName",
          data: { data: { test: 1 } },
          opts: { attempts: 1 },
          update: (data) => data,
        } as any)

        expect(loggerMock.info).toHaveBeenCalledTimes(1)
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Processing eventName which has 4 subscribers"
        )

        expect(loggerMock.warn).toHaveBeenCalledTimes(5)
        expect(loggerMock.warn).toHaveBeenNthCalledWith(
          1,
          "An error occurred while processing eventName:"
        )
        expect(loggerMock.warn).toHaveBeenNthCalledWith(2, new Error("fail1"))

        expect(loggerMock.warn).toHaveBeenNthCalledWith(
          3,
          "An error occurred while processing eventName:"
        )
        expect(loggerMock.warn).toHaveBeenNthCalledWith(4, "fail2")

        expect(loggerMock.warn).toHaveBeenNthCalledWith(
          5,
          "One or more subscribers of eventName failed. Retrying is not configured. Use 'attempts' option when emitting events."
        )

        expect(test.sort()).toEqual(["hi", "fail1", "hi2", "fail2"].sort())
      })

      it("should retry processing when subcribers fail, if configured - final attempt", async () => {
        eventBus.subscribe("eventName", async () => await Promise.resolve(), {
          subscriberId: "1",
        })
        eventBus.subscribe(
          "eventName",
          async () => await Promise.reject("fail1"),
          {
            subscriberId: "2",
          }
        )

        await eventBus
          .worker_({
            name: "eventName",
            data: {
              data: {},
              completedSubscriberIds: ["1"],
            },
            attemptsMade: 2,
            update: (data) => data,
            opts: { attempts: 2 },
          } as any)
          .catch((error) => void 0)

        expect(loggerMock.warn).toHaveBeenCalledTimes(2)
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occurred while processing eventName:"
        )
        expect(loggerMock.warn).toHaveBeenCalledWith("fail1")

        expect(loggerMock.info).toHaveBeenCalledTimes(2)
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Final retry attempt for eventName"
        )
        expect(loggerMock.info).toHaveBeenCalledWith(
          "Retrying eventName which has 2 subscribers (1 of them failed)"
        )
      })

      it("should retry processing when subcribers fail, if configured", async () => {
        eventBus.subscribe("eventName", async () => await Promise.resolve(), {
          subscriberId: "1",
        })
        eventBus.subscribe(
          "eventName",
          async () => await Promise.reject("fail1"),
          {
            subscriberId: "2",
          }
        )

        await eventBus
          .worker_({
            name: "eventName",
            data: {
              data: {},
              completedSubscriberIds: ["1"],
            },
            attemptsMade: 2,
            updateData: (data) => data,
            opts: { attempts: 3 },
          } as any)
          .catch((err) => void 0)

        expect(loggerMock.warn).toHaveBeenCalledTimes(3)
        expect(loggerMock.warn).toHaveBeenCalledWith(
          "An error occurred while processing eventName:"
        )
        expect(loggerMock.warn).toHaveBeenCalledWith("fail1")

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
