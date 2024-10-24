import {
  TransactionStepsDefinition,
  WorkflowManager,
  WorkflowStepHandler,
  WorkflowStepHandlerArguments,
} from "@medusajs/orchestration"
import { isString, OrchestrationUtils } from "@medusajs/utils"
import { ulid } from "ulid"
import { resolveValue, StepResponse } from "./helpers"
import { createStepHandler } from "./helpers/create-step-handler"
import { proxify } from "./helpers/proxy"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  StepFunction,
  StepFunctionResult,
  WorkflowData,
} from "./type"

/**
 * The type of invocation function passed to a step.
 *
 * @typeParam TInput - The type of the input that the function expects.
 * @typeParam TOutput - The type of the output that the function returns.
 * @typeParam TCompensateInput - The type of the input that the compensation function expects.
 *
 * @returns The expected output based on the type parameter `TOutput`.
 */
export type InvokeFn<TInput, TOutput, TCompensateInput> = (
  /**
   * The input of the step.
   */
  input: TInput,
  /**
   * The step's context.
   */
  context: StepExecutionContext
) =>
  | void
  | StepResponse<
      TOutput,
      TCompensateInput extends undefined ? TOutput : TCompensateInput
    >
  | Promise<void | StepResponse<
      TOutput,
      TCompensateInput extends undefined ? TOutput : TCompensateInput
    >>

/**
 * The type of compensation function passed to a step.
 *
 * @typeParam T -
 * The type of the argument passed to the compensation function. If not specified, then it will be the same type as the invocation function's output.
 *
 * @returns There's no expected type to be returned by the compensation function.
 */
export type CompensateFn<T> = (
  /**
   * The argument passed to the compensation function.
   */
  input: T | undefined,
  /**
   * The step's context.
   */
  context: StepExecutionContext
) => unknown | Promise<unknown>

export type LocalStepConfig = { name?: string } & Omit<
  TransactionStepsDefinition,
  "next" | "uuid" | "action"
>

export interface ApplyStepOptions<
  TStepInputs extends {
    [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]>
  },
  TInvokeInput,
  TInvokeResultOutput,
  TInvokeResultCompensateInput
> {
  stepName: string
  stepConfig?: TransactionStepsDefinition
  input?: TStepInputs
  invokeFn: InvokeFn<
    TInvokeInput,
    TInvokeResultOutput,
    TInvokeResultCompensateInput
  >
  compensateFn?: CompensateFn<TInvokeResultCompensateInput>
}

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
export function applyStep<
  TInvokeInput,
  TStepInput extends {
    [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]>
  },
  TInvokeResultOutput,
  TInvokeResultCompensateInput
>({
  stepName,
  stepConfig = {},
  input,
  invokeFn,
  compensateFn,
}: ApplyStepOptions<
  TStepInput,
  TInvokeInput,
  TInvokeResultOutput,
  TInvokeResultCompensateInput
>): StepFunctionResult<TInvokeResultOutput> {
  return function (this: CreateWorkflowComposerContext) {
    if (
      this.__type !== OrchestrationUtils.SymbolMedusaWorkflowComposerContext
    ) {
      throw new Error(
        "createStep must be used inside a createWorkflow definition"
      )
    }

    const handler = createStepHandler.bind(this)({
      stepName,
      input,
      invokeFn,
      compensateFn,
    })

    wrapAsyncHandler(stepConfig, handler)

    stepConfig.uuid = ulid()
    stepConfig.noCompensation = !compensateFn

    this.flow.addAction(stepName, stepConfig)

    this.isAsync ||= !!(stepConfig.async || stepConfig.compensateAsync)

    if (!this.handlers.has(stepName)) {
      this.handlers.set(stepName, handler)
    }

    const ret = {
      __type: OrchestrationUtils.SymbolWorkflowStep,
      __step__: stepName,
    }

    const refRet = proxify(ret) as WorkflowData<TInvokeResultOutput> & {
      if: (
        input: any,
        condition: (...args: any) => boolean | WorkflowData
      ) => WorkflowData<TInvokeResultOutput>
    }

    refRet.config = (
      localConfig: { name?: string } & Omit<
        TransactionStepsDefinition,
        "next" | "uuid" | "action"
      >
    ) => {
      const newStepName = localConfig.name ?? stepName
      const newConfig = {
        async: false,
        compensateAsync: false,
        ...stepConfig,
        ...localConfig,
      }

      delete localConfig.name

      this.handlers.set(newStepName, handler)

      this.flow.replaceAction(stepConfig.uuid!, newStepName, newConfig)
      this.isAsync ||= !!(newConfig.async || newConfig.compensateAsync)

      ret.__step__ = newStepName
      WorkflowManager.update(this.workflowId, this.flow, this.handlers)

      //const confRef = proxify(ret)

      if (global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition]) {
        const flagSteps =
          global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition].steps

        const idx = flagSteps.findIndex((a) => a.__step__ === ret.__step__)
        if (idx > -1) {
          flagSteps.splice(idx, 1)
        }
        flagSteps.push(refRet)
      }

      return refRet
    }
    refRet.if = (
      input: any,
      condition: (...args: any) => boolean | WorkflowData
    ): WorkflowData<TInvokeResultOutput> => {
      if (typeof condition !== "function") {
        throw new Error("Condition must be a function")
      }

      wrapConditionalStep(input, condition, handler)
      this.handlers.set(ret.__step__, handler)

      return refRet
    }

    if (global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition]) {
      global[
        OrchestrationUtils.SymbolMedusaWorkflowComposerCondition
      ].steps.push(refRet)
    }

    return refRet
  }
}

