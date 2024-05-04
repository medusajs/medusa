import { DistributedTransaction, DistributedTransactionStorage, TransactionCheckpoint, TransactionStep } from "@medusajs/orchestration";
import { ModulesSdkTypes } from "@medusajs/types";
import Redis from "ioredis";
export declare class RedisDistributedTransactionStorage extends DistributedTransactionStorage {
    private static TTL_AFTER_COMPLETED;
    private workflowExecutionService_;
    private workflowOrchestratorService_;
    private redisClient;
    private queue;
    private worker;
    constructor({ workflowExecutionService, redisConnection, redisWorkerConnection, redisQueueName, }: {
        workflowExecutionService: ModulesSdkTypes.InternalModuleService<any>;
        redisConnection: Redis;
        redisWorkerConnection: Redis;
        redisQueueName: string;
    });
    onApplicationPrepareShutdown(): Promise<void>;
    onApplicationShutdown(): Promise<void>;
    setWorkflowOrchestratorService(workflowOrchestratorService: any): void;
    private saveToDb;
    private deleteFromDb;
    private executeTransaction;
    get(key: string): Promise<TransactionCheckpoint | undefined>;
    list(): Promise<TransactionCheckpoint[]>;
    save(key: string, data: TransactionCheckpoint, ttl?: number): Promise<void>;
    scheduleRetry(transaction: DistributedTransaction, step: TransactionStep, timestamp: number, interval: number): Promise<void>;
    clearRetry(transaction: DistributedTransaction, step: TransactionStep): Promise<void>;
    scheduleTransactionTimeout(transaction: DistributedTransaction, timestamp: number, interval: number): Promise<void>;
    clearTransactionTimeout(transaction: DistributedTransaction): Promise<void>;
    scheduleStepTimeout(transaction: DistributedTransaction, step: TransactionStep, timestamp: number, interval: number): Promise<void>;
    clearStepTimeout(transaction: DistributedTransaction, step: TransactionStep): Promise<void>;
    private getJobId;
    private removeJob;
}
//# sourceMappingURL=workflow-orchestrator-storage.d.ts.map