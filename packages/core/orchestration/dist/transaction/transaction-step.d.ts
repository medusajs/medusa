import { TransactionStepState } from "@medusajs/utils";
import { DistributedTransaction, TransactionPayload } from "./distributed-transaction";
import { TransactionOrchestrator } from "./transaction-orchestrator";
import { TransactionHandlerType, TransactionState, TransactionStepStatus, TransactionStepsDefinition } from "./types";
export type TransactionStepHandler = (actionId: string, handlerType: TransactionHandlerType, payload: TransactionPayload, transaction: DistributedTransaction, step: TransactionStep, orchestrator: TransactionOrchestrator) => Promise<unknown>;
/**
 * @class TransactionStep
 * @classdesc A class representing a single step in a transaction flow
 */
export declare class TransactionStep {
    /**
     * @member id - The id of the step
     * @member depth - The depth of the step in the flow
     * @member definition - The definition of the step
     * @member invoke - The current state and status of the invoke action of the step
     * @member compensate - The current state and status of the compensate action of the step
     * @member attempts - The number of attempts made to execute the step
     * @member failures - The number of failures encountered while executing the step
     * @member lastAttempt - The timestamp of the last attempt made to execute the step
     * @member hasScheduledRetry - A flag indicating if a retry has been scheduled
     * @member retryRescheduledAt - The timestamp of the last retry scheduled
     * @member next - The ids of the next steps in the flow
     * @member saveResponse - A flag indicating if the response of a step should be shared in the transaction context and available to subsequent steps - default is true
     */
    private stepFailed;
    id: string;
    uuid?: string;
    depth: number;
    definition: TransactionStepsDefinition;
    invoke: {
        state: TransactionStepState;
        status: TransactionStepStatus;
    };
    compensate: {
        state: TransactionStepState;
        status: TransactionStepStatus;
    };
    attempts: number;
    failures: number;
    lastAttempt: number | null;
    retryRescheduledAt: number | null;
    hasScheduledRetry: boolean;
    timedOutAt: number | null;
    startedAt?: number;
    next: string[];
    saveResponse: boolean;
    getStates(): {
        state: TransactionStepState;
        status: TransactionStepStatus;
    };
    beginCompensation(): void;
    isCompensating(): boolean;
    isInvoking(): boolean;
    changeState(toState: TransactionStepState): void;
    changeStatus(toStatus: TransactionStepStatus): void;
    hasRetryScheduled(): boolean;
    hasRetryInterval(): boolean;
    hasTimeout(): boolean;
    getTimeout(): number | undefined;
    canRetry(): boolean;
    hasAwaitingRetry(): boolean;
    canRetryAwaiting(): boolean;
    canInvoke(flowState: TransactionState): boolean;
    canCompensate(flowState: TransactionState): boolean;
    canCancel(): boolean;
}
