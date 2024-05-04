import { TransactionCheckpoint } from "../distributed-transaction";
import { DistributedTransactionStorage } from "./abstract-storage";
export declare class BaseInMemoryDistributedTransactionStorage extends DistributedTransactionStorage {
    private storage;
    constructor();
    get(key: string): Promise<TransactionCheckpoint | undefined>;
    list(): Promise<TransactionCheckpoint[]>;
    save(key: string, data: TransactionCheckpoint, ttl?: number): Promise<void>;
}
