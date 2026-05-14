import { Logger, ModulesSdkTypes } from "@medusajs/framework/types"
import { Queue, Worker } from "bullmq"
import Redis from "ioredis"
import { RedisDistributedTransactionStorage } from "../workflow-orchestrator-storage"

jest.mock("bullmq")
jest.mock("ioredis")

const loggerMock = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as Logger

const redisMock = {
  status: "ready",
  disconnect: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  pipeline: jest.fn(() => ({
    exec: jest.fn(),
  })),
} as unknown as Redis

const workflowExecutionServiceMock = {
  list: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
} as unknown as ModulesSdkTypes.IMedusaInternalService<any>

const baseModuleDeps = {
  workflowExecutionService: workflowExecutionServiceMock,
  redisConnection: redisMock,
  redisWorkerConnection: redisMock,
  redisQueueName: "medusa-workflows",
  redisJobQueueName: "medusa-workflows-jobs",
  logger: loggerMock,
  isWorkerMode: true,
}

describe("RedisDistributedTransactionStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("constructor - Queue configuration", () => {
    it("should create queues with default empty options when no options provided", () => {
      new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        redisMainQueueOptions: {},
        redisMainWorkerOptions: {},
        redisJobQueueOptions: {},
        redisJobWorkerOptions: {},
        redisCleanerQueueOptions: {},
        redisCleanerWorkerOptions: {},
      })

      expect(Queue).toHaveBeenCalledWith("medusa-workflows", {
        connection: redisMock,
      })

      expect(Queue).toHaveBeenCalledWith("medusa-workflows-jobs", {
        connection: redisMock,
      })

      expect(Queue).toHaveBeenCalledWith("workflows-cleaner", {
        connection: redisMock,
      })

      expect(Queue).toHaveBeenCalledTimes(3)
    })

    it("should create main queue with custom options", () => {
      const mainQueueOptions = {
        defaultJobOptions: {
          removeOnComplete: 1000,
          removeOnFail: 5000,
        },
      }

      new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        redisMainQueueOptions: mainQueueOptions,
        redisMainWorkerOptions: {},
        redisJobQueueOptions: {},
        redisJobWorkerOptions: {},
        redisCleanerQueueOptions: {},
        redisCleanerWorkerOptions: {},
      })

      expect(Queue).toHaveBeenCalledWith("medusa-workflows", {
        ...mainQueueOptions,
        connection: redisMock,
      })
    })

    it("should create job queue with custom options", () => {
      const jobQueueOptions = {
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: "exponential", delay: 1000 },
        },
      }

      new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        redisMainQueueOptions: {},
        redisMainWorkerOptions: {},
        redisJobQueueOptions: jobQueueOptions,
        redisJobWorkerOptions: {},
        redisCleanerQueueOptions: {},
        redisCleanerWorkerOptions: {},
      })

      expect(Queue).toHaveBeenCalledWith("medusa-workflows-jobs", {
        ...jobQueueOptions,
        connection: redisMock,
      })
    })

    it("should create cleaner queue with custom options", () => {
      const cleanerQueueOptions = {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      }

      new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        redisMainQueueOptions: {},
        redisMainWorkerOptions: {},
        redisJobQueueOptions: {},
        redisJobWorkerOptions: {},
        redisCleanerQueueOptions: cleanerQueueOptions,
        redisCleanerWorkerOptions: {},
      })

      expect(Queue).toHaveBeenCalledWith("workflows-cleaner", {
        ...cleanerQueueOptions,
        connection: redisMock,
      })
    })

    it("should create each queue with different options", () => {
      const mainQueueOptions = { defaultJobOptions: { removeOnComplete: 100 } }
      const jobQueueOptions = { defaultJobOptions: { removeOnComplete: 200 } }
      const cleanerQueueOptions = {
        defaultJobOptions: { removeOnComplete: 300 },
      }

      new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        redisMainQueueOptions: mainQueueOptions,
        redisMainWorkerOptions: {},
        redisJobQueueOptions: jobQueueOptions,
        redisJobWorkerOptions: {},
        redisCleanerQueueOptions: cleanerQueueOptions,
        redisCleanerWorkerOptions: {},
      })

      expect(Queue).toHaveBeenNthCalledWith(1, "medusa-workflows", {
        ...mainQueueOptions,
        connection: redisMock,
      })

      expect(Queue).toHaveBeenNthCalledWith(2, "medusa-workflows-jobs", {
        ...jobQueueOptions,
        connection: redisMock,
      })

      expect(Queue).toHaveBeenNthCalledWith(3, "workflows-cleaner", {
        ...cleanerQueueOptions,
        connection: redisMock,
      })
    })

    it("should not create job and cleaner queues when not in worker mode", () => {
      new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        isWorkerMode: false,
        redisMainQueueOptions: {},
        redisMainWorkerOptions: {},
        redisJobQueueOptions: {},
        redisJobWorkerOptions: {},
        redisCleanerQueueOptions: {},
        redisCleanerWorkerOptions: {},
      })

      expect(Queue).toHaveBeenCalledTimes(1)
      expect(Queue).toHaveBeenCalledWith("medusa-workflows", {
        connection: redisMock,
      })
    })
  })

  describe("onApplicationStart - Worker configuration", () => {
    it("should create workers with custom options", async () => {
      const mainWorkerOptions = {
        concurrency: 10,
        limiter: { max: 100, duration: 1000 },
      }
      const jobWorkerOptions = { concurrency: 5 }
      const cleanerWorkerOptions = { concurrency: 1 }

      const storage = new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        redisMainQueueOptions: {},
        redisMainWorkerOptions: mainWorkerOptions,
        redisJobQueueOptions: {},
        redisJobWorkerOptions: jobWorkerOptions,
        redisCleanerQueueOptions: {},
        redisCleanerWorkerOptions: cleanerWorkerOptions,
      })

      const mockQueue = {
        getRepeatableJobs: jest.fn().mockResolvedValue([]),
        add: jest.fn().mockResolvedValue({}),
      }
      ;(storage as any).queue = mockQueue
      ;(storage as any).cleanerQueue_ = mockQueue

      await storage.onApplicationStart()

      expect(Worker).toHaveBeenCalledWith(
        "medusa-workflows",
        expect.any(Function),
        {
          ...mainWorkerOptions,
          connection: redisMock,
        }
      )

      expect(Worker).toHaveBeenCalledWith(
        "medusa-workflows-jobs",
        expect.any(Function),
        {
          ...jobWorkerOptions,
          connection: redisMock,
        }
      )

      expect(Worker).toHaveBeenCalledWith(
        "workflows-cleaner",
        expect.any(Function),
        {
          ...cleanerWorkerOptions,
          connection: redisMock,
        }
      )

      expect(Worker).toHaveBeenCalledTimes(3)
    })

    it("should create each worker with different concurrency settings", async () => {
      const storage = new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        redisMainQueueOptions: {},
        redisMainWorkerOptions: { concurrency: 20 },
        redisJobQueueOptions: {},
        redisJobWorkerOptions: { concurrency: 10 },
        redisCleanerQueueOptions: {},
        redisCleanerWorkerOptions: { concurrency: 1 },
      })

      const mockQueue = {
        getRepeatableJobs: jest.fn().mockResolvedValue([]),
        add: jest.fn().mockResolvedValue({}),
      }
      ;(storage as any).queue = mockQueue
      ;(storage as any).cleanerQueue_ = mockQueue

      await storage.onApplicationStart()

      expect(Worker).toHaveBeenNthCalledWith(
        1,
        "medusa-workflows",
        expect.any(Function),
        expect.objectContaining({ concurrency: 20 })
      )

      expect(Worker).toHaveBeenNthCalledWith(
        2,
        "medusa-workflows-jobs",
        expect.any(Function),
        expect.objectContaining({ concurrency: 10 })
      )

      expect(Worker).toHaveBeenNthCalledWith(
        3,
        "workflows-cleaner",
        expect.any(Function),
        expect.objectContaining({ concurrency: 1 })
      )
    })

    it("should not create workers when not in worker mode", async () => {
      const storage = new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        isWorkerMode: false,
        redisMainQueueOptions: {},
        redisMainWorkerOptions: {},
        redisJobQueueOptions: {},
        redisJobWorkerOptions: {},
        redisCleanerQueueOptions: {},
        redisCleanerWorkerOptions: {},
      })

      const mockQueue = {
        getRepeatableJobs: jest.fn().mockResolvedValue([]),
      }
      ;(storage as any).queue = mockQueue

      await storage.onApplicationStart()

      expect(Worker).not.toHaveBeenCalled()
    })
  })
})
