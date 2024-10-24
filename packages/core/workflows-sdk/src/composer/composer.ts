import {
  TransactionModelOptions,
  WorkflowManager,
} from "@medusajs/orchestration"
import {
  getCallerFilePath,
  isString,
  OrchestrationUtils,
} from "@medusajs/utils"
import {
  CreateWorkflowComposerContext,
  ReturnWorkflow,
  StepFunction,
  WorkflowData,
} from "../utils/composer/type"
import { proxify } from "../utils/composer/helpers/proxy"
import { ExportedWorkflow } from "../helper"
import { createStep, StepResponse, WorkflowResponse } from "../utils/composer"
import { ulid } from "ulid"
import {
  LocalWorkflowExecutionOptions,
  WorkflowExporter,
} from "./workflow-exporter"

type WorkflowComposerConfig = { name: string } & TransactionModelOptions
type ComposerFunction<TData, TResult, THooks> = (
  input: WorkflowData<TData>
) => void | WorkflowResponse<TResult, THooks>

export class WorkflowRunner<TData, TResult, THooks extends any[]> {
  #composer: Composer
  #exportedWorkflow: WorkflowExporter<TData, TResult>

  hooks = {} as ReturnWorkflow<TData, TResult, THooks>["hooks"]

  constructor(
    composer: Composer,
    {
      workflowId,
      options,
    }: {
      workflowId: string
      options: LocalWorkflowExecutionOptions
    }
  ) {
    this.#composer = composer
    this.#exportedWorkflow = new WorkflowExporter<TData, TResult>({
      workflowId,
      options,
    })

    this.#applyDynamicHooks()
  }

  /**
   * Apply the dynamic hooks implemented by the consumer
   * based on the available hooks in offered by the workflow composer.
   *
   * @private
   */
  #applyDynamicHooks() {
    const context = this.#composer.context

    for (const hook of context.hooks_.declared) {
      this.hooks[hook as keyof THooks & string] =
        context.hooksCallback_[hook].bind(context)
    }
  }

  getName(): string {
    return this.#composer.context.workflowId
  }

  runAsStep({
    input,
  }: {
    input: TData | WorkflowData<TData>
  }): ReturnType<StepFunction<TData, TResult>> {
    const context = this.#composer.context

    return createStep(
      {
        name: `${context.workflowId}-as-step`,
        async: context.isAsync,
        nested: context.isAsync, // if async we flag this is a nested transaction
      },
      async (stepInput: TData, stepContext) => {
        const { container, ...sharedContext } = stepContext

        const transaction = await this.#exportedWorkflow.run({
          input: stepInput as any,
          context: {
            transactionId: ulid(),
            ...sharedContext,
            parentStepIdempotencyKey: stepContext.idempotencyKey,
          },
        })

        const { result, transaction: flowTransaction } = transaction

        if (!context.isAsync || flowTransaction!.hasFinished()) {
          return new StepResponse(result, transaction)
        }

        return
      },
      async (transaction, { container }) => {
        if (!transaction) {
          return
        }

        await this.#exportedWorkflow.cancel(transaction)
      }
    )(input) as ReturnType<StepFunction<TData, TResult>>
  }

  async run<TDataOverride = undefined, TResultOverride = undefined>(
    ...args: Parameters<
      ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>["run"]
    >
  ): ReturnType<
    ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>["run"]
  > {
    return await this.#exportedWorkflow.run(...args)
  }

  async registerStepSuccess<
    TDataOverride = undefined,
    TResultOverride = undefined
  >(
    ...args: Parameters<
      ExportedWorkflow<
        TData,
        TResult,
        TDataOverride,
        TResultOverride
      >["registerStepSuccess"]
    >
  ): ReturnType<
    ExportedWorkflow<
      TData,
      TResult,
      TDataOverride,
      TResultOverride
    >["registerStepSuccess"]
  > {
    return await this.#exportedWorkflow.registerStepSuccess(...args)
  }

  async registerStepFailure<
    TDataOverride = undefined,
    TResultOverride = undefined
  >(
    ...args: Parameters<
      ExportedWorkflow<
        TData,
        TResult,
        TDataOverride,
        TResultOverride
      >["registerStepFailure"]
    >
  ): ReturnType<
    ExportedWorkflow<
      TData,
      TResult,
      TDataOverride,
      TResultOverride
    >["registerStepFailure"]
  > {
    return await this.#exportedWorkflow.registerStepFailure(...args)
  }

  async cancel<TDataOverride = undefined, TResultOverride = undefined>(
    ...args: Parameters<
      ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>["cancel"]
    >
  ): ReturnType<
    ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>["cancel"]
  > {
    return await this.#exportedWorkflow.cancel(...args)
  }
}

