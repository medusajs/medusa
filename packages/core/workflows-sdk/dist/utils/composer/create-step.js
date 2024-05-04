"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStep = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const utils_1 = require("@medusajs/utils");
const ulid_1 = require("ulid");
const helpers_1 = require("./helpers");
const proxy_1 = require("./helpers/proxy");
/**
 * @internal
 *
 * Internal function to create the invoke and compensate handler for a step.
 * This is where the inputs and context are passed to the underlying invoke and compensate function.
 *
 * @param stepName
 * @param stepConfig
 * @param input
 * @param invokeFn
 * @param compensateFn
 */
function applyStep({ stepName, stepConfig = {}, input, invokeFn, compensateFn, }) {
    return function () {
        if (!this.workflowId) {
            throw new Error("createStep must be used inside a createWorkflow definition");
        }
        const handler = {
            invoke: async (stepArguments) => {
                const metadata = stepArguments.metadata;
                const idempotencyKey = metadata.idempotency_key;
                stepArguments.context.idempotencyKey = idempotencyKey;
                const executionContext = {
                    workflowId: metadata.model_id,
                    stepName: metadata.action,
                    action: "invoke",
                    idempotencyKey,
                    attempt: metadata.attempt,
                    container: stepArguments.container,
                    metadata,
                    context: stepArguments.context,
                };
                const argInput = input ? await (0, helpers_1.resolveValue)(input, stepArguments) : {};
                const stepResponse = await invokeFn.apply(this, [argInput, executionContext]);
                const stepResponseJSON = stepResponse?.__type === utils_1.OrchestrationUtils.SymbolWorkflowStepResponse
                    ? stepResponse.toJSON()
                    : stepResponse;
                return {
                    __type: utils_1.OrchestrationUtils.SymbolWorkflowWorkflowData,
                    output: stepResponseJSON,
                };
            },
            compensate: compensateFn
                ? async (stepArguments) => {
                    const metadata = stepArguments.metadata;
                    const idempotencyKey = metadata.idempotency_key;
                    stepArguments.context.idempotencyKey = idempotencyKey;
                    const executionContext = {
                        workflowId: metadata.model_id,
                        stepName: metadata.action,
                        action: "compensate",
                        idempotencyKey,
                        attempt: metadata.attempt,
                        container: stepArguments.container,
                        metadata,
                        context: stepArguments.context,
                    };
                    const stepOutput = stepArguments.invoke[stepName]?.output;
                    const invokeResult = stepOutput?.__type ===
                        utils_1.OrchestrationUtils.SymbolWorkflowStepResponse
                        ? stepOutput.compensateInput &&
                            (0, utils_1.deepCopy)(stepOutput.compensateInput)
                        : stepOutput && (0, utils_1.deepCopy)(stepOutput);
                    const args = [invokeResult, executionContext];
                    const output = await compensateFn.apply(this, args);
                    return {
                        output,
                    };
                }
                : undefined,
        };
        wrapAsyncHandler(stepConfig, handler);
        stepConfig.uuid = (0, ulid_1.ulid)();
        stepConfig.noCompensation = !compensateFn;
        this.flow.addAction(stepName, stepConfig);
        if (!this.handlers.has(stepName)) {
            this.handlers.set(stepName, handler);
        }
        const ret = {
            __type: utils_1.OrchestrationUtils.SymbolWorkflowStep,
            __step__: stepName,
            config: (localConfig) => {
                const newStepName = localConfig.name ?? stepName;
                delete localConfig.name;
                this.handlers.set(newStepName, handler);
                this.flow.replaceAction(stepConfig.uuid, newStepName, {
                    ...stepConfig,
                    ...localConfig,
                });
                ret.__step__ = newStepName;
                orchestration_1.WorkflowManager.update(this.workflowId, this.flow, this.handlers);
                return (0, proxy_1.proxify)(ret);
            },
        };
        return (0, proxy_1.proxify)(ret);
    };
}
/**
 * @internal
 *
 * Internal function to handle async steps to be automatically marked as completed after they are executed.
 *
 * @param stepConfig
 * @param handle
 */
