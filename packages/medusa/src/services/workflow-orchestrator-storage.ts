import {
  DistributedTransaction,
  DistributedTransactionStorage,
  TransactionCheckpoint,
  TransactionModelOptions,
  TransactionStep,
} from "@medusajs/orchestration"
import WorkflowOrchestrator from "./workflow-orchestrator"

// eslint-disable-next-line max-len
export class InMemoryDistributedTransactionStorage extends DistributedTransactionStorage {
  private storage: Map<string, TransactionCheckpoint> = new Map()
  private retries: Map<string, unknown> = new Map()
  private timeouts: Map<string, unknown> = new Map()

  constructor() {
    super()
  }

  async get(key: string): Promise<TransactionCheckpoint | undefined> {
    return this.storage.get(key)
  }

  async list(): Promise<TransactionCheckpoint[]> {
    return Array.from(this.storage.values())
  }

  async save(
    key: string,
    data: TransactionCheckpoint,
    ttl?: number
  ): Promise<void> {
    this.storage.set(key, data)
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key)
  }

  async archive(key: string, options?: TransactionModelOptions): Promise<void> {
    this.storage.delete(key)
  }

  async scheduleRetry(
    transaction: DistributedTransaction,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction

    const inter = setTimeout(async () => {
      await WorkflowOrchestrator.run(workflowId, {
        transactionId,
      })
    }, interval * 1e3)

    const key = `${workflowId}:${transactionId}:${step.id}`
    this.retries.set(key, inter)
  }

  async clearRetry(
    transaction: DistributedTransaction,
    step: TransactionStep
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction

    const key = `${workflowId}:${transactionId}:${step.id}`
    const inter = this.retries.get(key)
    if (inter) {
      clearTimeout(inter as NodeJS.Timeout)
      this.retries.delete(key)
    }
  }

  async scheduleTransactionTimeout(
    transaction: DistributedTransaction,
    timestamp: number,
    interval: number
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction

    const inter = setTimeout(async () => {
      await WorkflowOrchestrator.run(workflowId, {
        transactionId,
      })
    }, interval * 1e3)

    const key = `${workflowId}:${transactionId}`
    this.timeouts.set(key, inter)
  }

  async clearTransactionTimeout(
    transaction: DistributedTransaction
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction

    const key = `${workflowId}:${transactionId}`
    const inter = this.timeouts.get(key)
    if (inter) {
      clearTimeout(inter as NodeJS.Timeout)
      this.timeouts.delete(key)
    }
  }

  async scheduleStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction

    const inter = setTimeout(async () => {
      await WorkflowOrchestrator.run(workflowId, {
        transactionId,
      })
    }, interval * 1e3)

    const key = `${workflowId}:${transactionId}:${step.id}`
    this.timeouts.set(key, inter)
  }

  async clearStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction

    const key = `${workflowId}:${transactionId}:${step.id}`
    const inter = this.timeouts.get(key)
    if (inter) {
      clearTimeout(inter as NodeJS.Timeout)
      this.timeouts.delete(key)
    }
  }
}