export class Composer {
  /**
   * The workflow composer context
   * @type {CreateWorkflowComposerContext}
   * @private
   */
  #context: CreateWorkflowComposerContext

  #workflowRunner: WorkflowRunner<any, any, any>

  get context() {
    return this.#context
  }

  get workflowRunner() {
    return this.#workflowRunner
  }

  constructor(config: WorkflowComposerConfig, composerFunction: any) {
    this.#initialize(config, composerFunction)
  }

  #initialize(
    config: WorkflowComposerConfig,
    composerFunction: ComposerFunction<any, any, any>
  ) {
    this.#initializeContext(config)

    global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext] =
      this.context

    let newWorkflow = false
    if (!WorkflowManager.getWorkflow(config.name)) {
      newWorkflow = true
      WorkflowManager.register(
        config.name,
        undefined,
        this.context.handlers,
        config
      )
    }

    const inputPlaceholder = proxify<WorkflowData>({
      __type: OrchestrationUtils.SymbolInputReference,
      __step__: "",
      config: () => {
        // TODO: config default value?
        throw new Error("Config is not available for the input object.")
      },
    })

    const returnedStep = composerFunction.apply(this.#context, [
      inputPlaceholder,
    ])

    delete global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext]

    const workflowArgs = [
      config.name,
      this.context.flow,
      this.context.handlers,
      config,
    ]

    if (newWorkflow) {
      WorkflowManager.update(...workflowArgs)
    } else {
      WorkflowManager.register(...workflowArgs)
    }

    const fileSourcePath = getCallerFilePath() as string

    this.#workflowRunner = new WorkflowRunner(this, {
      workflowId: config.name,
      options: {
        defaultResult: returnedStep,
        options: {
          sourcePath: fileSourcePath,
          wrappedInput: true,
        },
      },
    })
  }

  #initializeContext(config: WorkflowComposerConfig) {
    this.#context = {
      __type: OrchestrationUtils.SymbolMedusaWorkflowComposerContext,
      workflowId: config.name,
      flow: WorkflowManager.getEmptyTransactionDefinition(),
      isAsync: false,
      handlers: new Map(),
      hooks_: {
        declared: [],
        registered: [],
      },
      hooksCallback_: {},
    }
  }

  /**
   * Create a new workflow and execute the composer function to prepare the workflow
   * definition that needs to be executed when running the workflow.
   *
   * @param {WorkflowComposerConfig} config
   * @param composerFunction
   */
  static createWorkflow<TData, TResult, THooks extends any[]>(
    config: WorkflowComposerConfig,
    composerFunction: ComposerFunction<TData, TResult, THooks>
  ): WorkflowRunner<TData, TResult, THooks>

  /**
   * Create a new workflow and execute the composer function to prepare the workflow
   * definition that needs to be executed when running the workflow.
   *
   * @param {string} config
   * @param composerFunction
   */
  static createWorkflow<TData, TResult, THooks extends any[]>(
    config: string,
    composerFunction: ComposerFunction<TData, TResult, THooks>
  ): WorkflowRunner<TData, TResult, THooks>

  /**
   * Create a new workflow and execute the composer function to prepare the workflow
   * definition that needs to be executed when running the workflow.
   *
   * @param {string | ({name: string} & TransactionModelOptions)} nameOrConfig
   * @param composerFunction
   * @return {Composer}
   */
  static createWorkflow<TData, TResult, THooks extends any[]>(
    nameOrConfig: string | WorkflowComposerConfig,
    composerFunction: ComposerFunction<TData, TResult, THooks>
  ): WorkflowRunner<TData, TResult, THooks> {
    const name = isString(nameOrConfig) ? nameOrConfig : nameOrConfig.name
    const options = isString(nameOrConfig) ? {} : nameOrConfig

    return new Composer({ name, ...options }, composerFunction).workflowRunner
  }
}

export const createWorkflow = function <TData, TResult, THooks extends any[]>(
  nameOrConfig: string | WorkflowComposerConfig,
  composerFunction: ComposerFunction<TData, TResult, THooks>
): WorkflowRunner<TData, TResult, THooks> {
  const name = isString(nameOrConfig) ? nameOrConfig : nameOrConfig.name
  const options = isString(nameOrConfig) ? {} : nameOrConfig

  return new Composer({ name, ...options }, composerFunction).workflowRunner
}
