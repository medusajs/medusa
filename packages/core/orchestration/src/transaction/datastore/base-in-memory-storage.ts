import { TransactionState } from "@medusajs/utils"
import { TransactionCheckpoint } from "../distributed-transaction"
import { TransactionOptions } from "../types"
import { DistributedTransactionStorage } from "./abstract-storage"

// eslint-disable-next-line max-len
export class BaseInMemoryDistributedTransactionStorage extends DistributedTransactionStorage {
  private storage: Map<string, TransactionCheckpoint>

  constructor() {
    super()
    this.storage = new Map()
  }

  async get(
    key: string,
    options?: TransactionOptions
  ): Promise<TransactionCheckpoint | undefined> {
    return this.storage.get(key)
  }

  async list(): Promise<TransactionCheckpoint[]> {
    return Array.from(this.storage.values())
  }

  async save(
    key: string,
    data: TransactionCheckpoint,
    ttl?: number,
    options?: TransactionOptions
  ): Promise<void> {
    const hasFinished = [
      TransactionState.DONE,
      TransactionState.REVERTED,
      TransactionState.FAILED,
    ].includes(data.flow.state)

    if (hasFinished) {
      this.storage.delete(key)
    } else {
      this.storage.set(key, data)
    }
  }
}
