/// <reference types="node" />
import { DistributedTransaction } from "./distributed-transaction";
import { TransactionStep, TransactionStepHandler } from "./transaction-step";
import { TransactionModelOptions, TransactionState, TransactionStepsDefinition } from "./types";
import { EventEmitter } from "events";
export type TransactionFlow = {
    modelId: string;
    options?: TransactionModelOptions;
    definition: TransactionStepsDefinition;
    transactionId: string;
    hasAsyncSteps: boolean;
    hasFailedSteps: boolean;
    hasWaitingSteps: boolean;
    hasSkippedSteps: boolean;
    hasRevertedSteps: boolean;
    timedOutAt: number | null;
    startedAt?: number;
    state: TransactionState;
    steps: {
        [key: string]: TransactionStep;
    };
};
/**
 * @class TransactionOrchestrator is responsible for managing and executing distributed transactions.
 * It is based on a single transaction definition, which is used to execute all the transaction steps
 */
export declare class TransactionOrchestrator extends EventEmitter {
    id: string;
    private definition;
    private options?;
    private static ROOT_STEP;
    static DEFAULT_TTL: number;
    private invokeSteps;
    private compensateSteps;
    static DEFAULT_RETRIES: number;
    constructor(id: string, definition: TransactionStepsDefinition, options?: TransactionModelOptions | undefined);
    private static SEPARATOR;
    static getKeyName(...params: string[]): string;
    private getPreviousStep;
    getOptions(): TransactionModelOptions;
    private getInvokeSteps;
    private getCompensationSteps;
    private canMoveForward;
    private canMoveBackward;
    private canContinue;
    private hasExpired;
    private checkTransactionTimeout;
    private checkStepTimeout;
    private checkAllSteps;
    private flagStepsToRevert;
    private static setStepSuccess;
    private static setStepTimeout;
    private static setStepFailure;
    private executeNext;
    /**
     * Start a new transaction or resume a transaction that has been previously started
     * @param transaction - The transaction to resume
     */
    resume(transaction: DistributedTransaction): Promise<void>;
    /**
     * Cancel and revert a transaction compensating all its executed steps. It can be an ongoing transaction or a completed one
     * @param transaction - The transaction to be reverted
     */
    cancelTransaction(transaction: DistributedTransaction): Promise<void>;
    private createTransactionFlow;
    private static loadTransactionById;
    private static buildSteps;
    /** Create a new transaction
     * @param transactionId - unique identifier of the transaction
     * @param handler - function to handle action of the transaction
     * @param payload - payload to be passed to all the transaction steps
     */
    beginTransaction(transactionId: string, handler: TransactionStepHandler, payload?: unknown): Promise<DistributedTransaction>;
    /** Returns an existing transaction
     * @param transactionId - unique identifier of the transaction
     * @param handler - function to handle action of the transaction
     */
    retrieveExistingTransaction(transactionId: string, handler: TransactionStepHandler): Promise<DistributedTransaction>;
    private static getStepByAction;
    private static getTransactionAndStepFromIdempotencyKey;
    /** Register a step success for a specific transaction and step
     * @param responseIdempotencyKey - The idempotency key for the step
     * @param handler - The handler function to execute the step
     * @param transaction - The current transaction. If not provided it will be loaded based on the responseIdempotencyKey
     * @param response - The response of the step
     */
    registerStepSuccess(responseIdempotencyKey: string, handler?: TransactionStepHandler, transaction?: DistributedTransaction, response?: unknown): Promise<DistributedTransaction>;
    /**
     * Register a step failure for a specific transaction and step
     * @param responseIdempotencyKey - The idempotency key for the step
     * @param error - The error that caused the failure
     * @param handler - The handler function to execute the step
     * @param transaction - The current transaction
     * @param response - The response of the step
     */
    registerStepFailure(responseIdempotencyKey: string, error?: Error | any, handler?: TransactionStepHandler, transaction?: DistributedTransaction): Promise<DistributedTransaction>;
}