/**
 * @internal
 *
 * Internal function to handle async steps to be automatically marked as completed after they are executed.
 *
 * @param stepConfig
 * @param handle
 */
function wrapAsyncHandler(
  stepConfig: TransactionStepsDefinition,
  handle: {
    invoke: WorkflowStepHandler
    compensate?: WorkflowStepHandler
  }
) {
  if (stepConfig.async) {
    if (typeof handle.invoke === "function") {
      const originalInvoke = handle.invoke

      handle.invoke = async (stepArguments: WorkflowStepHandlerArguments) => {
        const response = (await originalInvoke(stepArguments)) as any
        if (
          response?.output?.__type !==
          OrchestrationUtils.SymbolWorkflowStepResponse
        ) {
          return
        }

        stepArguments.step.definition.backgroundExecution = true
        return response
      }
    }
  }

  if (stepConfig.compensateAsync) {
    if (typeof handle.compensate === "function") {
      const originalCompensate = handle.compensate!
      handle.compensate = async (
        stepArguments: WorkflowStepHandlerArguments
      ) => {
        const response = (await originalCompensate(stepArguments)) as any

        if (
          response?.output?.__type !==
          OrchestrationUtils.SymbolWorkflowStepResponse
        ) {
          return
        }
        stepArguments.step.definition.backgroundExecution = true

        return response
      }
    }
  }
}

/**
 * @internal
 *
 * Internal function to handle conditional steps.
 *
 * @param condition
 * @param handle
 */
function wrapConditionalStep(
  input: any,
  condition: (...args: any) => boolean | WorkflowData,
  handle: {
    invoke: WorkflowStepHandler
    compensate?: WorkflowStepHandler
  }
) {
  const originalInvoke = handle.invoke
  handle.invoke = async (stepArguments: WorkflowStepHandlerArguments) => {
    const args = await resolveValue(input, stepArguments)
    const canContinue = await condition(args, stepArguments)

    if (stepArguments.step.definition?.async) {
      stepArguments.step.definition.backgroundExecution = true
    }

    if (!canContinue) {
      return StepResponse.skip()
    }

    return await originalInvoke(stepArguments)
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
 *   StepResponse
 * } from "@medusajs/framework/workflows-sdk"
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
 *     const product = await productService.createProducts(input)
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
 *     await productService.deleteProducts(input.product_id)
 *   }
 * )
 */
export function createStep<
  TInvokeInput,
  TInvokeResultOutput,
  TInvokeResultCompensateInput
>(
  /**
   * The name of the step or its configuration.
   */
  nameOrConfig:
    | string
    | ({ name: string } & Omit<
        TransactionStepsDefinition,
        "next" | "uuid" | "action"
      >),
  /**
   * An invocation function that will be executed when the workflow is executed. The function must return an instance of {@link StepResponse}. The constructor of {@link StepResponse}
   * accepts the output of the step as a first argument, and optionally as a second argument the data to be passed to the compensation function as a parameter.
   */
  invokeFn: InvokeFn<
    TInvokeInput,
    TInvokeResultOutput,
    TInvokeResultCompensateInput
  >,
  /**
   * A compensation function that's executed if an error occurs in the workflow. It's used to roll-back actions when errors occur.
   * It accepts as a parameter the second argument passed to the constructor of the {@link StepResponse} instance returned by the invocation function. If the
   * invocation function doesn't pass the second argument to `StepResponse` constructor, the compensation function receives the first argument
   * passed to the `StepResponse` constructor instead.
   */
  compensateFn?: CompensateFn<TInvokeResultCompensateInput>
): StepFunction<TInvokeInput, TInvokeResultOutput> {
  const stepName =
    (isString(nameOrConfig) ? nameOrConfig : nameOrConfig.name) ?? invokeFn.name
  const config = isString(nameOrConfig) ? {} : nameOrConfig

  const returnFn = function (
    input:
      | {
          [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]>
        }
      | undefined
  ): WorkflowData<TInvokeResultOutput> {
    const context = global[
      OrchestrationUtils.SymbolMedusaWorkflowComposerContext
    ] as CreateWorkflowComposerContext

    return applyStep<
      TInvokeInput,
      { [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]> },
      TInvokeResultOutput,
      TInvokeResultCompensateInput
    >({
      stepName,
      stepConfig: config,
      input,
      invokeFn,
      compensateFn,
    }).bind(context)()
  } as StepFunction<TInvokeInput, TInvokeResultOutput>

  returnFn.__type = OrchestrationUtils.SymbolWorkflowStepBind
  returnFn.__step__ = stepName

  return returnFn
}
