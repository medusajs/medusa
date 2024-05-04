"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributedTransactionStorage = void 0;
class DistributedTransactionStorage {
    constructor() {
        /* noop */
    }
    async get(key) {
        throw new Error("Method 'get' not implemented.");
    }
    async list() {
        throw new Error("Method 'list' not implemented.");
    }
    async save(key, data, ttl) {
        throw new Error("Method 'save' not implemented.");
    }
    async scheduleRetry(transaction, step, timestamp, interval) {
        throw new Error("Method 'scheduleRetry' not implemented.");
    }
    async clearRetry(transaction, step) {
        throw new Error("Method 'clearRetry' not implemented.");
    }
    async scheduleTransactionTimeout(transaction, timestamp, interval) {
        throw new Error("Method 'scheduleTransactionTimeout' not implemented.");
    }
    async clearTransactionTimeout(transaction) {
        throw new Error("Method 'clearTransactionTimeout' not implemented.");
    }
    async scheduleStepTimeout(transaction, step, timestamp, interval) {
        throw new Error("Method 'scheduleStepTimeout' not implemented.");
    }
    async clearStepTimeout(transaction, step) {
        throw new Error("Method 'clearStepTimeout' not implemented.");
    }
}
exports.DistributedTransactionStorage = DistributedTransactionStorage;
//# sourceMappingURL=abstract-storage.js.map