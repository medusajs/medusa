"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalWorkflow = void 0;
const utils_1 = require("@medusajs/utils");
const awilix_1 = require("awilix");
const transaction_1 = require("../transaction");
const orchestrator_builder_1 = require("../transaction/orchestrator-builder");
const workflow_manager_1 = require("./workflow-manager");
class LocalWorkflow {
    get container() {
        return this.container_;
    }
    set container(modulesLoaded) {
        this.resolveContainer(modulesLoaded);
    }
    constructor(workflowId, modulesLoaded) {
        this.customOptions = {};
        const globalWorkflow = workflow_manager_1.WorkflowManager.getWorkflow(workflowId);
        if (!globalWorkflow) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        this.flow = new orchestrator_builder_1.OrchestratorBuilder(globalWorkflow.flow_);
        this.workflowId = workflowId;
        this.workflow = globalWorkflow;
        this.handlers = new Map(globalWorkflow.handlers_);
        this.resolveContainer(modulesLoaded);
    }
    resolveContainer(modulesLoaded) {
        let container;
        if (!Array.isArray(modulesLoaded) && modulesLoaded) {
            if (!("cradle" in modulesLoaded)) {
                container = (0, utils_1.createMedusaContainer)(modulesLoaded);
            }
            else {
                container = (0, utils_1.createMedusaContainer)({}, modulesLoaded); // copy container
            }
        }
        else if (Array.isArray(modulesLoaded) && modulesLoaded.length) {
            container = (0, utils_1.createMedusaContainer)();
            for (const mod of modulesLoaded) {
                const registrationName = mod.__definition.registrationName;
                container.register(registrationName, (0, awilix_1.asValue)(mod));
            }
        }
        this.container_ = this.contextualizedMedusaModules(container);
    }
    contextualizedMedusaModules(container) {
        if (!container) {
            return (0, utils_1.createMedusaContainer)();
        }
        // eslint-disable-next-line
        const this_ = this;
        const originalResolver = container.resolve;
        container.resolve = function (registrationName, opts) {
            const resolved = originalResolver(registrationName, opts);
            if (resolved?.constructor?.__type !== utils_1.MedusaModuleType) {
                return resolved;
            }
            return new Proxy(resolved, {
                get: function (target, prop) {
                    if (typeof target[prop] !== "function") {
                        return target[prop];
                    }
                    return async (...args) => {
                        const ctxIndex = utils_1.MedusaContext.getIndex(target, prop);
                        const hasContext = args[ctxIndex]?.__type === utils_1.MedusaContextType;
                        if (!hasContext && (0, utils_1.isDefined)(ctxIndex)) {
                            const context = this_.medusaContext;
                            if (context?.__type === utils_1.MedusaContextType) {
                                delete context?.manager;
                                delete context?.transactionManager;
                                args[ctxIndex] = context;
                            }
                        }
                        return await target[prop].apply(target, [...args]);
                    };
                },
            });
        };
        return container;
    }
    commit() {
        const finalFlow = this.flow.build();
        const globalWorkflow = workflow_manager_1.WorkflowManager.getWorkflow(this.workflowId);
        const customOptions = {
            ...globalWorkflow?.options,
            ...this.customOptions,
        };
        this.workflow = {
            id: this.workflowId,
            flow_: finalFlow,
            orchestrator: new transaction_1.TransactionOrchestrator(this.workflowId, finalFlow, customOptions),
            options: customOptions,
            handler: workflow_manager_1.WorkflowManager.buildHandlers(this.handlers),
            handlers_: this.handlers,
        };
    }
    getFlow() {
        if (this.flow.hasChanges) {
            this.commit();
        }
        return this.workflow.flow_;
    }
    registerEventCallbacks({ orchestrator, transaction, subscribe, idempotencyKey, }) {
        const modelId = orchestrator.id;
        let transactionId;
        if (transaction) {
            transactionId = transaction.transactionId;
        }
        else if (idempotencyKey) {
            const [, trxId] = idempotencyKey.split(":");
            transactionId = trxId;
        }
        const eventWrapperMap = new Map();
        for (const [key, handler] of Object.entries(subscribe ?? {})) {
            eventWrapperMap.set(key, (args) => {
                const { transaction } = args;
                if (transaction.transactionId !== transactionId ||
                    transaction.modelId !== modelId) {
                    return;
                }
                handler(args);
            });
        }
        if (subscribe?.onBegin) {
            orchestrator.on(transaction_1.DistributedTransactionEvent.BEGIN, eventWrapperMap.get("onBegin"));
        }
        if (subscribe?.onResume) {
            orchestrator.on(transaction_1.DistributedTransactionEvent.RESUME, eventWrapperMap.get("onResume"));
        }
        if (subscribe?.onCompensateBegin) {
            orchestrator.on(transaction_1.DistributedTransactionEvent.COMPENSATE_BEGIN, eventWrapperMap.get("onCompensateBegin"));
        }
        if (subscribe?.onTimeout) {
            orchestrator.on(transaction_1.DistributedTransactionEvent.TIMEOUT, eventWrapperMap.get("onTimeout"));
        }
        if (subscribe?.onFinish) {
            orchestrator.on(transaction_1.DistributedTransactionEvent.FINISH, eventWrapperMap.get("onFinish"));
        }
        const resumeWrapper = ({ transaction }) => {
            if (transaction.modelId !== modelId ||
                transaction.transactionId !== transactionId) {
                return;
            }
            if (subscribe?.onStepBegin) {
                transaction.on(transaction_1.DistributedTransactionEvent.STEP_BEGIN, eventWrapperMap.get("onStepBegin"));
            }
            if (subscribe?.onStepSuccess) {
                transaction.on(transaction_1.DistributedTransactionEvent.STEP_SUCCESS, eventWrapperMap.get("onStepSuccess"));
            }
            if (subscribe?.onStepFailure) {
                transaction.on(transaction_1.DistributedTransactionEvent.STEP_FAILURE, eventWrapperMap.get("onStepFailure"));
            }
            if (subscribe?.onStepAwaiting) {
                transaction.on(transaction_1.DistributedTransactionEvent.STEP_AWAITING, eventWrapperMap.get("onStepAwaiting"));
            }
            if (subscribe?.onCompensateStepSuccess) {
                transaction.on(transaction_1.DistributedTransactionEvent.COMPENSATE_STEP_SUCCESS, eventWrapperMap.get("onCompensateStepSuccess"));
            }
            if (subscribe?.onCompensateStepFailure) {
                transaction.on(transaction_1.DistributedTransactionEvent.COMPENSATE_STEP_FAILURE, eventWrapperMap.get("onCompensateStepFailure"));
            }
        };
        if (transaction) {
            resumeWrapper({ transaction });
        }
        else {
            orchestrator.once("resume", resumeWrapper);
        }
        const cleanUp = () => {
            subscribe?.onFinish &&
                orchestrator.removeListener(transaction_1.DistributedTransactionEvent.FINISH, eventWrapperMap.get("onFinish"));
            subscribe?.onResume &&
                orchestrator.removeListener(transaction_1.DistributedTransactionEvent.RESUME, eventWrapperMap.get("onResume"));
            subscribe?.onBegin &&
                orchestrator.removeListener(transaction_1.DistributedTransactionEvent.BEGIN, eventWrapperMap.get("onBegin"));
            subscribe?.onCompensateBegin &&
                orchestrator.removeListener(transaction_1.DistributedTransactionEvent.COMPENSATE_BEGIN, eventWrapperMap.get("onCompensateBegin"));
            subscribe?.onTimeout &&
                orchestrator.removeListener(transaction_1.DistributedTransactionEvent.TIMEOUT, eventWrapperMap.get("onTimeout"));
            orchestrator.removeListener(transaction_1.DistributedTransactionEvent.RESUME, resumeWrapper);
            eventWrapperMap.clear();
        };
        return {
            cleanUpEventListeners: cleanUp,
        };
    }
    async run(uniqueTransactionId, input, context, subscribe) {
        if (this.flow.hasChanges) {
            this.commit();
        }
        this.medusaContext = context;
        const { handler, orchestrator } = this.workflow;
        const transaction = await orchestrator.beginTransaction(uniqueTransactionId, handler(this.container_, context), input);
        const { cleanUpEventListeners } = this.registerEventCallbacks({
            orchestrator,
            transaction,
            subscribe,
        });
        await orchestrator.resume(transaction);
        cleanUpEventListeners();
        return transaction;
    }
    async getRunningTransaction(uniqueTransactionId, context) {
        this.medusaContext = context;
        const { handler, orchestrator } = this.workflow;
        const transaction = await orchestrator.retrieveExistingTransaction(uniqueTransactionId, handler(this.container_, context));
        return transaction;
    }
    async cancel(transactionOrTransactionId, context, subscribe) {
        this.medusaContext = context;
        const { orchestrator } = this.workflow;
        const transaction = (0, utils_1.isString)(transactionOrTransactionId)
            ? await this.getRunningTransaction(transactionOrTransactionId, context)
            : transactionOrTransactionId;
        const { cleanUpEventListeners } = this.registerEventCallbacks({
            orchestrator,
            transaction,
            subscribe,
        });
        await orchestrator.cancelTransaction(transaction);
        cleanUpEventListeners();
        return transaction;
    }
    async registerStepSuccess(idempotencyKey, response, context, subscribe) {
        this.medusaContext = context;
        const { handler, orchestrator } = this.workflow;
        const { cleanUpEventListeners } = this.registerEventCallbacks({
            orchestrator,
            idempotencyKey,
            subscribe,
        });
        const transaction = await orchestrator.registerStepSuccess(idempotencyKey, handler(this.container_, context), undefined, response);
        cleanUpEventListeners();
        return transaction;
    }
    async registerStepFailure(idempotencyKey, error, context, subscribe) {
        this.medusaContext = context;
        const { handler, orchestrator } = this.workflow;
        const { cleanUpEventListeners } = this.registerEventCallbacks({
            orchestrator,
            idempotencyKey,
            subscribe,
        });
        const transaction = await orchestrator.registerStepFailure(idempotencyKey, error, handler(this.container_, context));
        cleanUpEventListeners();
        return transaction;
    }
    setOptions(options) {
        this.customOptions = options;
        return this;
    }
    addAction(action, handler, options = {}) {
        this.assertHandler(handler, action);
        this.handlers.set(action, handler);
        return this.flow.addAction(action, options);
    }
    replaceAction(existingAction, action, handler, options = {}) {
        this.assertHandler(handler, action);
        this.handlers.set(action, handler);
        return this.flow.replaceAction(existingAction, action, options);
    }
    insertActionBefore(existingAction, action, handler, options = {}) {
        this.assertHandler(handler, action);
        this.handlers.set(action, handler);
        return this.flow.insertActionBefore(existingAction, action, options);
    }
    insertActionAfter(existingAction, action, handler, options = {}) {
        this.assertHandler(handler, action);
        this.handlers.set(action, handler);
        return this.flow.insertActionAfter(existingAction, action, options);
    }
    appendAction(action, to, handler, options = {}) {
        this.assertHandler(handler, action);
        this.handlers.set(action, handler);
        return this.flow.appendAction(action, to, options);
    }
    moveAction(actionToMove, targetAction) {
        return this.flow.moveAction(actionToMove, targetAction);
    }
    moveAndMergeNextAction(actionToMove, targetAction) {
        return this.flow.moveAndMergeNextAction(actionToMove, targetAction);
    }
    mergeActions(where, ...actions) {
        return this.flow.mergeActions(where, ...actions);
    }
    deleteAction(action, parentSteps) {
        return this.flow.deleteAction(action, parentSteps);
    }
    pruneAction(action) {
        return this.flow.pruneAction(action);
    }
    assertHandler(handler, action) {
        if (!handler?.invoke) {
            throw new Error(`Handler for action "${action}" is missing invoke function.`);
        }
    }
}
exports.LocalWorkflow = LocalWorkflow;
//# sourceMappingURL=local-workflow.js.map