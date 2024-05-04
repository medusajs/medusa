import { InternalModuleDeclaration } from "@medusajs/modules-sdk";
import { EmitData, Logger, Message } from "@medusajs/types";
import { AbstractEventBusModuleService } from "@medusajs/utils";
import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
import { BullJob, EventBusRedisModuleOptions } from "../types";
type InjectedDependencies = {
    logger: Logger;
    eventBusRedisConnection: Redis;
};
/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
export default class RedisEventBusService extends AbstractEventBusModuleService {
    protected readonly logger_: Logger;
    protected readonly moduleOptions_: EventBusRedisModuleOptions;
    protected readonly moduleDeclaration_: InternalModuleDeclaration;
    protected readonly eventBusRedisConnection_: Redis;
    protected queue_: Queue;
    protected bullWorker_: Worker;
    constructor({ logger, eventBusRedisConnection }: InjectedDependencies, moduleOptions: EventBusRedisModuleOptions | undefined, moduleDeclaration: InternalModuleDeclaration);
    __hooks: {
        onApplicationShutdown: () => Promise<void>;
        onApplicationPrepareShutdown: () => Promise<void>;
    };
    /**
     * Emit a single event
     * @param {string} eventName - the name of the event to be process.
     * @param data - the data to send to the subscriber.
     * @param options - options to add the job with
     */
    emit<T>(eventName: string, data: T, options: Record<string, unknown>): Promise<void>;
    /**
     * Emit a number of events
     * @param {EmitData} data - the data to send to the subscriber.
     */
    emit<T>(data: EmitData<T>[]): Promise<void>;
    emit<T>(data: Message<T>[]): Promise<void>;
    /**
     * Handles incoming jobs.
     * @param job The job object
     * @return resolves to the results of the subscriber calls.
     */
    worker_: <T>(job: BullJob<T>) => Promise<unknown>;
}
export {};
