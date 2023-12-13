import { TransactionCheckpoint } from "../distributed-transaction"

export interface IDistributedTransactionStorage {
  get(key: string): Promise<TransactionCheckpoint | undefined>
  set(key: string, data: TransactionCheckpoint, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
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

  async set(key: string, data: TransactionCheckpoint): Promise<void> {
    this.storage.set(key, data)
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key)
  }
}
