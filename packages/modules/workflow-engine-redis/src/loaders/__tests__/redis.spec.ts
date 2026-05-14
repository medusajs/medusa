import { Logger } from "@medusajs/framework/types"
import redisLoader from "../redis"

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    connect: jest.fn((callback) => {
      if (callback) callback()
      return Promise.resolve()
    }),
    disconnect: jest.fn(),
  }))
})

const loggerMock = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as Logger

describe("Redis Loader", () => {
  let containerMock: { register: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()
    containerMock = {
      register: jest.fn(),
    }
  })

  describe("Option merging", () => {
    it("should use shared queueOptions as default for all queues", async () => {
      const sharedQueueOptions = {
        defaultJobOptions: { removeOnComplete: 1000 },
      }

      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              redisUrl: "redis://localhost:6379",
              queueOptions: sharedQueueOptions,
            },
          },
        } as any,
        {} as any
      )

      const registerCall = containerMock.register.mock.calls[0][0]

      expect(registerCall.redisMainQueueOptions.resolve()).toEqual(
        sharedQueueOptions
      )
      expect(registerCall.redisJobQueueOptions.resolve()).toEqual(
        sharedQueueOptions
      )
      expect(registerCall.redisCleanerQueueOptions.resolve()).toEqual(
        sharedQueueOptions
      )
    })

    it("should use shared workerOptions as default for all workers", async () => {
      const sharedWorkerOptions = { concurrency: 10 }

      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              redisUrl: "redis://localhost:6379",
              workerOptions: sharedWorkerOptions,
            },
          },
        } as any,
        {} as any
      )

      const registerCall = containerMock.register.mock.calls[0][0]

      expect(registerCall.redisMainWorkerOptions.resolve()).toEqual(
        sharedWorkerOptions
      )
      expect(registerCall.redisJobWorkerOptions.resolve()).toEqual(
        sharedWorkerOptions
      )
      expect(registerCall.redisCleanerWorkerOptions.resolve()).toEqual(
        sharedWorkerOptions
      )
    })

    it("should override shared options with per-queue options", async () => {
      const sharedQueueOptions = {
        defaultJobOptions: { removeOnComplete: 1000 },
      }
      const mainQueueOptions = {
        defaultJobOptions: { removeOnComplete: 500, attempts: 3 },
      }

      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              redisUrl: "redis://localhost:6379",
              queueOptions: sharedQueueOptions,
              mainQueueOptions: mainQueueOptions,
            },
          },
        } as any,
        {} as any
      )

      const registerCall = containerMock.register.mock.calls[0][0]

      expect(registerCall.redisMainQueueOptions.resolve()).toEqual({
        defaultJobOptions: { removeOnComplete: 500, attempts: 3 },
      })

      expect(registerCall.redisJobQueueOptions.resolve()).toEqual(
        sharedQueueOptions
      )
      expect(registerCall.redisCleanerQueueOptions.resolve()).toEqual(
        sharedQueueOptions
      )
    })

    it("should override shared worker options with per-worker options", async () => {
      const sharedWorkerOptions = { concurrency: 10 }
      const jobWorkerOptions = { concurrency: 5 }
      const cleanerWorkerOptions = { concurrency: 1 }

      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              redisUrl: "redis://localhost:6379",
              workerOptions: sharedWorkerOptions,
              jobWorkerOptions: jobWorkerOptions,
              cleanerWorkerOptions: cleanerWorkerOptions,
            },
          },
        } as any,
        {} as any
      )

      const registerCall = containerMock.register.mock.calls[0][0]

      expect(registerCall.redisMainWorkerOptions.resolve()).toEqual(
        sharedWorkerOptions
      )

      expect(registerCall.redisJobWorkerOptions.resolve()).toEqual(
        jobWorkerOptions
      )

      expect(registerCall.redisCleanerWorkerOptions.resolve()).toEqual(
        cleanerWorkerOptions
      )
    })

    it("should merge nested options correctly", async () => {
      const sharedWorkerOptions = {
        concurrency: 10,
        limiter: { max: 100, duration: 1000 },
      }
      const mainWorkerOptions = {
        concurrency: 20,
      }

      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              redisUrl: "redis://localhost:6379",
              workerOptions: sharedWorkerOptions,
              mainWorkerOptions: mainWorkerOptions,
            },
          },
        } as any,
        {} as any
      )

      const registerCall = containerMock.register.mock.calls[0][0]

      expect(registerCall.redisMainWorkerOptions.resolve()).toEqual({
        concurrency: 20,
        limiter: { max: 100, duration: 1000 },
      })
    })
  })

  describe("Deprecation warnings", () => {
    it("should log warning when using deprecated 'url' option", async () => {
      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              url: "redis://localhost:6379",
            },
          },
        } as any,
        {} as any
      )

      expect(loggerMock.warn).toHaveBeenCalledWith(
        "[Workflow-engine-redis] The `url` option is deprecated. Please use `redisUrl` instead for consistency with other modules."
      )
    })

    it("should log warning when using deprecated 'options' option", async () => {
      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              redisUrl: "redis://localhost:6379",
              options: { maxRetriesPerRequest: 3 },
            },
          },
        } as any,
        {} as any
      )

      expect(loggerMock.warn).toHaveBeenCalledWith(
        "[Workflow-engine-redis] The `options` option is deprecated. Please use `redisOptions` instead for consistency with other modules."
      )
    })

    it("should not log warning when using new option names", async () => {
      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              redisUrl: "redis://localhost:6379",
              redisOptions: { maxRetriesPerRequest: 3 },
            },
          },
        } as any,
        {} as any
      )

      expect(loggerMock.warn).not.toHaveBeenCalled()
    })
  })

  describe("Queue names", () => {
    it("should use default queue names when not provided", async () => {
      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              redisUrl: "redis://localhost:6379",
            },
          },
        } as any,
        {} as any
      )

      const registerCall = containerMock.register.mock.calls[0][0]

      expect(registerCall.redisQueueName.resolve()).toEqual("medusa-workflows")
      expect(registerCall.redisJobQueueName.resolve()).toEqual(
        "medusa-workflows-jobs"
      )
    })

    it("should use custom queue names when provided", async () => {
      await redisLoader(
        {
          container: containerMock as any,
          logger: loggerMock,
          options: {
            redis: {
              redisUrl: "redis://localhost:6379",
              queueName: "custom-workflows",
              jobQueueName: "custom-jobs",
            },
          },
        } as any,
        {} as any
      )

      const registerCall = containerMock.register.mock.calls[0][0]

      expect(registerCall.redisQueueName.resolve()).toEqual("custom-workflows")
      expect(registerCall.redisJobQueueName.resolve()).toEqual("custom-jobs")
    })
  })

  describe("Error handling", () => {
    it("should throw error when redisUrl is not provided", async () => {
      await expect(
        redisLoader(
          {
            container: containerMock as any,
            logger: loggerMock,
            options: {
              redis: {},
            },
          } as any,
          {} as any
        )
      ).rejects.toThrow(
        "No `redis.redisUrl` (or deprecated `redis.url`) provided"
      )
    })
  })
})
