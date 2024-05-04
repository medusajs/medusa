"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisDistributedTransactionStorage = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const utils_1 = require("@medusajs/utils");
const bullmq_1 = require("bullmq");
var JobType;
(function (JobType) {
    JobType["RETRY"] = "retry";
    JobType["STEP_TIMEOUT"] = "step_timeout";
    JobType["TRANSACTION_TIMEOUT"] = "transaction_timeout";
})(JobType || (JobType = {}));
// eslint-disable-next-line max-len
class RedisDistributedTransactionStorage extends orchestration_1.DistributedTransactionStorage {
    constructor({ workflowExecutionService, redisConnection, redisWorkerConnection, redisQueueName, }) {
        super();
        this.workflowExecutionService_ = workflowExecutionService;
        this.redisClient = redisConnection;
        this.queue = new bullmq_1.Queue(redisQueueName, { connection: this.redisClient });
        this.worker = new bullmq_1.Worker(redisQueueName, async (job) => {
            const allJobs = [
                JobType.RETRY,
                JobType.STEP_TIMEOUT,
                JobType.TRANSACTION_TIMEOUT,
            ];
            if (allJobs.includes(job.name)) {
                await this.executeTransaction(job.data.workflowId, job.data.transactionId);
            }
        }, { connection: redisWorkerConnection });
    }
    async onApplicationPrepareShutdown() {
        // Close worker gracefully, i.e. wait for the current jobs to finish
        await this.worker.close();
    }
    async onApplicationShutdown() {
        await this.queue.close();
    }
    setWorkflowOrchestratorService(workflowOrchestratorService) {
        this.workflowOrchestratorService_ = workflowOrchestratorService;
    }
    async saveToDb(data) {
        await this.workflowExecutionService_.upsert([
            {
                workflow_id: data.flow.modelId,
                transaction_id: data.flow.transactionId,
                execution: data.flow,
                context: {
                    data: data.context,
                    errors: data.errors,
                },
                state: data.flow.state,
            },
        ]);
    }
    async deleteFromDb(data) {
        await this.workflowExecutionService_.delete([
            {
                workflow_id: data.flow.modelId,
                transaction_id: data.flow.transactionId,
            },
        ]);
    }
    async executeTransaction(workflowId, transactionId) {
        return await this.workflowOrchestratorService_.run(workflowId, {
            transactionId,
            throwOnError: false,
        });
    }
    async get(key) {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : undefined;
    }
    async list() {
        const keys = await this.redisClient.keys(orchestration_1.DistributedTransaction.keyPrefix + ":*");
        const transactions = [];
        for (const key of keys) {
            const data = await this.redisClient.get(key);
            if (data) {
                transactions.push(JSON.parse(data));
            }
        }
        return transactions;
    }
    async save(key, data, ttl) {
        let retentionTime;
        /**
         * Store the retention time only if the transaction is done, failed or reverted.
         * From that moment, this tuple can be later on archived or deleted after the retention time.
         */
        const hasFinished = [
            utils_1.TransactionState.DONE,
            utils_1.TransactionState.FAILED,
            utils_1.TransactionState.REVERTED,
        ].includes(data.flow.state);
        if (hasFinished) {
            retentionTime = data.flow.options?.retentionTime;
            Object.assign(data, {
                retention_time: retentionTime,
            });
        }
        const stringifiedData = JSON.stringify(data);
        const parsedData = JSON.parse(stringifiedData);
        if (!hasFinished) {
            if (ttl) {
                await this.redisClient.set(key, stringifiedData, "EX", ttl);
            }
            else {
                await this.redisClient.set(key, stringifiedData);
            }
        }
        if (hasFinished && !retentionTime) {
            await this.deleteFromDb(parsedData);
        }
        else {
            await this.saveToDb(parsedData);
        }
        if (hasFinished) {
            // await this.redisClient.del(key)
            await this.redisClient.set(key, stringifiedData, "EX", RedisDistributedTransactionStorage.TTL_AFTER_COMPLETED);
        }
    }
    async scheduleRetry(transaction, step, timestamp, interval) {
        await this.queue.add(JobType.RETRY, {
            workflowId: transaction.modelId,
            transactionId: transaction.transactionId,
            stepId: step.id,
        }, {
            delay: interval > 0 ? interval * 1000 : undefined,
            jobId: this.getJobId(JobType.RETRY, transaction, step),
            removeOnComplete: true,
        });
    }
    async clearRetry(transaction, step) {
        await this.removeJob(JobType.RETRY, transaction, step);
    }
    async scheduleTransactionTimeout(transaction, timestamp, interval) {
        await this.queue.add(JobType.TRANSACTION_TIMEOUT, {
            workflowId: transaction.modelId,
            transactionId: transaction.transactionId,
        }, {
            delay: interval * 1000,
            jobId: this.getJobId(JobType.TRANSACTION_TIMEOUT, transaction),
            removeOnComplete: true,
        });
    }
    async clearTransactionTimeout(transaction) {
        await this.removeJob(JobType.TRANSACTION_TIMEOUT, transaction);
    }
    async scheduleStepTimeout(transaction, step, timestamp, interval) {
        await this.queue.add(JobType.STEP_TIMEOUT, {
            workflowId: transaction.modelId,
            transactionId: transaction.transactionId,
            stepId: step.id,
        }, {
            delay: interval * 1000,
            jobId: this.getJobId(JobType.STEP_TIMEOUT, transaction, step),
            removeOnComplete: true,
        });
    }
    async clearStepTimeout(transaction, step) {
        await this.removeJob(JobType.STEP_TIMEOUT, transaction, step);
    }
    getJobId(type, transaction, step) {
        const key = [type, transaction.modelId, transaction.transactionId];
        if (step) {
            key.push(step.id, step.attempts + "");
            if (step.isCompensating()) {
                key.push("compensate");
            }
        }
        return key.join(":");
    }
    async removeJob(type, transaction, step) {
        const jobId = this.getJobId(type, transaction, step);
        const job = await this.queue.getJob(jobId);
        if (job && job.attemptsStarted === 0) {
            await job.remove();
        }
    }
}
exports.RedisDistributedTransactionStorage = RedisDistributedTransactionStorage;
RedisDistributedTransactionStorage.TTL_AFTER_COMPLETED = 60 * 15; // 15 minutes
