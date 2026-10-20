import type { WorkflowStepConfig } from "@medusajs/types"
import {
  getCallerFilePath,
  isDefined,
  isString,
  OrchestrationUtils,
  registerDevServerResource,
} from "@medusajs/utils"
import { getComposerContext, WorkflowRecorder } from "../../compiler/recorder"
import { StepResponse } from "./helpers"
import { proxify } from "./helpers/proxy"
import {
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

export type LocalStepConfig = { name?: string } & WorkflowStepConfig

export interface ApplyStepOptions<
  TStepInputs extends {
    [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]>
  },
  TInvokeInput,
  TInvokeResultOutput,
  TInvokeResultCompensateInput
> {
  stepName: string
  stepConfig?: LocalStepConfig
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
 * Records a step in the workflow being composed and returns a reference to its
 * output.
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
  return function (this: WorkflowRecorder) {
    if (!this.workflowId) {
      throw new Error(
        "createStep must be used inside a createWorkflow definition"
      )
    }

    registerDevServerResource({
      id: stepName,
      type: "step",
      workflowId: this.workflowId!,
    })

    // Each use of a step gets its own copy, so `.config()` on one use never
    // leaks into another.
    const config: LocalStepConfig = {
      ...stepConfig,
      noCompensation: stepConfig.noCompensation ?? !compensateFn,
    }
    delete config.name

    const ret = {
      __type: OrchestrationUtils.SymbolWorkflowStep,
      __step__: stepName,
    }

    const recorded = this.addStep(
      { id: stepName, config, input, invokeFn, compensateFn },
      ret
    )

    const refRet = proxify(ret) as WorkflowData<TInvokeResultOutput> & {
      if: (
        input: any,
        condition: (...args: any) => boolean | WorkflowData
      ) => WorkflowData<TInvokeResultOutput>
    }

    refRet.config = (localConfig: LocalStepConfig) => {
      const newStepName = localConfig.name ?? ret.__step__
      const newConfig: LocalStepConfig = {
        async: false,
        ...recorded.config,
        ...localConfig,
      }

      if (isDefined(newConfig.nested)) {
        newConfig.nested ||= newConfig.async
      }

      delete newConfig.name

      this.updateStep(recorded, newStepName, newConfig)
      ret.__step__ = newStepName

      return refRet
    }

    refRet.if = (
      input: any,
      condition: (...args: any) => boolean | WorkflowData
    ): WorkflowData<TInvokeResultOutput> => {
      if (typeof condition !== "function") {
        throw new Error("Condition must be a function")
      }

      this.addCondition(recorded, { input, condition })

      return refRet
    }

    return refRet
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
 *     { container }
 *   ) {
 *     const productModuleService = container.resolve(
 *       "product"
 *     )
 *     const product = await productModuleService.createProducts(input)
 *     return new StepResponse({
 *       product
 *     }, {
 *       product_id: product.id
 *     })
 *   },
 *   async function (
 *     input,
 *     { container }
 *   ) {
 *     if (!input) {
 *       return
 *     }
 *     const productModuleService = container.resolve(
 *       "product"
 *     )
 *     await productModuleService.deleteProducts([input.product_id])
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
  nameOrConfig: string | ({ name: string } & WorkflowStepConfig),
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
    const context = getComposerContext()

    if (!context) {
      throw new Error(
        "createStep must be used inside a createWorkflow definition"
      )
    }

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
    }).call(context)
  } as StepFunction<TInvokeInput, TInvokeResultOutput>

  returnFn.__type = OrchestrationUtils.SymbolWorkflowStepBind
  returnFn.__step__ = stepName

  const sourcePath = getCallerFilePath() as string
  registerDevServerResource({
    id: stepName,
    type: "step",
    sourcePath,
  })

  return returnFn
}
