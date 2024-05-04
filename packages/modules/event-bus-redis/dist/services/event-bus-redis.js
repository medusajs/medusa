"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const bullmq_1 = require("bullmq");
/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
// eslint-disable-next-line max-len
class RedisEventBusService extends utils_1.AbstractEventBusModuleService {
    constructor({ logger, eventBusRedisConnection }, moduleOptions = {}, moduleDeclaration) {
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        super(...arguments);
        this.__hooks = {
            onApplicationShutdown: async () => {
                await this.queue_.close();
                // eslint-disable-next-line max-len
                this.eventBusRedisConnection_.disconnect();
            },
            onApplicationPrepareShutdown: async () => {
                await this.bullWorker_?.close();
            },
        };
        /**
         * Handles incoming jobs.
         * @param job The job object
         * @return resolves to the results of the subscriber calls.
         */
        this.worker_ = async (job) => {
            const { eventName, data } = job.data;
            const eventSubscribers = this.eventToSubscribersMap.get(eventName) || [];
            const wildcardSubscribers = this.eventToSubscribersMap.get("*") || [];
            const allSubscribers = eventSubscribers.concat(wildcardSubscribers);
            // Pull already completed subscribers from the job data
            const completedSubscribers = job.data.completedSubscriberIds || [];
            // Filter out already completed subscribers from the all subscribers
            const subscribersInCurrentAttempt = allSubscribers.filter((subscriber) => subscriber.id && !completedSubscribers.includes(subscriber.id));
            const currentAttempt = job.attemptsMade;
            const isRetry = currentAttempt > 1;
            const configuredAttempts = job.opts.attempts;
            const isFinalAttempt = currentAttempt === configuredAttempts;
            if (isRetry) {
                if (isFinalAttempt) {
                    this.logger_.info(`Final retry attempt for ${eventName}`);
                }
                this.logger_.info(`Retrying ${eventName} which has ${eventSubscribers.length} subscribers (${subscribersInCurrentAttempt.length} of them failed)`);
            }
            else {
                this.logger_.info(`Processing ${eventName} which has ${eventSubscribers.length} subscribers`);
            }
            const completedSubscribersInCurrentAttempt = [];
            const subscribersResult = await Promise.all(subscribersInCurrentAttempt.map(async ({ id, subscriber }) => {
                return await subscriber(data, eventName)
                    .then(async (data) => {
                    // For every subscriber that completes successfully, add their id to the list of completed subscribers
                    completedSubscribersInCurrentAttempt.push(id);
                    return data;
                })
                    .catch((err) => {
                    this.logger_.warn(`An error occurred while processing ${eventName}: ${err}`);
                    return err;
                });
            }));
            // If the number of completed subscribers is different from the number of subcribers to process in current attempt, some of them failed
            const didSubscribersFail = completedSubscribersInCurrentAttempt.length !==
                subscribersInCurrentAttempt.length;
            const isRetriesConfigured = configuredAttempts > 1;
            // Therefore, if retrying is configured, we try again
            const shouldRetry = didSubscribersFail && isRetriesConfigured && !isFinalAttempt;
            if (shouldRetry) {
                const updatedCompletedSubscribers = [
                    ...completedSubscribers,
                    ...completedSubscribersInCurrentAttempt,
                ];
                job.data.completedSubscriberIds = updatedCompletedSubscribers;
                await job.updateData(job.data);
                const errorMessage = `One or more subscribers of ${eventName} failed. Retrying...`;
                this.logger_.warn(errorMessage);
                return Promise.reject(Error(errorMessage));
            }
            if (didSubscribersFail && !isFinalAttempt) {
                // If retrying is not configured, we log a warning to allow server admins to recover manually
                this.logger_.warn(`One or more subscribers of ${eventName} failed. Retrying is not configured. Use 'attempts' option when emitting events.`);
            }
            return Promise.resolve(subscribersResult);
        };
        this.eventBusRedisConnection_ = eventBusRedisConnection;
        this.moduleOptions_ = moduleOptions;
        this.logger_ = logger;
        this.queue_ = new bullmq_1.Queue(moduleOptions.queueName ?? `events-queue`, {
            prefix: `${this.constructor.name}`,
            ...(moduleOptions.queueOptions ?? {}),
            connection: eventBusRedisConnection,
        });
        // Register our worker to handle emit calls
        const shouldStartWorker = moduleDeclaration.worker_mode !== "server";
        if (shouldStartWorker) {
            this.bullWorker_ = new bullmq_1.Worker(moduleOptions.queueName ?? "events-queue", this.worker_, {
                prefix: `${this.constructor.name}`,
                ...(moduleOptions.workerOptions ?? {}),
                connection: eventBusRedisConnection,
            });
        }
    }
    async emit(eventNameOrData, data, options = {}) {
        const globalJobOptions = this.moduleOptions_.jobOptions ?? {};
        const isBulkEmit = Array.isArray(eventNameOrData);
        const opts = {
            // default options
            removeOnComplete: true,
            attempts: 1,
            // global options
            ...globalJobOptions,
        };
        const dataBody = (0, utils_1.isString)(eventNameOrData)
            ? data ?? data.body
            : undefined;
        const events = isBulkEmit
            ? eventNameOrData.map((event) => ({
                name: event.eventName,
                data: {
                    eventName: event.eventName,
                    data: event.data ?? event.body,
                },
                opts: {
                    ...opts,
                    // local options
                    ...event.options,
                },
            }))
            : [
                {
                    name: eventNameOrData,
                    data: { eventName: eventNameOrData, data: dataBody },
                    opts: {
                        ...opts,
                        // local options
                        ...options,
                    },
                },
            ];
        await this.queue_.addBulk(events);
    }
}
exports.default = RedisEventBusService;
//# sourceMappingURL=event-bus-redis.js.map