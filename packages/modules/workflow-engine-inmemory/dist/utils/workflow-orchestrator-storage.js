"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDistributedTransactionStorage = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const utils_1 = require("@medusajs/utils");
// eslint-disable-next-line max-len
class InMemoryDistributedTransactionStorage extends orchestration_1.DistributedTransactionStorage {
    constructor({ workflowExecutionService, }) {
        super();
        this.storage = new Map();
        this.retries = new Map();
        this.timeouts = new Map();
        this.workflowExecutionService_ = workflowExecutionService;
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
    /*private stringifyWithSymbol(key, value) {
      if (key === "__type" && typeof value === "symbol") {
        return Symbol.keyFor(value)
      }
  
      return value
    }
  
    private jsonWithSymbol(key, value) {
      if (key === "__type" && typeof value === "string") {
        return Symbol.for(value)
      }
  
      return value
    }*/
    async get(key) {
        return this.storage.get(key);
    }
    async list() {
        return Array.from(this.storage.values());
    }
    async save(key, data, ttl) {
        this.storage.set(key, data);
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
        if (hasFinished && !retentionTime) {
            await this.deleteFromDb(parsedData);
        }
        else {
            await this.saveToDb(parsedData);
        }
        if (hasFinished) {
            this.storage.delete(key);
        }
    }
    async scheduleRetry(transaction, step, timestamp, interval) {
        const { modelId: workflowId, transactionId } = transaction;
        const inter = setTimeout(async () => {
            await this.workflowOrchestratorService_.run(workflowId, {
                transactionId,
                throwOnError: false,
            });
        }, interval * 1e3);
        const key = `${workflowId}:${transactionId}:${step.id}`;
        this.retries.set(key, inter);
    }
    async clearRetry(transaction, step) {
        const { modelId: workflowId, transactionId } = transaction;
        const key = `${workflowId}:${transactionId}:${step.id}`;
        const inter = this.retries.get(key);
        if (inter) {
            clearTimeout(inter);
            this.retries.delete(key);
        }
    }
    async scheduleTransactionTimeout(transaction, timestamp, interval) {
        const { modelId: workflowId, transactionId } = transaction;
        const inter = setTimeout(async () => {
            await this.workflowOrchestratorService_.run(workflowId, {
                transactionId,
                throwOnError: false,
            });
        }, interval * 1e3);
        const key = `${workflowId}:${transactionId}`;
        this.timeouts.set(key, inter);
    }
    async clearTransactionTimeout(transaction) {
        const { modelId: workflowId, transactionId } = transaction;
        const key = `${workflowId}:${transactionId}`;
        const inter = this.timeouts.get(key);
        if (inter) {
            clearTimeout(inter);
            this.timeouts.delete(key);
        }
    }
    async scheduleStepTimeout(transaction, step, timestamp, interval) {
        const { modelId: workflowId, transactionId } = transaction;
        const inter = setTimeout(async () => {
            await this.workflowOrchestratorService_.run(workflowId, {
                transactionId,
                throwOnError: false,
            });
        }, interval * 1e3);
        const key = `${workflowId}:${transactionId}:${step.id}`;
        this.timeouts.set(key, inter);
    }
    async clearStepTimeout(transaction, step) {
        const { modelId: workflowId, transactionId } = transaction;
        const key = `${workflowId}:${transactionId}:${step.id}`;
        const inter = this.timeouts.get(key);
        if (inter) {
            clearTimeout(inter);
            this.timeouts.delete(key);
        }
    }
}
exports.InMemoryDistributedTransactionStorage = InMemoryDistributedTransactionStorage;
