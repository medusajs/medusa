import { asClass, asValue, createContainer } from "awilix"
import config from "../../loaders/config"
import EventBusService from "../event-bus"
import { defaultEventBusContainerMock } from "../__fixtures__/event-bus"

jest.genMockFromModule("bull")
jest.mock("bull")
jest.mock("../../loaders/config")

// @ts-ignore
config.redisURI = "testhost"

describe("EventBusService", () => {
  describe("subscribe", () => {
    const container = createContainer({}, defaultEventBusContainerMock)
    container.register("eventBusService", asClass(EventBusService))
    const eventBus = container.resolve("eventBusService")

    describe("fails when adding non-function subscriber", () => {
      it("rejects subscriber with error", () => {
        try {
          eventBus.subscribe("eventName", 1234 as any)
        } catch (err) {
          expect(err.message).toEqual("Subscriber must be a function")
        }
      })
    })
  })

  describe("emit", () => {
    const container = createContainer({}, defaultEventBusContainerMock)
    container.register("eventBusService", asClass(EventBusService))
    const eventBus = container.resolve("eventBusService")
    const cacheService = container.resolve("cacheService")

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("successfully adds job to queue", async () => {
      eventBus.queue_.add.mockImplementationOnce(() => "hi")

      await eventBus.emit("eventName", { hi: "1234" })

      expect(eventBus.queue_.add).toHaveBeenCalled()
    })

    it("successfully adds job to cache if cache key is provided", async () => {
      await eventBus.emit(
        "eventName",
        { hi: "1234" },
        { events_cache_key: "test" }
      )

      expect(cacheService.get).toHaveBeenCalledTimes(1)
      expect(cacheService.set).toHaveBeenCalledTimes(1)

      expect(eventBus.queue_.add).toHaveBeenCalledTimes(0)
    })
  })

  describe("processCachedEvents", () => {
    const TEST_CACHE_KEY = "test"

    const container = createContainer({}, defaultEventBusContainerMock)
    container.register("eventBusService", asClass(EventBusService))
    const eventBus = container.resolve("eventBusService")
    container.register(
      "cacheService",
      asValue({
        get: jest.fn().mockImplementation(async (cacheKey) => {
          if (cacheKey === TEST_CACHE_KEY) {
            return Promise.resolve([
              { eventName: "event1", data: { hi: "1234" } },
              { eventName: "event2", data: { hi: "5678" } },
            ])
          }

          return Promise.resolve([])
        }),
      })
    )

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("processes two jobs from cache and does not add to queue", async () => {
      await eventBus.processCachedEvents(TEST_CACHE_KEY)

      expect(eventBus.queue_.add).toHaveBeenCalledTimes(2)
    })
  })

  describe("worker", () => {
    const container = createContainer({}, defaultEventBusContainerMock)
    container.register("eventBusService", asClass(EventBusService))
    const eventBus = container.resolve("eventBusService")
    let result
    let logger = container.resolve("logger")

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("successfully runs the worker", async () => {
      eventBus.subscribe("eventName", () => Promise.resolve("hi"))

      result = await eventBus.worker_({
        data: { eventName: "eventName", data: {} },
      })

      expect(logger.info).toHaveBeenCalled()
      expect(logger.info).toHaveBeenCalledWith(
        "Processing eventName which has 1 subscribers"
      )

      expect(result).toEqual(["hi"])
    })

    it("continue if errors occur", async () => {
      const container = createContainer({}, defaultEventBusContainerMock)
      container.register("eventBusService", asClass(EventBusService))
      const eventBus = container.resolve("eventBusService")
      const logger = container.resolve("logger")

      eventBus.subscribe("eventName", () => Promise.resolve("hi"))
      eventBus.subscribe("eventName", () => Promise.resolve("hi2"))
      eventBus.subscribe("eventName", () => Promise.resolve("hi3"))
      eventBus.subscribe("eventName", () => Promise.reject("fail1"))
      eventBus.subscribe("eventName", () => Promise.reject("fail2"))
      eventBus.subscribe("eventName", () => Promise.reject("fail3"))

      result = await eventBus.worker_({
        data: { eventName: "eventName", data: {} },
      })

      expect(logger.warn).toHaveBeenCalledTimes(3)
      expect(logger.warn).toHaveBeenCalledWith(
        "An error occurred while processing eventName: fail1"
      )
      expect(logger.warn).toHaveBeenCalledWith(
        "An error occurred while processing eventName: fail2"
      )
      expect(logger.warn).toHaveBeenCalledWith(
        "An error occurred while processing eventName: fail3"
      )

      expect(result.length).toEqual(6)
    })
  })
})
