"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseInMemoryDistributedTransactionStorage = void 0;
const utils_1 = require("@medusajs/utils");
const abstract_storage_1 = require("./abstract-storage");
// eslint-disable-next-line max-len
class BaseInMemoryDistributedTransactionStorage extends abstract_storage_1.DistributedTransactionStorage {
    constructor() {
        super();
        this.storage = new Map();
    }
    async get(key) {
        return this.storage.get(key);
    }
    async list() {
        return Array.from(this.storage.values());
    }
    async save(key, data, ttl) {
        const hasFinished = [
            utils_1.TransactionState.DONE,
            utils_1.TransactionState.REVERTED,
            utils_1.TransactionState.FAILED,
        ].includes(data.flow.state);
        if (hasFinished) {
            this.storage.delete(key);
        }
        else {
            this.storage.set(key, data);
        }
    }
}
exports.BaseInMemoryDistributedTransactionStorage = BaseInMemoryDistributedTransactionStorage;
//# sourceMappingURL=base-in-memory-storage.js.map