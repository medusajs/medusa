import { TransactionCheckpoint } from "../distributed-transaction"
import { TransactionModelOptions } from "../types"
import { DistributedTransactionStorage } from "./abstract-storage"

// eslint-disable-next-line max-len
export class BaseInMemoryDistributedTransactionStorage extends DistributedTransactionStorage {
  private storage: Map<string, TransactionCheckpoint>

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
}
