import { DistributedTransaction, DistributedTransactionEvents, TransactionStep } from "@medusajs/orchestration";
import { ContainerLike, Context } from "@medusajs/types";
import { type FlowRunOptions, ReturnWorkflow } from "@medusajs/workflows-sdk";
import { InMemoryDistributedTransactionStorage } from "../utils";
export type WorkflowOrchestratorRunOptions<T> = Omit<FlowRunOptions<T>, "container"> & {
    transactionId?: string;
    container?: ContainerLike;
};
type RegisterStepSuccessOptions<T> = Omit<WorkflowOrchestratorRunOptions<T>, "transactionId" | "input">;
type IdempotencyKeyParts = {
    workflowId: string;
    transactionId: string;
    stepId: string;
    action: "invoke" | "compensate";
};
type NotifyOptions = {
    eventType: keyof DistributedTransactionEvents;
    workflowId: string;
    transactionId?: string;
    step?: TransactionStep;
    response?: unknown;
    result?: unknown;
    errors?: unknown[];
};
type SubscriberHandler = {
    (input: NotifyOptions): void;
} & {
    _id?: string;
};
type SubscribeOptions = {
    workflowId: string;
    transactionId?: string;
    subscriber: SubscriberHandler;
    subscriberId?: string;
};
type UnsubscribeOptions = {
    workflowId: string;
    transactionId?: string;
    subscriberOrId: string | SubscriberHandler;
};
export declare class WorkflowOrchestratorService {
    private subscribers;
    constructor({ inMemoryDistributedTransactionStorage, }: {
        inMemoryDistributedTransactionStorage: InMemoryDistributedTransactionStorage;
        workflowOrchestratorService: WorkflowOrchestratorService;
    });
    run<T = unknown>(workflowIdOrWorkflow: string | ReturnWorkflow<any, any, any>, options?: WorkflowOrchestratorRunOptions<T>, sharedContext?: Context): Promise<any>;
    getRunningTransaction(workflowId: string, transactionId: string, options?: WorkflowOrchestratorRunOptions<undefined>, sharedContext?: Context): Promise<DistributedTransaction>;
    setStepSuccess<T = unknown>({ idempotencyKey, stepResponse, options, }: {
        idempotencyKey: string | IdempotencyKeyParts;
        stepResponse: unknown;
        options?: RegisterStepSuccessOptions<T>;
    }, sharedContext?: Context): Promise<any>;
    setStepFailure<T = unknown>({ idempotencyKey, stepResponse, options, }: {
        idempotencyKey: string | IdempotencyKeyParts;
        stepResponse: unknown;
        options?: RegisterStepSuccessOptions<T>;
    }, sharedContext?: Context): Promise<any>;
    subscribe({ workflowId, transactionId, subscriber, subscriberId }: SubscribeOptions, sharedContext?: Context): void;
    unsubscribe({ workflowId, transactionId, subscriberOrId }: UnsubscribeOptions, sharedContext?: Context): void;
    private notify;
    private buildWorkflowEvents;
    private buildIdempotencyKeyAndParts;
}
export {};
//# sourceMappingURL=workflow-orchestrator.d.ts.map