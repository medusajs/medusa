"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportWorkflow = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const os_1 = require("os");
const ulid_1 = require("ulid");
const medusa_workflow_1 = require("../medusa-workflow");
const composer_1 = require("../utils/composer");
function createContextualWorkflowRunner({ workflowId, defaultResult, dataPreparation, options, container, }) {
    const flow = new orchestration_1.LocalWorkflow(workflowId, container);
    const originalRun = flow.run.bind(flow);
    const originalRegisterStepSuccess = flow.registerStepSuccess.bind(flow);
    const originalRegisterStepFailure = flow.registerStepFailure.bind(flow);
    const originalCancel = flow.cancel.bind(flow);
    const originalExecution = async (method, { throwOnError, resultFrom, isCancel = false, container: executionContainer, }, ...args) => {
        if (!executionContainer && !flow.container) {
            executionContainer = modules_sdk_1.MedusaModule.getLoadedModules().map((mod) => Object.values(mod)[0]);
        }
        if (!flow.container) {
            flow.container = executionContainer;
        }
        const transaction = await method.apply(method, args);
        let errors = transaction.getErrors(orchestration_1.TransactionHandlerType.INVOKE);
        const failedStatus = [orchestration_1.TransactionState.FAILED, orchestration_1.TransactionState.REVERTED];
        const isCancelled = isCancel && transaction.getState() === orchestration_1.TransactionState.REVERTED;
        if (!isCancelled &&
            failedStatus.includes(transaction.getState()) &&
            throwOnError) {
            const errorMessage = errors
                ?.map((err) => `${err.error?.message}${os_1.EOL}${err.error?.stack}`)
                ?.join(`${os_1.EOL}`);
            throw new Error(errorMessage);
        }
        let result;
        if (options?.wrappedInput) {
            result = (0, composer_1.resolveValue)(resultFrom, transaction.getContext());
            if (result instanceof Promise) {
                result = await result.catch((e) => {
                    errors ?? (errors = []);
                    errors.push(e);
                });
            }
        }
        else {
            result = transaction.getContext().invoke?.[resultFrom];
        }
        return {
            errors,
            transaction,
            result,
        };
    };
    const newRun = async ({ input, context: outerContext, throwOnError, resultFrom, events, container, } = {
        throwOnError: true,
        resultFrom: defaultResult,
    }) => {
        resultFrom ?? (resultFrom = defaultResult);
        throwOnError ?? (throwOnError = true);
        const context = {
            ...outerContext,
            __type: utils_1.MedusaContextType,
        };
        context.transactionId ?? (context.transactionId = (0, ulid_1.ulid)());
        if (typeof dataPreparation === "function") {
            try {
                const copyInput = input ? JSON.parse(JSON.stringify(input)) : input;
                input = await dataPreparation(copyInput);
            }
            catch (err) {
                if (throwOnError) {
                    throw new Error(`Data preparation failed: ${err.message}${os_1.EOL}${err.stack}`);
                }
                return {
                    errors: [err],
                };
            }
        }
        return await originalExecution(originalRun, { throwOnError, resultFrom, container }, context.transactionId, input, context, events);
    };
    flow.run = newRun;
    const newRegisterStepSuccess = async ({ response, idempotencyKey, context: outerContext, throwOnError, resultFrom, events, container, } = {
        idempotencyKey: "",
        throwOnError: true,
        resultFrom: defaultResult,
    }) => {
        resultFrom ?? (resultFrom = defaultResult);
        throwOnError ?? (throwOnError = true);
        const [, transactionId] = idempotencyKey.split(":");
        const context = {
            ...outerContext,
            transactionId,
            __type: utils_1.MedusaContextType,
        };
        return await originalExecution(originalRegisterStepSuccess, { throwOnError, resultFrom, container }, idempotencyKey, response, context, events);
    };
    flow.registerStepSuccess = newRegisterStepSuccess;
    const newRegisterStepFailure = async ({ response, idempotencyKey, context: outerContext, throwOnError, resultFrom, events, container, } = {
        idempotencyKey: "",
        throwOnError: true,
        resultFrom: defaultResult,
    }) => {
        resultFrom ?? (resultFrom = defaultResult);
        throwOnError ?? (throwOnError = true);
        const [, transactionId] = idempotencyKey.split(":");
        const context = {
            ...outerContext,
            transactionId,
            __type: utils_1.MedusaContextType,
        };
        return await originalExecution(originalRegisterStepFailure, { throwOnError, resultFrom, container }, idempotencyKey, response, context, events);
    };
    flow.registerStepFailure = newRegisterStepFailure;
    const newCancel = async ({ transaction, transactionId, context: outerContext, throwOnError, events, container, } = {
        throwOnError: true,
    }) => {
        throwOnError ?? (throwOnError = true);
        const context = {
            ...outerContext,
            transactionId,
            __type: utils_1.MedusaContextType,
        };
        return await originalExecution(originalCancel, {
            throwOnError,
            resultFrom: undefined,
            isCancel: true,
            container,
        }, transaction ?? transactionId, context, events);
    };
    flow.cancel = newCancel;
    return flow;
}
const exportWorkflow = (workflowId, defaultResult, dataPreparation, options) => {
    function exportedWorkflow(
    // TODO: rm when all usage have been migrated
    container) {
        return createContextualWorkflowRunner({
            workflowId,
            defaultResult,
            dataPreparation,
            options,
            container,
        });
    }
    const buildRunnerFn = (action, container) => {
        const contextualRunner = createContextualWorkflowRunner({
            workflowId,
            defaultResult,
            dataPreparation,
            options,
            container,
        });
        return contextualRunner[action];
    };
    exportedWorkflow.run = async (args) => {
        const container = args?.container;
        delete args?.container;
        const inputArgs = { ...args };
        return await buildRunnerFn("run", container)(inputArgs);
    };
    exportedWorkflow.registerStepSuccess = async (args) => {
        const container = args?.container;
        delete args?.container;
        const inputArgs = { ...args };
        return await buildRunnerFn("registerStepSuccess", container)(inputArgs);
    };
    exportedWorkflow.registerStepFailure = async (args) => {
        const container = args?.container;
        delete args?.container;
        const inputArgs = { ...args };
        return await buildRunnerFn("registerStepFailure", container)(inputArgs);
    };
    exportedWorkflow.cancel = async (args) => {
        const container = args?.container;
        delete args?.container;
        const inputArgs = { ...args };
        return await buildRunnerFn("cancel", container)(inputArgs);
    };
    medusa_workflow_1.MedusaWorkflow.registerWorkflow(workflowId, exportedWorkflow);
    return exportedWorkflow;
};
exports.exportWorkflow = exportWorkflow;
//# sourceMappingURL=workflow-export.js.map