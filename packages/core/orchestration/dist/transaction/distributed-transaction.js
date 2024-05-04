"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributedTransaction = exports.TransactionPayload = exports.TransactionCheckpoint = exports.TransactionStepError = exports.TransactionContext = void 0;
const utils_1 = require("@medusajs/utils");
const events_1 = require("events");
const base_in_memory_storage_1 = require("./datastore/base-in-memory-storage");
const transaction_orchestrator_1 = require("./transaction-orchestrator");
const types_1 = require("./types");
/**
 * @typedef TransactionContext
 * @property payload - Object containing the initial payload.
 * @property invoke - Object containing responses of Invoke handlers on steps flagged with saveResponse.
 * @property compensate - Object containing responses of Compensate handlers on steps flagged with saveResponse.
 */
class TransactionContext {
    constructor(payload = undefined, invoke = {}, compensate = {}) {
        this.payload = payload;
        this.invoke = invoke;
        this.compensate = compensate;
    }
}
exports.TransactionContext = TransactionContext;
class TransactionStepError {
    constructor(action, handlerType, error) {
        this.action = action;
        this.handlerType = handlerType;
        this.error = error;
    }
}
exports.TransactionStepError = TransactionStepError;
class TransactionCheckpoint {
    constructor(flow, context, errors = []) {
        this.flow = flow;
        this.context = context;
        this.errors = errors;
    }
}
exports.TransactionCheckpoint = TransactionCheckpoint;
class TransactionPayload {
    /**
     * @param metadata - The metadata of the transaction.
     * @param data - The initial payload data to begin a transation.
     * @param context - Object gathering responses of all steps flagged with saveResponse.
     */
    constructor(metadata, data, context) {
        this.metadata = metadata;
        this.data = data;
        this.context = context;
    }
}
exports.TransactionPayload = TransactionPayload;
/**
 * DistributedTransaction represents a distributed transaction, which is a transaction that is composed of multiple steps that are executed in a specific order.
 */
class DistributedTransaction extends events_1.EventEmitter {
    static setStorage(storage) {
        this.keyValueStore = storage;
    }
    constructor(flow, handler, payload, errors, context) {
        super();
        this.flow = flow;
        this.handler = handler;
        this.payload = payload;
        this.errors = [];
        this.context = new TransactionContext();
        this.transactionId = flow.transactionId;
        this.modelId = flow.modelId;
        if (errors) {
            this.errors = errors;
        }
        this.context.payload = payload;
        if (context) {
            this.context = { ...context };
        }
    }
    getFlow() {
        return this.flow;
    }
    getContext() {
        return this.context;
    }
    getErrors(handlerType) {
        if (!(0, utils_1.isDefined)(handlerType)) {
            return this.errors;
        }
        return this.errors.filter((error) => error.handlerType === handlerType);
    }
    addError(action, handlerType, error) {
        this.errors.push({
            action,
            handlerType,
            error,
        });
    }
    addResponse(action, handlerType, response) {
        this.context[handlerType][action] = response;
    }
    hasFinished() {
        return [
            types_1.TransactionState.DONE,
            types_1.TransactionState.REVERTED,
            types_1.TransactionState.FAILED,
        ].includes(this.getState());
    }
    getState() {
        return this.getFlow().state;
    }
    get isPartiallyCompleted() {
        return !!this.getFlow().hasFailedSteps || !!this.getFlow().hasSkippedSteps;
    }
    canInvoke() {
        return (this.getFlow().state === types_1.TransactionState.NOT_STARTED ||
            this.getFlow().state === types_1.TransactionState.INVOKING);
    }
    canRevert() {
        return (this.getFlow().state === types_1.TransactionState.DONE ||
            this.getFlow().state === types_1.TransactionState.COMPENSATING);
    }
    hasTimeout() {
        return !!this.getTimeout();
    }
    getTimeout() {
        return this.getFlow().options?.timeout;
    }
    async saveCheckpoint(ttl = 0) {
        const options = this.getFlow().options;
        if (!options?.store) {
            return;
        }
        const data = new TransactionCheckpoint(this.getFlow(), this.getContext(), this.getErrors());
        const key = transaction_orchestrator_1.TransactionOrchestrator.getKeyName(DistributedTransaction.keyPrefix, this.modelId, this.transactionId);
        await DistributedTransaction.keyValueStore.save(key, data, ttl);
        return data;
    }
    static async loadTransaction(modelId, transactionId) {
        const key = transaction_orchestrator_1.TransactionOrchestrator.getKeyName(DistributedTransaction.keyPrefix, modelId, transactionId);
        const loadedData = await DistributedTransaction.keyValueStore.get(key);
        if (loadedData) {
            return loadedData;
        }
        return null;
    }
    async scheduleRetry(step, interval) {
        await this.saveCheckpoint();
        await DistributedTransaction.keyValueStore.scheduleRetry(this, step, Date.now(), interval);
    }
    async clearRetry(step) {
        await DistributedTransaction.keyValueStore.clearRetry(this, step);
    }
    async scheduleTransactionTimeout(interval) {
        // schedule transaction timeout only if there are async steps
        if (!this.getFlow().hasAsyncSteps) {
            return;
        }
        await this.saveCheckpoint();
        await DistributedTransaction.keyValueStore.scheduleTransactionTimeout(this, Date.now(), interval);
    }
    async clearTransactionTimeout() {
        if (!this.getFlow().hasAsyncSteps) {
            return;
        }
        await DistributedTransaction.keyValueStore.clearTransactionTimeout(this);
    }
    async scheduleStepTimeout(step, interval) {
        // schedule step timeout only if the step is async
        if (!step.definition.async) {
            return;
        }
        await this.saveCheckpoint();
        await DistributedTransaction.keyValueStore.scheduleStepTimeout(this, step, Date.now(), interval);
    }
    async clearStepTimeout(step) {
        if (!step.definition.async || step.isCompensating()) {
            return;
        }
        await DistributedTransaction.keyValueStore.clearStepTimeout(this, step);
    }
}
exports.DistributedTransaction = DistributedTransaction;
DistributedTransaction.keyPrefix = "dtrans";
DistributedTransaction.setStorage(new base_in_memory_storage_1.BaseInMemoryDistributedTransactionStorage());
//# sourceMappingURL=distributed-transaction.js.map