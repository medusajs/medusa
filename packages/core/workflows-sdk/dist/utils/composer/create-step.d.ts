import { TransactionStepsDefinition } from "@medusajs/orchestration";
import { StepResponse } from "./helpers";
import { StepExecutionContext, StepFunction } from "./type";
/**
 * The type of invocation function passed to a step.
 *
 * @typeParam TInput - The type of the input that the function expects.
 * @typeParam TOutput - The type of the output that the function returns.
 * @typeParam TCompensateInput - The type of the input that the compensation function expects.
 *
 * @returns The expected output based on the type parameter `TOutput`.
 */
type InvokeFn<TInput, TOutput, TCompensateInput> = (
/**
 * The input of the step.
 */
input: TInput, 
/**
 * The step's context.
 */
context: StepExecutionContext) => void | StepResponse<TOutput, TCompensateInput extends undefined ? TOutput : TCompensateInput> | Promise<void | StepResponse<TOutput, TCompensateInput extends undefined ? TOutput : TCompensateInput>>;
/**
 * The type of compensation function passed to a step.
 *
 * @typeParam T -
 * The type of the argument passed to the compensation function. If not specified, then it will be the same type as the invocation function's output.
 *
 * @returns There's no expected type to be returned by the compensation function.
 */
type CompensateFn<T> = (
/**
 * The argument passed to the compensation function.
 */
input: T | undefined, 
/**
 * The step's context.
 */
context: StepExecutionContext) => unknown | Promise<unknown>;
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
export declare function createStep<TInvokeInput, TInvokeResultOutput, TInvokeResultCompensateInput>(
/**
 * The name of the step or its configuration.
 */
nameOrConfig: string | ({
    name: string;
} & Omit<TransactionStepsDefinition, "next" | "uuid" | "action">), 
/**
 * An invocation function that will be executed when the workflow is executed. The function must return an instance of {@link StepResponse}. The constructor of {@link StepResponse}
 * accepts the output of the step as a first argument, and optionally as a second argument the data to be passed to the compensation function as a parameter.
 */
invokeFn: InvokeFn<TInvokeInput, TInvokeResultOutput, TInvokeResultCompensateInput>, 
/**
 * A compensation function that's executed if an error occurs in the workflow. It's used to roll-back actions when errors occur.
 * It accepts as a parameter the second argument passed to the constructor of the {@link StepResponse} instance returned by the invocation function. If the
 * invocation function doesn't pass the second argument to `StepResponse` constructor, the compensation function receives the first argument
 * passed to the `StepResponse` constructor instead.
 */
compensateFn?: CompensateFn<TInvokeResultCompensateInput>): StepFunction<TInvokeInput, TInvokeResultOutput>;
export {};
