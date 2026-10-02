import {
  DistributedTransactionType,
  TransactionCheckpoint,
} from "../distributed-transaction"
import { TransactionStep } from "../transaction-step"
import { SchedulerOptions, TransactionOptions } from "../types"

export interface IDistributedSchedulerStorage {
  schedule(
    jobDefinition: string | { jobId: string },
    schedulerOptions: SchedulerOptions
  ): Promise<void>

  remove(jobId: string): Promise<void>

  removeAll(): Promise<void>
}

export interface IDistributedTransactionStorage {
  /**
   * Whether the current process is allowed to invoke async steps in-process.
   * When it returns false, the orchestrator defers the invocation of async
   * steps by scheduling an immediate retry instead of executing them locally,
   * so that an instance consuming the storage job queue (e.g. a worker
   * instance) picks them up through the regular execution path.
   * Defaults to true when not implemented.
   */
  shouldExecuteAsyncStepsLocally?(): boolean
  get(
    key: string,
    options?: TransactionOptions & { isCancelling?: boolean }
  ): Promise<TransactionCheckpoint | undefined>
  save(
    key: string,
    data: TransactionCheckpoint,
    ttl?: number,
    options?: TransactionOptions
  ): Promise<TransactionCheckpoint>
  scheduleRetry(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void>
  clearRetry(
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): Promise<void>
  scheduleTransactionTimeout(
    transaction: DistributedTransactionType,
    timestamp: number,
    interval: number
  ): Promise<void>
  scheduleStepTimeout(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void>
  clearTransactionTimeout(
    transaction: DistributedTransactionType
  ): Promise<void>
  clearStepTimeout(
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): Promise<void>
  clearExpiredExecutions(): Promise<void>
}

export abstract class DistributedSchedulerStorage
  implements IDistributedSchedulerStorage
{
  constructor() {
    /* noop */
  }

  async schedule(
    jobDefinition: string | { jobId: string },
    schedulerOptions: SchedulerOptions
  ): Promise<void> {
    throw new Error("Method 'schedule' not implemented.")
  }

  async remove(jobId: string): Promise<void> {
    throw new Error("Method 'remove' not implemented.")
  }

  async removeAll(): Promise<void> {
    throw new Error("Method 'removeAll' not implemented.")
  }
}

export abstract class DistributedTransactionStorage
  implements IDistributedTransactionStorage
{
  constructor() {
    /* noop */
  }

  shouldExecuteAsyncStepsLocally(): boolean {
    return true
  }

  async get(key: string): Promise<TransactionCheckpoint | undefined> {
    throw new Error("Method 'get' not implemented.")
  }

  async save(
    key: string,
    data: TransactionCheckpoint,
    ttl?: number
  ): Promise<TransactionCheckpoint> {
    throw new Error("Method 'save' not implemented.")
  }

  async scheduleRetry(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    throw new Error("Method 'scheduleRetry' not implemented.")
  }

  async clearRetry(
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): Promise<void> {
    throw new Error("Method 'clearRetry' not implemented.")
  }

  async scheduleTransactionTimeout(
    transaction: DistributedTransactionType,
    timestamp: number,
    interval: number
  ): Promise<void> {
    throw new Error("Method 'scheduleTransactionTimeout' not implemented.")
  }

  async clearTransactionTimeout(
    transaction: DistributedTransactionType
  ): Promise<void> {
    throw new Error("Method 'clearTransactionTimeout' not implemented.")
  }

  async scheduleStepTimeout(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    throw new Error("Method 'scheduleStepTimeout' not implemented.")
  }

  async clearStepTimeout(
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): Promise<void> {
    throw new Error("Method 'clearStepTimeout' not implemented.")
  }

  async clearExpiredExecutions(): Promise<void> {
    throw new Error("Method 'clearExpiredExecutions' not implemented.")
  }
}
