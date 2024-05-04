import { TransactionModelOptions } from "@medusajs/orchestration";
import { ReturnWorkflow, WorkflowData, WorkflowDataProperties } from "./type";
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
export declare function createWorkflow<TData, TResult, THooks extends Record<string, Function> = Record<string, Function>>(
/**
 * The name of the workflow or its configuration.
 */
nameOrConfig: string | ({
    name: string;
} & TransactionModelOptions), 
/**
 * The constructor function that is executed when the `run` method in {@link ReturnWorkflow} is used.
 * The function can't be an arrow function or an asynchronus function. It also can't directly manipulate data.
 * You'll have to use the {@link transform} function if you need to directly manipulate data.
 */
composer: (input: WorkflowData<TData>) => void | WorkflowData<TResult> | {
    [K in keyof TResult]: WorkflowData<TResult[K]> | WorkflowDataProperties<TResult[K]>;
}): ReturnWorkflow<TData, TResult, THooks>;
