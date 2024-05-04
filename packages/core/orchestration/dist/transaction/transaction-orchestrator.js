"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionOrchestrator = void 0;
const distributed_transaction_1 = require("./distributed-transaction");
const transaction_step_1 = require("./transaction-step");
const types_1 = require("./types");
const utils_1 = require("@medusajs/utils");
const events_1 = require("events");
const errors_1 = require("./errors");
/**
 * @class TransactionOrchestrator is responsible for managing and executing distributed transactions.
 * It is based on a single transaction definition, which is used to execute all the transaction steps
 */
class TransactionOrchestrator extends events_1.EventEmitter {
    constructor(id, definition, options) {
        super();
        this.id = id;
        this.definition = definition;
        this.options = options;
        this.invokeSteps = [];
        this.compensateSteps = [];
    }
    static getKeyName(...params) {
        return params.join(this.SEPARATOR);
    }
    getPreviousStep(flow, step) {
        const id = step.id.split(".");
        id.pop();
        const parentId = id.join(".");
        return flow.steps[parentId];
    }
    getOptions() {
        return this.options ?? {};
    }
    getInvokeSteps(flow) {
        if (this.invokeSteps.length) {
            return this.invokeSteps;
        }
        const steps = Object.keys(flow.steps);
        steps.sort((a, b) => flow.steps[a].depth - flow.steps[b].depth);
        this.invokeSteps = steps;
        return steps;
    }
    getCompensationSteps(flow) {
        if (this.compensateSteps.length) {
            return this.compensateSteps;
        }
        const steps = Object.keys(flow.steps);
        steps.sort((a, b) => (flow.steps[b].depth || 0) - (flow.steps[a].depth || 0));
        this.compensateSteps = steps;
        return steps;
    }
    canMoveForward(flow, previousStep) {
        const states = [
            utils_1.TransactionStepState.DONE,
            utils_1.TransactionStepState.FAILED,
            utils_1.TransactionStepState.TIMEOUT,
            utils_1.TransactionStepState.SKIPPED,
        ];
        const siblings = this.getPreviousStep(flow, previousStep).next.map((sib) => flow.steps[sib]);
        return (!!previousStep.definition.noWait ||
            siblings.every((sib) => states.includes(sib.invoke.state)));
    }
    canMoveBackward(flow, step) {
        const states = [
            utils_1.TransactionStepState.DONE,
            utils_1.TransactionStepState.REVERTED,
            utils_1.TransactionStepState.FAILED,
            utils_1.TransactionStepState.DORMANT,
        ];
        const siblings = step.next.map((sib) => flow.steps[sib]);
        return (siblings.length === 0 ||
            siblings.every((sib) => states.includes(sib.compensate.state)));
    }
    canContinue(flow, step) {
        if (flow.state == types_1.TransactionState.COMPENSATING) {
            return this.canMoveBackward(flow, step);
        }
        else {
            const previous = this.getPreviousStep(flow, step);
            if (previous.id === TransactionOrchestrator.ROOT_STEP) {
                return true;
            }
            return this.canMoveForward(flow, previous);
        }
    }
    hasExpired({ transaction, step, }, dateNow) {
        const hasStepTimedOut = step &&
            step.hasTimeout() &&
            !step.isCompensating() &&
            dateNow > step.startedAt + step.getTimeout() * 1e3;
        const hasTransactionTimedOut = transaction &&
            transaction.hasTimeout() &&
            transaction.getFlow().state !== types_1.TransactionState.COMPENSATING &&
            dateNow >
                transaction.getFlow().startedAt + transaction.getTimeout() * 1e3;
        return !!hasStepTimedOut || !!hasTransactionTimedOut;
    }
    async checkTransactionTimeout(transaction, currentSteps) {
        const flow = transaction.getFlow();
        let hasTimedOut = false;
        if (!flow.timedOutAt && this.hasExpired({ transaction }, Date.now())) {
            flow.timedOutAt = Date.now();
            void transaction.clearTransactionTimeout();
            for (const step of currentSteps) {
                await TransactionOrchestrator.setStepTimeout(transaction, step, new errors_1.TransactionTimeoutError());
            }
            await transaction.saveCheckpoint();
            this.emit(types_1.DistributedTransactionEvent.TIMEOUT, { transaction });
            hasTimedOut = true;
        }
        return hasTimedOut;
    }
    async checkStepTimeout(transaction, step) {
        let hasTimedOut = false;
        if (!step.timedOutAt &&
            step.canCancel() &&
            this.hasExpired({ step }, Date.now())) {
            step.timedOutAt = Date.now();
            await TransactionOrchestrator.setStepTimeout(transaction, step, new errors_1.TransactionStepTimeoutError());
            hasTimedOut = true;
            await transaction.saveCheckpoint();
            this.emit(types_1.DistributedTransactionEvent.TIMEOUT, { transaction });
        }
        return hasTimedOut;
    }
    async checkAllSteps(transaction) {
        let hasSkipped = false;
        let hasIgnoredFailure = false;
        let hasFailed = false;
        let hasWaiting = false;
        let hasReverted = false;
        let completedSteps = 0;
        const flow = transaction.getFlow();
        const nextSteps = [];
        const currentSteps = [];
        const allSteps = flow.state === types_1.TransactionState.COMPENSATING
            ? this.getCompensationSteps(flow)
            : this.getInvokeSteps(flow);
        for (const step of allSteps) {
            if (step === TransactionOrchestrator.ROOT_STEP ||
                !this.canContinue(flow, flow.steps[step])) {
                continue;
            }
            const stepDef = flow.steps[step];
            const curState = stepDef.getStates();
            const hasTimedOut = await this.checkStepTimeout(transaction, stepDef);
            if (hasTimedOut) {
                continue;
            }
            if (curState.status === types_1.TransactionStepStatus.WAITING) {
                currentSteps.push(stepDef);
                hasWaiting = true;
                if (stepDef.hasAwaitingRetry()) {
                    if (stepDef.canRetryAwaiting()) {
                        stepDef.retryRescheduledAt = null;
                        nextSteps.push(stepDef);
                    }
                    else if (!stepDef.retryRescheduledAt) {
                        stepDef.hasScheduledRetry = true;
                        stepDef.retryRescheduledAt = Date.now();
                        await transaction.scheduleRetry(stepDef, stepDef.definition.retryIntervalAwaiting);
                    }
                }
                continue;
            }
            else if (curState.status === types_1.TransactionStepStatus.TEMPORARY_FAILURE) {
                currentSteps.push(stepDef);
                if (!stepDef.canRetry()) {
                    if (stepDef.hasRetryInterval() && !stepDef.retryRescheduledAt) {
                        stepDef.hasScheduledRetry = true;
                        stepDef.retryRescheduledAt = Date.now();
                        await transaction.scheduleRetry(stepDef, stepDef.definition.retryInterval);
                    }
                    continue;
                }
                stepDef.retryRescheduledAt = null;
            }
            if (stepDef.canInvoke(flow.state) || stepDef.canCompensate(flow.state)) {
                nextSteps.push(stepDef);
            }
            else {
                completedSteps++;
                if (curState.state === utils_1.TransactionStepState.SKIPPED) {
                    hasSkipped = true;
                }
                else if (curState.state === utils_1.TransactionStepState.REVERTED) {
                    hasReverted = true;
                }
                else if (curState.state === utils_1.TransactionStepState.FAILED) {
                    if (stepDef.definition.continueOnPermanentFailure) {
                        hasIgnoredFailure = true;
                    }
                    else {
                        hasFailed = true;
                    }
                }
            }
        }
        flow.hasWaitingSteps = hasWaiting;
        flow.hasRevertedSteps = hasReverted;
        const totalSteps = allSteps.length - 1;
        if (flow.state === types_1.TransactionState.WAITING_TO_COMPENSATE &&
            nextSteps.length === 0 &&
            !hasWaiting) {
            flow.state = types_1.TransactionState.COMPENSATING;
            this.flagStepsToRevert(flow);
            this.emit(types_1.DistributedTransactionEvent.COMPENSATE_BEGIN, { transaction });
            return await this.checkAllSteps(transaction);
        }
        else if (completedSteps === totalSteps) {
            if (hasSkipped) {
                flow.hasSkippedSteps = true;
            }
            if (hasIgnoredFailure) {
                flow.hasFailedSteps = true;
            }
            if (hasFailed) {
                flow.state = types_1.TransactionState.FAILED;
            }
            else {
                flow.state = hasReverted
                    ? types_1.TransactionState.REVERTED
                    : types_1.TransactionState.DONE;
            }
        }
        return {
            current: currentSteps,
            next: nextSteps,
            total: totalSteps,
            remaining: totalSteps - completedSteps,
            completed: completedSteps,
        };
    }
    flagStepsToRevert(flow) {
        for (const step in flow.steps) {
            if (step === TransactionOrchestrator.ROOT_STEP) {
                continue;
            }
            const stepDef = flow.steps[step];
            const curState = stepDef.getStates();
            if ([utils_1.TransactionStepState.DONE, utils_1.TransactionStepState.TIMEOUT].includes(curState.state) ||
                curState.status === types_1.TransactionStepStatus.PERMANENT_FAILURE) {
                stepDef.beginCompensation();
                stepDef.changeState(utils_1.TransactionStepState.NOT_STARTED);
            }
        }
    }
    static async setStepSuccess(transaction, step, response) {
        const hasStepTimedOut = step.getStates().state === utils_1.TransactionStepState.TIMEOUT;
        if (step.saveResponse) {
            transaction.addResponse(step.definition.action, step.isCompensating()
                ? types_1.TransactionHandlerType.COMPENSATE
                : types_1.TransactionHandlerType.INVOKE, response);
        }
        const flow = transaction.getFlow();
        if (!hasStepTimedOut) {
            step.changeStatus(types_1.TransactionStepStatus.OK);
        }
        if (step.isCompensating()) {
            step.changeState(utils_1.TransactionStepState.REVERTED);
        }
        else if (!hasStepTimedOut) {
            step.changeState(utils_1.TransactionStepState.DONE);
        }
        if (step.definition.async || flow.options?.storeExecution) {
            await transaction.saveCheckpoint();
        }
        const cleaningUp = [];
        if (step.hasRetryScheduled()) {
            cleaningUp.push(transaction.clearRetry(step));
        }
        if (step.hasTimeout()) {
            cleaningUp.push(transaction.clearStepTimeout(step));
        }
        await (0, utils_1.promiseAll)(cleaningUp);
        const eventName = step.isCompensating()
            ? types_1.DistributedTransactionEvent.COMPENSATE_STEP_SUCCESS
            : types_1.DistributedTransactionEvent.STEP_SUCCESS;
        transaction.emit(eventName, { step, transaction });
    }
    static async setStepTimeout(transaction, step, error) {
        if ([
            utils_1.TransactionStepState.TIMEOUT,
            utils_1.TransactionStepState.DONE,
            utils_1.TransactionStepState.REVERTED,
        ].includes(step.getStates().state)) {
            return;
        }
        step.changeState(utils_1.TransactionStepState.TIMEOUT);
        transaction.addError(step.definition.action, types_1.TransactionHandlerType.INVOKE, error);
        await TransactionOrchestrator.setStepFailure(transaction, step, undefined, 0, true, error);
        await transaction.clearStepTimeout(step);
    }
    static async setStepFailure(transaction, step, error, maxRetries = TransactionOrchestrator.DEFAULT_RETRIES, isTimeout = false, timeoutError) {
        step.failures++;
        if ((0, errors_1.isErrorLike)(error)) {
            error = (0, errors_1.serializeError)(error);
        }
        if (!isTimeout &&
            step.getStates().status !== types_1.TransactionStepStatus.PERMANENT_FAILURE) {
            step.changeStatus(types_1.TransactionStepStatus.TEMPORARY_FAILURE);
        }
        const flow = transaction.getFlow();
        const cleaningUp = [];
        const hasTimedOut = step.getStates().state === utils_1.TransactionStepState.TIMEOUT;
        if (step.failures > maxRetries || hasTimedOut) {
            if (!hasTimedOut) {
                step.changeState(utils_1.TransactionStepState.FAILED);
            }
            step.changeStatus(types_1.TransactionStepStatus.PERMANENT_FAILURE);
            if (!isTimeout) {
                transaction.addError(step.definition.action, step.isCompensating()
                    ? types_1.TransactionHandlerType.COMPENSATE
                    : types_1.TransactionHandlerType.INVOKE, error);
            }
            if (!step.isCompensating()) {
                if (step.definition.continueOnPermanentFailure &&
                    !errors_1.TransactionTimeoutError.isTransactionTimeoutError(timeoutError)) {
                    for (const childStep of step.next) {
                        const child = flow.steps[childStep];
                        child.changeState(utils_1.TransactionStepState.SKIPPED);
                    }
                }
                else {
                    flow.state = types_1.TransactionState.WAITING_TO_COMPENSATE;
                }
            }
            if (step.hasTimeout()) {
                cleaningUp.push(transaction.clearStepTimeout(step));
            }
        }
        if (step.definition.async || flow.options?.storeExecution) {
            await transaction.saveCheckpoint();
        }
        if (step.hasRetryScheduled()) {
            cleaningUp.push(transaction.clearRetry(step));
        }
        await (0, utils_1.promiseAll)(cleaningUp);
        const eventName = step.isCompensating()
            ? types_1.DistributedTransactionEvent.COMPENSATE_STEP_FAILURE
            : types_1.DistributedTransactionEvent.STEP_FAILURE;
        transaction.emit(eventName, { step, transaction });
    }
    async executeNext(transaction) {
        let continueExecution = true;
        while (continueExecution) {
            if (transaction.hasFinished()) {
                return;
            }
            const flow = transaction.getFlow();
            const nextSteps = await this.checkAllSteps(transaction);
            const execution = [];
            const hasTimedOut = await this.checkTransactionTimeout(transaction, nextSteps.current);
            if (hasTimedOut) {
                continue;
            }
            if (nextSteps.remaining === 0) {
                if (transaction.hasTimeout()) {
                    void transaction.clearTransactionTimeout();
                }
                await transaction.saveCheckpoint();
                this.emit(types_1.DistributedTransactionEvent.FINISH, { transaction });
            }
            let hasSyncSteps = false;
            for (const step of nextSteps.next) {
                const curState = step.getStates();
                const type = step.isCompensating()
                    ? types_1.TransactionHandlerType.COMPENSATE
                    : types_1.TransactionHandlerType.INVOKE;
                step.lastAttempt = Date.now();
                step.attempts++;
                if (curState.state === utils_1.TransactionStepState.NOT_STARTED) {
                    if (!step.startedAt) {
                        step.startedAt = Date.now();
                    }
                    if (step.isCompensating()) {
                        step.changeState(utils_1.TransactionStepState.COMPENSATING);
                        if (step.definition.noCompensation) {
                            step.changeState(utils_1.TransactionStepState.REVERTED);
                            continue;
                        }
                    }
                    else if (flow.state === types_1.TransactionState.INVOKING) {
                        step.changeState(utils_1.TransactionStepState.INVOKING);
                    }
                }
                step.changeStatus(types_1.TransactionStepStatus.WAITING);
                const payload = new distributed_transaction_1.TransactionPayload({
                    model_id: flow.modelId,
                    idempotency_key: TransactionOrchestrator.getKeyName(flow.modelId, flow.transactionId, step.definition.action, type),
                    action: step.definition.action + "",
                    action_type: type,
                    attempt: step.attempts,
                    timestamp: Date.now(),
                }, transaction.payload, transaction.getContext());
                if (step.hasTimeout() && !step.timedOutAt && step.attempts === 1) {
                    await transaction.scheduleStepTimeout(step, step.definition.timeout);
                }
                transaction.emit(types_1.DistributedTransactionEvent.STEP_BEGIN, {
                    step,
                    transaction,
                });
                const isAsync = step.isCompensating()
                    ? step.definition.compensateAsync
                    : step.definition.async;
                const setStepFailure = async (error, { endRetry } = {}) => {
                    await TransactionOrchestrator.setStepFailure(transaction, step, error, endRetry ? 0 : step.definition.maxRetries);
                    if (isAsync) {
                        await transaction.scheduleRetry(step, step.definition.retryInterval ?? 0);
                    }
                };
                if (!isAsync) {
                    hasSyncSteps = true;
                    execution.push(transaction
                        .handler(step.definition.action + "", type, payload, transaction, step, this)
                        .then(async (response) => {
                        if (this.hasExpired({ transaction, step }, Date.now())) {
                            await this.checkStepTimeout(transaction, step);
                            await this.checkTransactionTimeout(transaction, nextSteps.next.includes(step) ? nextSteps.next : [step]);
                        }
                        await TransactionOrchestrator.setStepSuccess(transaction, step, response);
                    })
                        .catch(async (error) => {
                        if (this.hasExpired({ transaction, step }, Date.now())) {
                            await this.checkStepTimeout(transaction, step);
                            await this.checkTransactionTimeout(transaction, nextSteps.next.includes(step) ? nextSteps.next : [step]);
                        }
                        if (errors_1.PermanentStepFailureError.isPermanentStepFailureError(error)) {
                            await setStepFailure(error, { endRetry: true });
                            return;
                        }
                        await setStepFailure(error);
                    }));
                }
                else {
                    execution.push(transaction.saveCheckpoint().then(() => {
                        transaction
                            .handler(step.definition.action + "", type, payload, transaction, step, this)
                            .then(async (response) => {
                            if (!step.definition.backgroundExecution) {
                                const eventName = types_1.DistributedTransactionEvent.STEP_AWAITING;
                                transaction.emit(eventName, { step, transaction });
                                return;
                            }
                            if (this.hasExpired({ transaction, step }, Date.now())) {
                                await this.checkStepTimeout(transaction, step);
                                await this.checkTransactionTimeout(transaction, nextSteps.next.includes(step) ? nextSteps.next : [step]);
                            }
                            await TransactionOrchestrator.setStepSuccess(transaction, step, response);
                            await transaction.scheduleRetry(step, step.definition.retryInterval ?? 0);
                        })
                            .catch(async (error) => {
                            if (errors_1.PermanentStepFailureError.isPermanentStepFailureError(error)) {
                                await setStepFailure(error, { endRetry: true });
                                return;
                            }
                            await setStepFailure(error);
                        });
                    }));
                }
            }
            if (hasSyncSteps && flow.options?.storeExecution) {
                await transaction.saveCheckpoint();
            }
            await (0, utils_1.promiseAll)(execution);
            if (nextSteps.next.length === 0) {
                continueExecution = false;
            }
        }
    }
    /**
     * Start a new transaction or resume a transaction that has been previously started
     * @param transaction - The transaction to resume
     */
    async resume(transaction) {
        if (transaction.modelId !== this.id) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `TransactionModel "${transaction.modelId}" cannot be orchestrated by "${this.id}" model.`);
        }
        if (transaction.hasFinished()) {
            return;
        }
        const flow = transaction.getFlow();
        if (flow.state === types_1.TransactionState.NOT_STARTED) {
            flow.state = types_1.TransactionState.INVOKING;
            flow.startedAt = Date.now();
            if (this.options?.store) {
                await transaction.saveCheckpoint(flow.hasAsyncSteps ? 0 : TransactionOrchestrator.DEFAULT_TTL);
            }
            if (transaction.hasTimeout()) {
                await transaction.scheduleTransactionTimeout(transaction.getTimeout());
            }
            this.emit(types_1.DistributedTransactionEvent.BEGIN, { transaction });
        }
        else {
            this.emit(types_1.DistributedTransactionEvent.RESUME, { transaction });
        }
        await this.executeNext(transaction);
    }
    /**
     * Cancel and revert a transaction compensating all its executed steps. It can be an ongoing transaction or a completed one
     * @param transaction - The transaction to be reverted
     */
    async cancelTransaction(transaction) {
        if (transaction.modelId !== this.id) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `TransactionModel "${transaction.modelId}" cannot be orchestrated by "${this.id}" model.`);
        }
        const flow = transaction.getFlow();
        if (flow.state === types_1.TransactionState.FAILED) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `Cannot revert a permanent failed transaction.`);
        }
        flow.state = types_1.TransactionState.WAITING_TO_COMPENSATE;
        await this.executeNext(transaction);
    }
    createTransactionFlow(transactionId) {
        const [steps, features] = TransactionOrchestrator.buildSteps(this.definition);
        this.options ?? (this.options = {});
        const hasAsyncSteps = features.hasAsyncSteps;
        const hasStepTimeouts = features.hasStepTimeouts;
        const hasRetriesTimeout = features.hasRetriesTimeout;
        const hasTransactionTimeout = !!this.options.timeout;
        if (hasAsyncSteps) {
            this.options.store = true;
        }
        if (hasStepTimeouts || hasRetriesTimeout || hasTransactionTimeout) {
            this.options.store = true;
            this.options.storeExecution = true;
        }
        const flow = {
            modelId: this.id,
            options: this.options,
            transactionId: transactionId,
            hasAsyncSteps,
            hasFailedSteps: false,
            hasSkippedSteps: false,
            hasWaitingSteps: false,
            hasRevertedSteps: false,
            timedOutAt: null,
            state: types_1.TransactionState.NOT_STARTED,
            definition: this.definition,
            steps,
        };
        return flow;
    }
    static async loadTransactionById(modelId, transactionId) {
        const transaction = await distributed_transaction_1.DistributedTransaction.loadTransaction(modelId, transactionId);
        if (transaction !== null) {
            const flow = transaction.flow;
            const [steps] = TransactionOrchestrator.buildSteps(flow.definition, flow.steps);
            transaction.flow.steps = steps;
            return transaction;
        }
        return null;
    }
    static buildSteps(flow, existingSteps) {
        const states = {
            [TransactionOrchestrator.ROOT_STEP]: {
                id: TransactionOrchestrator.ROOT_STEP,
                next: [],
            },
        };
        const actionNames = new Set();
        const queue = [
            { obj: flow, level: [TransactionOrchestrator.ROOT_STEP] },
        ];
        const features = {
            hasAsyncSteps: false,
            hasStepTimeouts: false,
            hasRetriesTimeout: false,
        };
        while (queue.length > 0) {
            const { obj, level } = queue.shift();
            for (const key in obj) {
                // eslint-disable-next-line no-prototype-builtins
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    queue.push({ obj: obj[key], level: [...level] });
                }
                else if (key === "action") {
                    if (actionNames.has(obj.action)) {
                        throw new Error(`Action "${obj.action}" is already defined.`);
                    }
                    actionNames.add(obj.action);
                    level.push(obj.action);
                    const id = level.join(".");
                    const parent = level.slice(0, level.length - 1).join(".");
                    if (!existingSteps || parent === TransactionOrchestrator.ROOT_STEP) {
                        states[parent].next?.push(id);
                    }
                    const definitionCopy = { ...obj };
                    delete definitionCopy.next;
                    if (definitionCopy.async) {
                        features.hasAsyncSteps = true;
                    }
                    if (definitionCopy.timeout) {
                        features.hasStepTimeouts = true;
                    }
                    if (definitionCopy.retryInterval ||
                        definitionCopy.retryIntervalAwaiting) {
                        features.hasRetriesTimeout = true;
                    }
                    states[id] = Object.assign(new transaction_step_1.TransactionStep(), existingSteps?.[id] || {
                        id,
                        uuid: definitionCopy.uuid,
                        depth: level.length - 1,
                        definition: definitionCopy,
                        saveResponse: definitionCopy.saveResponse ?? true,
                        invoke: {
                            state: utils_1.TransactionStepState.NOT_STARTED,
                            status: types_1.TransactionStepStatus.IDLE,
                        },
                        compensate: {
                            state: utils_1.TransactionStepState.DORMANT,
                            status: types_1.TransactionStepStatus.IDLE,
                        },
                        attempts: 0,
                        failures: 0,
                        lastAttempt: null,
                        next: [],
                    });
                }
            }
        }
        return [states, features];
    }
    /** Create a new transaction
     * @param transactionId - unique identifier of the transaction
     * @param handler - function to handle action of the transaction
     * @param payload - payload to be passed to all the transaction steps
     */
    async beginTransaction(transactionId, handler, payload) {
        const existingTransaction = await TransactionOrchestrator.loadTransactionById(this.id, transactionId);
        let newTransaction = false;
        let modelFlow;
        if (!existingTransaction) {
            modelFlow = this.createTransactionFlow(transactionId);
            newTransaction = true;
        }
        else {
            modelFlow = existingTransaction.flow;
        }
        const transaction = new distributed_transaction_1.DistributedTransaction(modelFlow, handler, payload, existingTransaction?.errors, existingTransaction?.context);
        if (newTransaction && this.options?.store && this.options?.storeExecution) {
            await transaction.saveCheckpoint(modelFlow.hasAsyncSteps ? 0 : TransactionOrchestrator.DEFAULT_TTL);
        }
        return transaction;
    }
    /** Returns an existing transaction
     * @param transactionId - unique identifier of the transaction
     * @param handler - function to handle action of the transaction
     */
    async retrieveExistingTransaction(transactionId, handler) {
        const existingTransaction = await TransactionOrchestrator.loadTransactionById(this.id, transactionId);
        if (!existingTransaction) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Transaction ${transactionId} could not be found.`);
        }
        const transaction = new distributed_transaction_1.DistributedTransaction(existingTransaction.flow, handler, undefined, existingTransaction?.errors, existingTransaction?.context);
        return transaction;
    }
    static getStepByAction(flow, action) {
        for (const key in flow.steps) {
            if (action === flow.steps[key]?.definition?.action) {
                return flow.steps[key];
            }
        }
        return null;
    }
    static async getTransactionAndStepFromIdempotencyKey(responseIdempotencyKey, handler, transaction) {
        const [modelId, transactionId, action, actionType] = responseIdempotencyKey.split(TransactionOrchestrator.SEPARATOR);
        if (!transaction && !handler) {
            throw new Error("If a transaction is not provided, the handler is required");
        }
        if (!transaction) {
            const existingTransaction = await TransactionOrchestrator.loadTransactionById(modelId, transactionId);
            if (existingTransaction === null) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Transaction ${transactionId} could not be found.`);
            }
            transaction = new distributed_transaction_1.DistributedTransaction(existingTransaction.flow, handler, undefined, existingTransaction.errors, existingTransaction.context);
        }
        const step = TransactionOrchestrator.getStepByAction(transaction.getFlow(), action);
        if (step === null) {
            throw new Error("Action not found.");
        }
        else if (step.isCompensating()
            ? actionType !== types_1.TransactionHandlerType.COMPENSATE
            : actionType !== types_1.TransactionHandlerType.INVOKE) {
            throw new Error("Incorrect action type.");
        }
        return [transaction, step];
    }
    /** Register a step success for a specific transaction and step
     * @param responseIdempotencyKey - The idempotency key for the step
     * @param handler - The handler function to execute the step
     * @param transaction - The current transaction. If not provided it will be loaded based on the responseIdempotencyKey
     * @param response - The response of the step
     */
    async registerStepSuccess(responseIdempotencyKey, handler, transaction, response) {
        const [curTransaction, step] = await TransactionOrchestrator.getTransactionAndStepFromIdempotencyKey(responseIdempotencyKey, handler, transaction);
        if (step.getStates().status === types_1.TransactionStepStatus.WAITING) {
            this.emit(types_1.DistributedTransactionEvent.RESUME, {
                transaction: curTransaction,
            });
            await TransactionOrchestrator.setStepSuccess(curTransaction, step, response);
            await this.executeNext(curTransaction);
        }
        else {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `Cannot set step success when status is ${step.getStates().status}`);
        }
        return curTransaction;
    }
    /**
     * Register a step failure for a specific transaction and step
     * @param responseIdempotencyKey - The idempotency key for the step
     * @param error - The error that caused the failure
     * @param handler - The handler function to execute the step
     * @param transaction - The current transaction
     * @param response - The response of the step
     */
    async registerStepFailure(responseIdempotencyKey, error, handler, transaction) {
        const [curTransaction, step] = await TransactionOrchestrator.getTransactionAndStepFromIdempotencyKey(responseIdempotencyKey, handler, transaction);
        if (step.getStates().status === types_1.TransactionStepStatus.WAITING) {
            this.emit(types_1.DistributedTransactionEvent.RESUME, {
                transaction: curTransaction,
            });
            await TransactionOrchestrator.setStepFailure(curTransaction, step, error, 0);
            await this.executeNext(curTransaction);
        }
        else {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `Cannot set step failure when status is ${step.getStates().status}`);
        }
        return curTransaction;
    }
}
exports.TransactionOrchestrator = TransactionOrchestrator;
TransactionOrchestrator.ROOT_STEP = "_root";
TransactionOrchestrator.DEFAULT_TTL = 30;
TransactionOrchestrator.DEFAULT_RETRIES = 0;
TransactionOrchestrator.SEPARATOR = ":";
//# sourceMappingURL=transaction-orchestrator.js.map