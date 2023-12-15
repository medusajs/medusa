import { TransactionCheckpoint } from "../distributed-transaction"
import { TransactionModelOptions } from "../types"

export interface IDistributedTransactionStorage {
  get(key: string): Promise<TransactionCheckpoint | undefined>
  save(key: string, data: TransactionCheckpoint, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  archive(key: string, options?: TransactionModelOptions): Promise<void>
}

export class InMemoryDistributedTransactionStorage
  implements IDistributedTransactionStorage
{
  private storage: Map<string, TransactionCheckpoint>

  constructor() {
    this.storage = new Map()
  }

  async get(key: string): Promise<TransactionCheckpoint | undefined> {
    return this.storage.get(key)
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
