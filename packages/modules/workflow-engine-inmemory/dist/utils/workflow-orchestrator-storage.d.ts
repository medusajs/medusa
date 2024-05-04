import { DistributedTransaction, DistributedTransactionStorage, TransactionCheckpoint, TransactionStep } from "@medusajs/orchestration";
import { ModulesSdkTypes } from "@medusajs/types";
export declare class InMemoryDistributedTransactionStorage extends DistributedTransactionStorage {
    private workflowExecutionService_;
    private workflowOrchestratorService_;
    private storage;
    private retries;
    private timeouts;
    constructor({ workflowExecutionService, }: {
        workflowExecutionService: ModulesSdkTypes.InternalModuleService<any>;
    });
    setWorkflowOrchestratorService(workflowOrchestratorService: any): void;
    private saveToDb;
    private deleteFromDb;
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
//# sourceMappingURL=workflow-orchestrator-storage.d.ts.map