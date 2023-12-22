import {
  DistributedTransaction,
  DistributedTransactionStorage,
  TransactionCheckpoint,
  TransactionModelOptions,
  TransactionStep,
} from "@medusajs/orchestration"
import { Queue, Worker } from "bullmq"
import Redis from "ioredis"
import WorkflowOrchestrator from "./workflow-orchestrator-redis"

enum JobType {
  RETRY = "retry",
  STEP_TIMEOUT = "step_timeout",
  TRANSACTION_TIMEOUT = "transaction_timeout",
}

// eslint-disable-next-line max-len
export class RedisDistributedTransactionStorage extends DistributedTransactionStorage {
  private redisClient: Redis
  private queue: Queue
  private worker: Worker

  constructor(redisUrl = "localhost", queueName = "workflow-orchestrator") {
    super()
    this.redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    })

    this.queue = new Queue(queueName, { connection: this.redisClient })
    this.worker = new Worker(
      queueName,
      async (job) => {
        const allJobs = [
          JobType.RETRY,
          JobType.STEP_TIMEOUT,
          JobType.TRANSACTION_TIMEOUT,
        ]

        if (allJobs.includes(job.name as JobType)) {
          void this.executeTransaction(
            job.data.workflowId,
            job.data.transactionId
          )
        }
      },
      { connection: this.redisClient }
    )
  }

  private async executeTransaction(workflowId: string, transactionId: string) {
    await WorkflowOrchestrator.run(workflowId, {
      transactionId,
      throwOnError: false,
    })
  }

  async get(key: string): Promise<TransactionCheckpoint | undefined> {
    const data = await this.redisClient.get(key)

    return data ? JSON.parse(data) : undefined
  }

  async list(): Promise<TransactionCheckpoint[]> {
    const keys = await this.redisClient.keys("*")
    const transactions: any[] = []
    for (const key of keys) {
      const data = await this.redisClient.get(key)
      if (data) {
        transactions.push(JSON.parse(data))
      }
    }
    return transactions
  }

  async save(
    key: string,
    data: TransactionCheckpoint,
    ttl?: number
  ): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, JSON.stringify(data), "EX", ttl)
    } else {
      await this.redisClient.set(key, JSON.stringify(data))
    }
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key)
  }

  async archive(key: string, options?: TransactionModelOptions): Promise<void> {
    await this.delete(key)
  }

  async scheduleRetry(
    transaction: DistributedTransaction,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    await this.queue.add(
      JobType.RETRY,
      {
        workflowId: transaction.modelId,
        transactionId: transaction.transactionId,
        stepId: step.id,
      },
      {
        delay: interval * 1000,
        jobId: this.getJobId(JobType.RETRY, transaction, step),
        removeOnComplete: true,
      }
    )
  }

  async clearRetry(
    transaction: DistributedTransaction,
    step: TransactionStep
  ): Promise<void> {
    await this.removeJob(JobType.RETRY, transaction, step)
  }

  async scheduleTransactionTimeout(
    transaction: DistributedTransaction,
    timestamp: number,
    interval: number
  ): Promise<void> {
    await this.queue.add(
      JobType.TRANSACTION_TIMEOUT,
      {
        workflowId: transaction.modelId,
        transactionId: transaction.transactionId,
      },
      {
        delay: interval * 1000,
        jobId: this.getJobId(JobType.TRANSACTION_TIMEOUT, transaction),
        removeOnComplete: true,
      }
    )
  }

  async clearTransactionTimeout(
    transaction: DistributedTransaction
  ): Promise<void> {
    await this.removeJob(JobType.TRANSACTION_TIMEOUT, transaction)
  }

  async scheduleStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    await this.queue.add(
      JobType.STEP_TIMEOUT,
      {
        workflowId: transaction.modelId,
        transactionId: transaction.transactionId,
        stepId: step.id,
      },
      {
        delay: interval * 1000,
        jobId: this.getJobId(JobType.STEP_TIMEOUT, transaction, step),
        removeOnComplete: true,
      }
    )
  }

  async clearStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep
  ): Promise<void> {
    await this.removeJob(JobType.STEP_TIMEOUT, transaction, step)
  }

  private getJobId(
    type: JobType,
    transaction: DistributedTransaction,
    step?: TransactionStep
  ) {
    const key = [type, transaction.modelId, transaction.transactionId]

    if (step) {
      key.push(step.id)
    }

    return key.join(":")
  }

  private async removeJob(
    type: JobType,
    transaction: DistributedTransaction,
    step?: TransactionStep
  ) {
    const jobId = this.getJobId(type, transaction, step)
    const job = await this.queue.getJob(jobId)
    if (job) {
      await job.remove()
    }
  }
}