function wrapAsyncHandler(stepConfig, handle) {
    if (stepConfig.async) {
        if (typeof handle.invoke === "function") {
            const originalInvoke = handle.invoke;
            handle.invoke = async (stepArguments) => {
                const response = (await originalInvoke(stepArguments));
                if (response?.output?.__type !==
                    utils_1.OrchestrationUtils.SymbolWorkflowStepResponse) {
                    return;
                }
                stepArguments.step.definition.backgroundExecution = true;
                return response;
            };
        }
    }
    if (stepConfig.compensateAsync) {
        if (typeof handle.compensate === "function") {
            const originalCompensate = handle.compensate;
            handle.compensate = async (stepArguments) => {
                const response = (await originalCompensate(stepArguments));
                if (response?.output?.__type !==
                    utils_1.OrchestrationUtils.SymbolWorkflowStepResponse) {
                    return;
                }
                stepArguments.step.definition.backgroundExecution = true;
                return response;
            };
        }
    }
}
/**
 * This function creates a {@link StepFunction} that can be used as a step in a workflow constructed by the {@link createWorkflow} function.
 *
 * @typeParam TInvokeInput - The type of the expected input parameter to the invocation function.
 * @typeParam TInvokeResultOutput - The type of the expected output parameter of the invocation function.
 * @typeParam TInvokeResultCompensateInput - The type of the expected input parameter to the compensation function.
 *
 * @returns A step function to be used in a workflow.
 *
 * @example
 * import {
 *   createStep,
 *   StepResponse,
 *   StepExecutionContext,
 *   WorkflowData
 * } from "@medusajs/workflows-sdk"
 *
 * interface CreateProductInput {
 *   title: string
 * }
 *
 * export const createProductStep = createStep(
 *   "createProductStep",
 *   async function (
 *     input: CreateProductInput,
 *     context
 *   ) {
 *     const productService = context.container.resolve(
 *       "productService"
 *     )
 *     const product = await productService.create(input)
 *     return new StepResponse({
 *       product
 *     }, {
 *       product_id: product.id
 *     })
 *   },
 *   async function (
 *     input,
 *     context
 *   ) {
 *     const productService = context.container.resolve(
 *       "productService"
 *     )
 *     await productService.delete(input.product_id)
 *   }
 * )
 */
function createStep(
/**
 * The name of the step or its configuration.
 */
nameOrConfig, 
/**
 * An invocation function that will be executed when the workflow is executed. The function must return an instance of {@link StepResponse}. The constructor of {@link StepResponse}
 * accepts the output of the step as a first argument, and optionally as a second argument the data to be passed to the compensation function as a parameter.
 */
invokeFn, 
/**
 * A compensation function that's executed if an error occurs in the workflow. It's used to roll-back actions when errors occur.
 * It accepts as a parameter the second argument passed to the constructor of the {@link StepResponse} instance returned by the invocation function. If the
 * invocation function doesn't pass the second argument to `StepResponse` constructor, the compensation function receives the first argument
 * passed to the `StepResponse` constructor instead.
 */
compensateFn) {
    const stepName = ((0, utils_1.isString)(nameOrConfig) ? nameOrConfig : nameOrConfig.name) ?? invokeFn.name;
    const config = (0, utils_1.isString)(nameOrConfig) ? {} : nameOrConfig;
    const returnFn = function (input) {
        if (!global[utils_1.OrchestrationUtils.SymbolMedusaWorkflowComposerContext]) {
            throw new Error("createStep must be used inside a createWorkflow definition");
        }
        const stepBinder = global[utils_1.OrchestrationUtils.SymbolMedusaWorkflowComposerContext].stepBinder;
        return stepBinder(applyStep({
            stepName,
            stepConfig: config,
            input,
            invokeFn,
            compensateFn,
        }));
    };
    returnFn.__type = utils_1.OrchestrationUtils.SymbolWorkflowStepBind;
    returnFn.__step__ = stepName;
    return returnFn;
}
exports.createStep = createStep;
//# sourceMappingURL=create-step.js.map