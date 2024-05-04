import { DistributedTransaction, TransactionCheckpoint } from "../distributed-transaction";
import { TransactionStep } from "../transaction-step";
export interface IDistributedTransactionStorage {
    get(key: string): Promise<TransactionCheckpoint | undefined>;
    list(): Promise<TransactionCheckpoint[]>;
    save(key: string, data: TransactionCheckpoint, ttl?: number): Promise<void>;
    scheduleRetry(transaction: DistributedTransaction, step: TransactionStep, timestamp: number, interval: number): Promise<void>;
    clearRetry(transaction: DistributedTransaction, step: TransactionStep): Promise<void>;
    scheduleTransactionTimeout(transaction: DistributedTransaction, timestamp: number, interval: number): Promise<void>;
    scheduleStepTimeout(transaction: DistributedTransaction, step: TransactionStep, timestamp: number, interval: number): Promise<void>;
    clearTransactionTimeout(transaction: DistributedTransaction): Promise<void>;
    clearStepTimeout(transaction: DistributedTransaction, step: TransactionStep): Promise<void>;
}
export declare abstract class DistributedTransactionStorage implements IDistributedTransactionStorage {
    constructor();
    get(key: string): Promise<TransactionCheckpoint | undefined>;
    list(): Promise<TransactionCheckpoint[]>;
    save(key: string, data: TransactionCheckpoint, ttl?: number): Promise<void>;
    scheduleRetry(transaction: DistributedTransaction, step: TransactionStep, timestamp: number, interval: number): Promise<void>;
    clearRetry(transaction: DistributedTransaction, step: TransactionStep): Promise<void>;
    scheduleTransactionTimeout(transaction: DistributedTransaction, timestamp: number, interval: number): Promise<void>;
    clearTransactionTimeout(transaction: DistributedTransaction): Promise<void>;
    scheduleStepTimeout(transaction: DistributedTransaction, step: TransactionStep, timestamp: number, interval: number): Promise<void>;
    clearStepTimeout(transaction: DistributedTransaction, step: TransactionStep): Promise<void>;
}
