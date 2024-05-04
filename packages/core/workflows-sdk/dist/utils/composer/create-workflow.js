"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkflow = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const utils_1 = require("@medusajs/utils");
const helper_1 = require("../../helper");
const proxy_1 = require("./helpers/proxy");
const create_step_1 = require("./create-step");
const helpers_1 = require("./helpers");
global[utils_1.OrchestrationUtils.SymbolMedusaWorkflowComposerContext] = null;
/**
 * This function creates a workflow with the provided name and a constructor function.
 * The constructor function builds the workflow from steps created by the {@link createStep} function.
 * The returned workflow is an exported workflow of type {@link ReturnWorkflow}, meaning it's not executed right away. To execute it,
 * invoke the exported workflow, then run its `run` method.
 *
 * @typeParam TData - The type of the input passed to the composer function.
 * @typeParam TResult - The type of the output returned by the composer function.
 * @typeParam THooks - The type of hooks defined in the workflow.
 *
 * @returns The created workflow. You can later execute the workflow by invoking it, then using its `run` method.
 *
 * @example
 * import { createWorkflow } from "@medusajs/workflows-sdk"
 * import { MedusaRequest, MedusaResponse, Product } from "@medusajs/medusa"
 * import {
 *   createProductStep,
 *   getProductStep,
 *   createPricesStep
 * } from "./steps"
 *
 * interface WorkflowInput {
 *  title: string
 * }
 *
 * const myWorkflow = createWorkflow<
 *     WorkflowInput,
 *     Product
 *   >("my-workflow", (input) => {
 *    // Everything here will be executed and resolved later
 *    // during the execution. Including the data access.
 *
 *     const product = createProductStep(input)
 *     const prices = createPricesStep(product)
 *     return getProductStep(product.id)
 *   }
 * )
 *
 * export async function GET(
 *   req: MedusaRequest,
 *   res: MedusaResponse
 * ) {
 *   const { result: product } = await myWorkflow(req.scope)
 *     .run({
 *       input: {
 *         title: "Shirt"
 *       }
 *     })
 *
 *   res.json({
 *     product
 *   })
 * }
 */
function createWorkflow(
/**
 * The name of the workflow or its configuration.
 */
nameOrConfig, 
/**
 * The constructor function that is executed when the `run` method in {@link ReturnWorkflow} is used.
 * The function can't be an arrow function or an asynchronus function. It also can't directly manipulate data.
 * You'll have to use the {@link transform} function if you need to directly manipulate data.
 */
composer) {
    const name = (0, utils_1.isString)(nameOrConfig) ? nameOrConfig : nameOrConfig.name;
    const options = (0, utils_1.isString)(nameOrConfig) ? {} : nameOrConfig;
    const handlers = new Map();
    if (orchestration_1.WorkflowManager.getWorkflow(name)) {
        orchestration_1.WorkflowManager.unregister(name);
    }
    orchestration_1.WorkflowManager.register(name, undefined, handlers, options);
    const context = {
        workflowId: name,
        flow: orchestration_1.WorkflowManager.getTransactionDefinition(name),
        handlers,
        hooks_: [],
        hooksCallback_: {},
        hookBinder: (name, fn) => {
            context.hooks_.push(name);
            return fn(context);
        },
        stepBinder: (fn) => {
            return fn.bind(context)();
        },
        parallelizeBinder: (fn) => {
            return fn.bind(context)();
        },
    };
    global[utils_1.OrchestrationUtils.SymbolMedusaWorkflowComposerContext] = context;
    const inputPlaceHolder = (0, proxy_1.proxify)({
        __type: utils_1.OrchestrationUtils.SymbolInputReference,
        __step__: "",
        config: () => {
            // TODO: config default value?
            throw new Error("Config is not available for the input object.");
        },
    });
    const returnedStep = composer.apply(context, [inputPlaceHolder]);
    delete global[utils_1.OrchestrationUtils.SymbolMedusaWorkflowComposerContext];
    orchestration_1.WorkflowManager.update(name, context.flow, handlers, options);
    const workflow = (0, helper_1.exportWorkflow)(name, returnedStep, undefined, {
        wrappedInput: true,
    });
    const mainFlow = (container) => {
        const workflow_ = workflow(container);
        const expandedFlow = workflow_;
        expandedFlow.config = (config) => {
            workflow_.setOptions(config);
        };
        return expandedFlow;
    };
    let shouldRegisterHookHandler = true;
    for (const hook of context.hooks_) {
        mainFlow[hook] = (fn) => {
            var _a;
            (_a = context.hooksCallback_)[hook] ?? (_a[hook] = []);
            if (!shouldRegisterHookHandler) {
                console.warn(`A hook handler has already been registered for the ${hook} hook. The current handler registration will be skipped.`);
                return;
            }
            context.hooksCallback_[hook].push(fn);
            shouldRegisterHookHandler = false;
        };
    }
    mainFlow.getName = () => name;
    mainFlow.run = mainFlow().run;
    mainFlow.runAsStep = ({ input, }) => {
        // TODO: Async sub workflow is not supported yet
        // Info: Once the export workflow can fire the execution through the engine if loaded, the async workflow can be executed,
        // the step would inherit the async configuration and subscribe to the onFinish event of the sub worklow and mark itself as success or failure
        return (0, create_step_1.createStep)(`${name}-as-step`, async (stepInput, stepContext) => {
            const { container, ...sharedContext } = stepContext;
            const transaction = await workflow.run({
                input: stepInput,
                container,
                context: sharedContext,
            });
            return new helpers_1.StepResponse(transaction.result, transaction);
        }, async (transaction, { container }) => {
            if (!transaction) {
                return;
            }
            await workflow(container).cancel(transaction);
        })(input);
    };
    return mainFlow;
}
exports.createWorkflow = createWorkflow;
//# sourceMappingURL=create-workflow.js.map