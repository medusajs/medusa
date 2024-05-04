"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowOrchestratorService = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const ulid_1 = require("ulid");
const AnySubscriber = "any";
class WorkflowOrchestratorService {
    constructor({ dataLoaderOnly, redisDistributedTransactionStorage, redisPublisher, redisSubscriber, logger, }) {
        this.instanceId = (0, ulid_1.ulid)();
        this.subscribers = new Map();
        this.activeStepsCount = 0;
        this.redisPublisher = redisPublisher;
        this.redisSubscriber = redisSubscriber;
        this.logger = logger;
        redisDistributedTransactionStorage.setWorkflowOrchestratorService(this);
        if (!dataLoaderOnly) {
            orchestration_1.DistributedTransaction.setStorage(redisDistributedTransactionStorage);
        }
        this.redisDistributedTransactionStorage_ =
            redisDistributedTransactionStorage;
        this.redisSubscriber.on("message", async (_, message) => {
            const { instanceId, data } = JSON.parse(message);
            await this.notify(data, false, instanceId);
        });
    }
    async onApplicationShutdown() {
        await this.redisDistributedTransactionStorage_.onApplicationShutdown();
    }
    async onApplicationPrepareShutdown() {
        // eslint-disable-next-line max-len
        await this.redisDistributedTransactionStorage_.onApplicationPrepareShutdown();
        while (this.activeStepsCount > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    async run(workflowIdOrWorkflow, options, sharedContext = {}) {
        let { input, context, transactionId, resultFrom, throwOnError, events: eventHandlers, container, } = options ?? {};
        const workflowId = (0, utils_1.isString)(workflowIdOrWorkflow)
            ? workflowIdOrWorkflow
            : workflowIdOrWorkflow.getName();
        if (!workflowId) {
            throw new Error("Workflow ID is required");
        }
        context ?? (context = {});
        context.transactionId ?? (context.transactionId = transactionId ?? (0, ulid_1.ulid)());
        const events = this.buildWorkflowEvents({
            customEventHandlers: eventHandlers,
            workflowId,
            transactionId: context.transactionId,
        });
        const exportedWorkflow = workflows_sdk_1.MedusaWorkflow.getWorkflow(workflowId);
        if (!exportedWorkflow) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        const flow = exportedWorkflow(container);
        const ret = await flow.run({
            input,
            throwOnError,
            resultFrom,
            context,
            events,
        });
        // TODO: temporary
        const acknowledgement = {
            transactionId: context.transactionId,
            workflowId: workflowId,
        };
        if (ret.transaction.hasFinished()) {
            const { result, errors } = ret;
            await this.notify({
                eventType: "onFinish",
                workflowId,
                transactionId: context.transactionId,
                result,
                errors,
            });
        }
        return { acknowledgement, ...ret };
    }
    async getRunningTransaction(workflowId, transactionId, options, sharedContext = {}) {
        let { context, container } = options ?? {};
        if (!workflowId) {
            throw new Error("Workflow ID is required");
        }
        if (!transactionId) {
            throw new Error("TransactionId ID is required");
        }
        context ?? (context = {});
        context.transactionId ?? (context.transactionId = transactionId);
        const exportedWorkflow = workflows_sdk_1.MedusaWorkflow.getWorkflow(workflowId);
        if (!exportedWorkflow) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        const flow = exportedWorkflow(container);
        const transaction = await flow.getRunningTransaction(transactionId, context);
        return transaction;
    }
    async setStepSuccess({ idempotencyKey, stepResponse, options, }, sharedContext = {}) {
        const { context, throwOnError, resultFrom, container, events: eventHandlers, } = options ?? {};
        const [idempotencyKey_, { workflowId, transactionId }] = this.buildIdempotencyKeyAndParts(idempotencyKey);
        const exportedWorkflow = workflows_sdk_1.MedusaWorkflow.getWorkflow(workflowId);
        if (!exportedWorkflow) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        const flow = exportedWorkflow(container);
        const events = this.buildWorkflowEvents({
            customEventHandlers: eventHandlers,
            transactionId,
            workflowId,
        });
        const ret = await flow.registerStepSuccess({
            idempotencyKey: idempotencyKey_,
            context,
            resultFrom,
            throwOnError,
            events,
            response: stepResponse,
        });
        if (ret.transaction.hasFinished()) {
            const { result, errors } = ret;
            await this.notify({
                eventType: "onFinish",
                workflowId,
                transactionId,
                result,
                errors,
            });
        }
        return ret;
    }
    async setStepFailure({ idempotencyKey, stepResponse, options, }, sharedContext = {}) {
        const { context, throwOnError, resultFrom, container, events: eventHandlers, } = options ?? {};
        const [idempotencyKey_, { workflowId, transactionId }] = this.buildIdempotencyKeyAndParts(idempotencyKey);
        const exportedWorkflow = workflows_sdk_1.MedusaWorkflow.getWorkflow(workflowId);
        if (!exportedWorkflow) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        const flow = exportedWorkflow(container);
        const events = this.buildWorkflowEvents({
            customEventHandlers: eventHandlers,
            transactionId,
            workflowId,
        });
        const ret = await flow.registerStepFailure({
            idempotencyKey: idempotencyKey_,
            context,
            resultFrom,
            throwOnError,
            events,
            response: stepResponse,
        });
        if (ret.transaction.hasFinished()) {
            const { result, errors } = ret;
            await this.notify({
                eventType: "onFinish",
                workflowId,
                transactionId,
                result,
                errors,
            });
        }
        return ret;
    }
    subscribe({ workflowId, transactionId, subscriber, subscriberId }, sharedContext = {}) {
        subscriber._id = subscriberId;
        const subscribers = this.subscribers.get(workflowId) ?? new Map();
        // Subscribe instance to redis
        if (!this.subscribers.has(workflowId)) {
            void this.redisSubscriber.subscribe(this.getChannelName(workflowId));
        }
        const handlerIndex = (handlers) => {
            return handlers.indexOf((s) => s === subscriber || s._id === subscriberId);
        };
        if (transactionId) {
            const transactionSubscribers = subscribers.get(transactionId) ?? [];
            const subscriberIndex = handlerIndex(transactionSubscribers);
            if (subscriberIndex !== -1) {
                transactionSubscribers.slice(subscriberIndex, 1);
            }
            transactionSubscribers.push(subscriber);
            subscribers.set(transactionId, transactionSubscribers);
            this.subscribers.set(workflowId, subscribers);
            return;
        }
        const workflowSubscribers = subscribers.get(AnySubscriber) ?? [];
        const subscriberIndex = handlerIndex(workflowSubscribers);
        if (subscriberIndex !== -1) {
            workflowSubscribers.slice(subscriberIndex, 1);
        }
        workflowSubscribers.push(subscriber);
        subscribers.set(AnySubscriber, workflowSubscribers);
        this.subscribers.set(workflowId, subscribers);
    }
    unsubscribe({ workflowId, transactionId, subscriberOrId }, sharedContext = {}) {
        const subscribers = this.subscribers.get(workflowId) ?? new Map();
        const filterSubscribers = (handlers) => {
            return handlers.filter((handler) => {
                return handler._id
                    ? handler._id !== subscriberOrId
                    : handler !== subscriberOrId;
            });
        };
        // Unsubscribe instance
        if (!this.subscribers.has(workflowId)) {
            void this.redisSubscriber.unsubscribe(this.getChannelName(workflowId));
        }
        if (transactionId) {
            const transactionSubscribers = subscribers.get(transactionId) ?? [];
            const newTransactionSubscribers = filterSubscribers(transactionSubscribers);
            subscribers.set(transactionId, newTransactionSubscribers);
            this.subscribers.set(workflowId, subscribers);
            return;
        }
        const workflowSubscribers = subscribers.get(AnySubscriber) ?? [];
        const newWorkflowSubscribers = filterSubscribers(workflowSubscribers);
        subscribers.set(AnySubscriber, newWorkflowSubscribers);
        this.subscribers.set(workflowId, subscribers);
    }
    async notify(options, publish = true, instanceId = this.instanceId) {
        if (!publish && instanceId === this.instanceId) {
            return;
        }
        if (publish) {
            const channel = this.getChannelName(options.workflowId);
            const message = JSON.stringify({
                instanceId: this.instanceId,
                data: options,
            });
            await this.redisPublisher.publish(channel, message);
        }
        const { eventType, workflowId, transactionId, errors, result, step, response, } = options;
        const subscribers = this.subscribers.get(workflowId) ?? new Map();
        const notifySubscribers = (handlers) => {
            handlers.forEach((handler) => {
                handler({
                    eventType,
                    workflowId,
                    transactionId,
                    step,
                    response,
                    result,
                    errors,
                });
            });
        };
        if (transactionId) {
            const transactionSubscribers = subscribers.get(transactionId) ?? [];
            notifySubscribers(transactionSubscribers);
        }
        const workflowSubscribers = subscribers.get(AnySubscriber) ?? [];
        notifySubscribers(workflowSubscribers);
    }
    getChannelName(workflowId) {
        return `orchestrator:${workflowId}`;
    }
    buildWorkflowEvents({ customEventHandlers, workflowId, transactionId, }) {
        const notify = async ({ eventType, step, result, response, errors, }) => {
            await this.notify({
                workflowId,
                transactionId,
                eventType,
                response,
                step,
                result,
                errors,
            });
        };
        return {
            onTimeout: async ({ transaction }) => {
                customEventHandlers?.onTimeout?.({ transaction });
                await notify({ eventType: "onTimeout" });
            },
            onBegin: async ({ transaction }) => {
                customEventHandlers?.onBegin?.({ transaction });
                await notify({ eventType: "onBegin" });
            },
            onResume: async ({ transaction }) => {
                customEventHandlers?.onResume?.({ transaction });
                await notify({ eventType: "onResume" });
            },
            onCompensateBegin: async ({ transaction }) => {
                customEventHandlers?.onCompensateBegin?.({ transaction });
                await notify({ eventType: "onCompensateBegin" });
            },
            onFinish: async ({ transaction, result, errors }) => {
                // TODO: unsubscribe transaction handlers on finish
                customEventHandlers?.onFinish?.({ transaction, result, errors });
            },
            onStepBegin: async ({ step, transaction }) => {
                customEventHandlers?.onStepBegin?.({ step, transaction });
                this.activeStepsCount++;
                await notify({ eventType: "onStepBegin", step });
            },
            onStepSuccess: async ({ step, transaction }) => {
                const stepName = step.definition.action;
                const response = await (0, workflows_sdk_1.resolveValue)(transaction.getContext().invoke[stepName], transaction);
                customEventHandlers?.onStepSuccess?.({ step, transaction, response });
                await notify({ eventType: "onStepSuccess", step, response });
                this.activeStepsCount--;
            },
            onStepFailure: async ({ step, transaction }) => {
                const stepName = step.definition.action;
                const errors = transaction
                    .getErrors(orchestration_1.TransactionHandlerType.INVOKE)
                    .filter((err) => err.action === stepName);
                customEventHandlers?.onStepFailure?.({ step, transaction, errors });
                await notify({ eventType: "onStepFailure", step, errors });
                this.activeStepsCount--;
            },
            onStepAwaiting: async ({ step, transaction }) => {
                customEventHandlers?.onStepAwaiting?.({ step, transaction });
                await notify({ eventType: "onStepAwaiting", step });
                this.activeStepsCount--;
            },
            onCompensateStepSuccess: async ({ step, transaction }) => {
                const stepName = step.definition.action;
                const response = transaction.getContext().compensate[stepName];
                customEventHandlers?.onCompensateStepSuccess?.({
                    step,
                    transaction,
                    response,
                });
                await notify({ eventType: "onCompensateStepSuccess", step, response });
            },
            onCompensateStepFailure: async ({ step, transaction }) => {
                const stepName = step.definition.action;
                const errors = transaction
                    .getErrors(orchestration_1.TransactionHandlerType.COMPENSATE)
                    .filter((err) => err.action === stepName);
                customEventHandlers?.onStepFailure?.({ step, transaction, errors });
                await notify({ eventType: "onCompensateStepFailure", step, errors });
            },
        };
    }
    buildIdempotencyKeyAndParts(idempotencyKey) {
        const parts = {
            workflowId: "",
            transactionId: "",
            stepId: "",
            action: "invoke",
        };
        let idempotencyKey_ = idempotencyKey;
        const setParts = (workflowId, transactionId, stepId, action) => {
            parts.workflowId = workflowId;
            parts.transactionId = transactionId;
            parts.stepId = stepId;
            parts.action = action;
        };
        if (!(0, utils_1.isString)(idempotencyKey)) {
            const { workflowId, transactionId, stepId, action } = idempotencyKey;
            idempotencyKey_ = [workflowId, transactionId, stepId, action].join(":");
            setParts(workflowId, transactionId, stepId, action);
        }
        else {
            const [workflowId, transactionId, stepId, action] = idempotencyKey_.split(":");
            setParts(workflowId, transactionId, stepId, action);
        }
        return [idempotencyKey_, parts];
    }
}
exports.WorkflowOrchestratorService = WorkflowOrchestratorService;
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowOrchestratorService.prototype, "run", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(3, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowOrchestratorService.prototype, "getRunningTransaction", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowOrchestratorService.prototype, "setStepSuccess", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowOrchestratorService.prototype, "setStepFailure", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WorkflowOrchestratorService.prototype, "subscribe", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WorkflowOrchestratorService.prototype, "unsubscribe", null);
