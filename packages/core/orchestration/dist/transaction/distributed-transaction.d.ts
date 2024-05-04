/// <reference types="node" />
import { EventEmitter } from "events";
import { IDistributedTransactionStorage } from "./datastore/abstract-storage";
import { TransactionFlow } from "./transaction-orchestrator";
import { TransactionStep, TransactionStepHandler } from "./transaction-step";
import { TransactionHandlerType, TransactionState } from "./types";
/**
 * @typedef TransactionMetadata
 * @property model_id - The id of the model_id that created the transaction (modelId).
 * @property idempotency_key - The idempotency key of the transaction.
 * @property action - The action of the transaction.
 * @property action_type - The type of the transaction.
 * @property attempt - The number of attempts for the transaction.
 * @property timestamp - The timestamp of the transaction.
 */
export type TransactionMetadata = {
    model_id: string;
    idempotency_key: string;
    action: string;
    action_type: TransactionHandlerType;
    attempt: number;
    timestamp: number;
};
/**
 * @typedef TransactionContext
 * @property payload - Object containing the initial payload.
 * @property invoke - Object containing responses of Invoke handlers on steps flagged with saveResponse.
 * @property compensate - Object containing responses of Compensate handlers on steps flagged with saveResponse.
 */
export declare class TransactionContext {
    payload: unknown;
    invoke: Record<string, unknown>;
    compensate: Record<string, unknown>;
    constructor(payload?: unknown, invoke?: Record<string, unknown>, compensate?: Record<string, unknown>);
}
export declare class TransactionStepError {
    action: string;
    handlerType: TransactionHandlerType;
    error: Error | any;
    constructor(action: string, handlerType: TransactionHandlerType, error: Error | any);
}
export declare class TransactionCheckpoint {
    flow: TransactionFlow;
    context: TransactionContext;
    errors: TransactionStepError[];
    constructor(flow: TransactionFlow, context: TransactionContext, errors?: TransactionStepError[]);
}
export declare class TransactionPayload {
    metadata: TransactionMetadata;
    data: Record<string, unknown>;
    context: TransactionContext;
    /**
     * @param metadata - The metadata of the transaction.
     * @param data - The initial payload data to begin a transation.
     * @param context - Object gathering responses of all steps flagged with saveResponse.
     */
    constructor(metadata: TransactionMetadata, data: Record<string, unknown>, context: TransactionContext);
}
/**
 * DistributedTransaction represents a distributed transaction, which is a transaction that is composed of multiple steps that are executed in a specific order.
 */
export declare class DistributedTransaction extends EventEmitter {
    private flow;
    handler: TransactionStepHandler;
    payload?: any;
    modelId: string;
    transactionId: string;
    private readonly errors;
    private readonly context;
    private static keyValueStore;
    static setStorage(storage: IDistributedTransactionStorage): void;
    static keyPrefix: string;
    constructor(flow: TransactionFlow, handler: TransactionStepHandler, payload?: any, errors?: TransactionStepError[], context?: TransactionContext);
    getFlow(): TransactionFlow;
    getContext(): TransactionContext;
    getErrors(handlerType?: TransactionHandlerType): TransactionStepError[];
    addError(action: string, handlerType: TransactionHandlerType, error: Error | any): void;
    addResponse(action: string, handlerType: TransactionHandlerType, response: unknown): void;
    hasFinished(): boolean;
    getState(): TransactionState;
    get isPartiallyCompleted(): boolean;
    canInvoke(): boolean;
    canRevert(): boolean;
    hasTimeout(): boolean;
    getTimeout(): number | undefined;
    saveCheckpoint(ttl?: number): Promise<TransactionCheckpoint | undefined>;
    static loadTransaction(modelId: string, transactionId: string): Promise<TransactionCheckpoint | null>;
    scheduleRetry(step: TransactionStep, interval: number): Promise<void>;
    clearRetry(step: TransactionStep): Promise<void>;
    scheduleTransactionTimeout(interval: number): Promise<void>;
    clearTransactionTimeout(): Promise<void>;
    scheduleStepTimeout(step: TransactionStep, interval: number): Promise<void>;
    clearStepTimeout(step: TransactionStep): Promise<void>;
}
