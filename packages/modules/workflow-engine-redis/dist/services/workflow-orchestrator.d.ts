import { DistributedTransaction, DistributedTransactionEvents, TransactionStep } from "@medusajs/orchestration";
import { ContainerLike, Context, Logger } from "@medusajs/types";
import { FlowRunOptions, ReturnWorkflow } from "@medusajs/workflows-sdk";
import Redis from "ioredis";
import type { RedisDistributedTransactionStorage } from "../utils";
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
    private instanceId;
    protected redisPublisher: Redis;
    protected redisSubscriber: Redis;
    private subscribers;
    private activeStepsCount;
    private logger;
    protected redisDistributedTransactionStorage_: RedisDistributedTransactionStorage;
    constructor({ dataLoaderOnly, redisDistributedTransactionStorage, redisPublisher, redisSubscriber, logger, }: {
        dataLoaderOnly: boolean;
        redisDistributedTransactionStorage: RedisDistributedTransactionStorage;
        workflowOrchestratorService: WorkflowOrchestratorService;
        redisPublisher: Redis;
        redisSubscriber: Redis;
        logger: Logger;
    });
    onApplicationShutdown(): Promise<void>;
    onApplicationPrepareShutdown(): Promise<void>;
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
    private getChannelName;
    private buildWorkflowEvents;
    private buildIdempotencyKeyAndParts;
}
export {};
//# sourceMappingURL=workflow-orchestrator.d.ts.map