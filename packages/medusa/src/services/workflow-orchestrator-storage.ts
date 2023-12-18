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
  private storage: Map<string, TransactionCheckpoint>
  private retries: any[] = []
  private timeouts: any[] = []

  constructor() {
    super()
    this.storage = new Map()
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
    setTimeout(async () => {
      const { modelId: workflowId, transactionId } = transaction
      await WorkflowOrchestrator.run(workflowId, {
        transactionId,
      })
    }, interval * 1e3)
  }

  async scheduleTransactionTimeout(
    transaction: DistributedTransaction,
    timestamp: number,
    interval: number
  ): Promise<void> {
    setTimeout(async () => {
      const { modelId: workflowId, transactionId } = transaction
      await WorkflowOrchestrator.run(workflowId, {
        transactionId,
      })
    }, interval * 1e3)
  }

  async scheduleStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    setTimeout(async () => {
      const { modelId: workflowId, transactionId } = transaction
      await WorkflowOrchestrator.run(workflowId, {
        transactionId,
      })
    }, interval * 1e3)
  }
}
