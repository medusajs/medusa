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
  zrange: jest.fn().mockResolvedValue([]),
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
        keys: { repeat: "bull:queue:repeat", delayed: "bull:queue:delayed" },
        upsertJobScheduler: jest.fn().mockResolvedValue({}),
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
        keys: { repeat: "bull:queue:repeat", delayed: "bull:queue:delayed" },
        upsertJobScheduler: jest.fn().mockResolvedValue({}),
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
        keys: { repeat: "bull:queue:repeat", delayed: "bull:queue:delayed" },
      }
      ;(storage as any).queue = mockQueue

      await storage.onApplicationStart()

      expect(Worker).not.toHaveBeenCalled()
    })
  })

  describe("job ids", () => {
    const transaction = {
      modelId: "workflow",
      transactionId: "trx:with:colons",
      getFlow: () => ({ metadata: {} }),
    } as any
    const step = {
      id: "_root.step",
      attempts: 1,
      definition: {},
      isCompensating: () => false,
    } as any

    const createStorage = () => {
      const storage = new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        redisMainQueueOptions: {},
        redisMainWorkerOptions: {},
        redisJobQueueOptions: {},
        redisJobWorkerOptions: {},
        redisCleanerQueueOptions: {},
        redisCleanerWorkerOptions: {},
      })
      const queue = {
        add: jest.fn().mockResolvedValue({}),
        getJob: jest.fn(),
      }
      ;(storage as any).queue = queue
      return { storage, queue }
    }

    it("should not use colons in custom job ids", async () => {
      const { storage, queue } = createStorage()

      await storage.scheduleRetry(transaction, step, Date.now(), 0)

      expect(queue.add).toHaveBeenCalledWith(
        "retry",
        expect.any(Object),
        expect.objectContaining({
          jobId: "retry|workflow|trx|with|colons|_root.step|1",
        })
      )
    })

    it("should remove jobs enqueued with the legacy colon job id", async () => {
      const { storage, queue } = createStorage()
      const legacyJob = { attemptsStarted: 0, remove: jest.fn() }
      queue.getJob.mockImplementation(async (id: string) =>
        id === "retry:workflow:trx:with:colons:_root.step:1"
          ? legacyJob
          : undefined
      )

      await storage.clearRetry(transaction, step)

      expect(legacyJob.remove).toHaveBeenCalled()
    })
  })

  describe("scheduler", () => {
    const createStorage = () =>
      new RedisDistributedTransactionStorage({
        ...baseModuleDeps,
        redisMainQueueOptions: {},
        redisMainWorkerOptions: {},
        redisJobQueueOptions: {},
        redisJobWorkerOptions: {},
        redisCleanerQueueOptions: {},
        redisCleanerWorkerOptions: {},
      })

    const createMockQueue = (name: string) => ({
      keys: { repeat: `bull:${name}:repeat`, delayed: `bull:${name}:delayed` },
      upsertJobScheduler: jest.fn().mockResolvedValue({}),
      removeJobScheduler: jest.fn().mockResolvedValue(true),
      remove: jest.fn().mockResolvedValue(1),
    })

    const mockSortedSets = (membersByKey: Record<string, string[]>) => {
      ;(redisMock.zrange as jest.Mock).mockImplementation(
        async (key: string) => membersByKey[key] ?? []
      )
    }

    afterEach(() => {
      ;(redisMock.zrange as jest.Mock).mockResolvedValue([])
    })

    it("should upsert job schedulers for cron and interval schedules", async () => {
      const storage = createStorage()
      const jobQueue = createMockQueue("jobs")
      ;(storage as any).jobQueue = jobQueue

      await storage.schedule("workflow", { cron: "*/5 * * * *" })
      await storage.schedule("other-workflow", { interval: 1000 })

      expect(jobQueue.upsertJobScheduler).toHaveBeenCalledWith(
        "schedule_workflow",
        { limit: undefined, pattern: "*/5 * * * *" },
        expect.objectContaining({
          name: "schedule",
          data: {
            jobId: "workflow",
            schedulerOptions: { cron: "*/5 * * * *" },
          },
        })
      )
      expect(jobQueue.upsertJobScheduler).toHaveBeenCalledWith(
        "schedule_other-workflow",
        { limit: undefined, every: 1000, startDate: expect.any(Number) },
        expect.any(Object)
      )
    })

    it("should remove a job scheduler by job id", async () => {
      const storage = createStorage()
      const jobQueue = createMockQueue("jobs")
      ;(storage as any).jobQueue = jobQueue

      await storage.remove("workflow")

      expect(jobQueue.removeJobScheduler).toHaveBeenCalledWith(
        "schedule_workflow"
      )
    })

    it("should remove all job schedulers, including legacy repeatable jobs and their pending runs", async () => {
      const storage = createStorage()
      const jobQueue = createMockQueue("jobs")
      ;(storage as any).jobQueue = jobQueue
      mockSortedSets({
        "bull:jobs:repeat": ["schedule_a", "schedule::::*/5 * * * *"],
        "bull:jobs:delayed": ["repeat:7f3a:1793284200000", "retry|wf|trx"],
      })

      await storage.removeAll()

      expect(jobQueue.removeJobScheduler).toHaveBeenCalledWith("schedule_a")
      expect(jobQueue.removeJobScheduler).toHaveBeenCalledWith(
        "schedule::::*/5 * * * *"
      )
      expect(jobQueue.remove).toHaveBeenCalledTimes(1)
      expect(jobQueue.remove).toHaveBeenCalledWith("repeat:7f3a:1793284200000")
    })

    it("should only read the repeat keys on start when there is nothing to clean up", async () => {
      const storage = createStorage()
      const queue = createMockQueue("main")
      const cleanerQueue = createMockQueue("cleaner")
      ;(storage as any).queue = queue
      ;(storage as any).cleanerQueue_ = cleanerQueue
      mockSortedSets({
        "bull:cleaner:repeat": ["clear-expired-executions"],
      })

      await storage.onApplicationStart()

      expect(redisMock.zrange).toHaveBeenCalledTimes(2)
      expect(redisMock.zrange).not.toHaveBeenCalledWith(
        expect.stringMatching(/:delayed$/),
        0,
        -1
      )
      expect(queue.removeJobScheduler).not.toHaveBeenCalled()
      expect(cleanerQueue.removeJobScheduler).not.toHaveBeenCalled()
    })

    it("should replace legacy repeatable jobs on the main and cleaner queues on start", async () => {
      const storage = createStorage()
      const queue = createMockQueue("main")
      const cleanerQueue = createMockQueue("cleaner")
      ;(storage as any).queue = queue
      ;(storage as any).cleanerQueue_ = cleanerQueue
      mockSortedSets({
        "bull:main:repeat": ["schedule_workflow"],
        "bull:main:delayed": ["repeat:schedule_workflow:1", "retry|wf|trx"],
        "bull:cleaner:repeat": [
          "legacy-cleaner-hash",
          "clear-expired-executions",
        ],
        "bull:cleaner:delayed": [
          "repeat:legacy-cleaner-hash:1",
          "repeat:clear-expired-executions:2",
        ],
      })

      await storage.onApplicationStart()

      expect(queue.removeJobScheduler).toHaveBeenCalledWith("schedule_workflow")
      expect(queue.remove).toHaveBeenCalledTimes(1)
      expect(queue.remove).toHaveBeenCalledWith("repeat:schedule_workflow:1")
      expect(cleanerQueue.removeJobScheduler).toHaveBeenCalledTimes(1)
      expect(cleanerQueue.removeJobScheduler).toHaveBeenCalledWith(
        "legacy-cleaner-hash"
      )
      expect(cleanerQueue.remove).toHaveBeenCalledTimes(1)
      expect(cleanerQueue.remove).toHaveBeenCalledWith(
        "repeat:legacy-cleaner-hash:1"
      )
      expect(cleanerQueue.upsertJobScheduler).toHaveBeenCalledWith(
        "clear-expired-executions",
        { every: 1000 * 60 * 30, startDate: expect.any(Number) },
        expect.objectContaining({ name: "cleaner" })
      )
    })
  })
})
