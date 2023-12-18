import {
  DistributedTransaction,
  TransactionCheckpoint,
} from "../distributed-transaction"
import { TransactionStep } from "../transaction-step"
import { TransactionModelOptions } from "../types"

export interface IDistributedTransactionStorage {
  get(key: string): Promise<TransactionCheckpoint | undefined>
  list(): Promise<TransactionCheckpoint[]>
  save(key: string, data: TransactionCheckpoint, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  archive(key: string, options?: TransactionModelOptions): Promise<void>
  scheduleRetry(
    transaction: DistributedTransaction,
    step: TransactionStep,
    now: number,
    interval: number
  ): Promise<void>
  scheduleTransactionTimeout(
    transaction: DistributedTransaction,
    now: number,
    interval: number
  ): Promise<void>
  scheduleStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep,
    now: number,
    interval: number
  ): Promise<void>
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
    now: number,
    interval: number
  ): Promise<void> {
    //
  }

  async scheduleTransactionTimeout(
    transaction: DistributedTransaction,
    now: number,
    interval: number
  ): Promise<void> {
    //
  }

  async scheduleStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep,
    now: number,
    interval: number
  ): Promise<void> {
    //
  }
}
