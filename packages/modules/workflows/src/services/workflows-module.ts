import type {
  Context,
  FilterableWorkflowExecutionProps,
  FindConfig,
  IdempotencyKeyParts,
  InternalModuleDeclaration,
  IWorkflowEngineService,
  Logger,
  MedusaContainer,
  RegisteredWorkflow,
  WorkflowIdOrObject,
  WorkflowResultOf,
  WorkflowInputOf,
  WorkflowRunResult,
  WorkflowExecutionDTO,
  WorkflowOrchestratorCancelOptionsDTO,
  WorkflowOrchestratorRunDTO,
} from "@medusajs/framework/types"
import {
  defineJoinerConfig,
  MedusaContext,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  getWorkflowChildren,
  getWorkflowDefinition,
  getWorkflowRunOptions,
  isWorkflow,
} from "@medusajs/framework/workflows-sdk"
import type {
  CompiledWorkflow,
  Engine,
  Outbox,
  RunHandle,
  RunScope,
} from "@medusajs/workflow-engine"
import { isFinalRunStatus } from "@medusajs/workflow-engine"
import { Operation, toMedusaError } from "../adapters/errors"
import {
  listAndCountExecutions,
  retrieveExecution,
} from "../adapters/execution-dto"
import { toRunOptions } from "../adapters/run-options"
import {
  fromStepResponse,
  parseInvokeKey,
  parseKey,
  toStepError,
} from "../adapters/step-calls"
import { ResultOperation, toWorkflowResult } from "../adapters/workflow-result"
import {
  EVENTS_GROUPED_ON_BUS,
  releaseEventGroup,
} from "../events/event-group-release"
import { installEventGroupRouter } from "../events/event-group-router"
import {
  RunCallbacks,
  RunKey,
  runKey,
  RunSubscriptions,
} from "../events/run-subscriptions"
import {
  LegacyTransactionView,
  snapshotFromTransaction,
} from "../legacy/transaction-view"
import { contextualizeContainer } from "../middleware/medusa-context"
import { WorkflowExecution } from "../models/workflow-execution"

const joinerConfig = defineJoinerConfig(Modules.WORKFLOW_ENGINE, {
  models: [WorkflowExecution],
})

type InjectedDependencies = {
  workflowEngine: Engine
  workflowOutbox?: Outbox
  sharedContainer?: MedusaContainer
  logger?: Logger
  workflowEngineLegacyCheck?: () => Promise<void>
  workflowEngineShutdownGraceMs?: number
}

export class WorkflowsModuleService implements Partial<IWorkflowEngineService> {
  protected engine_: Engine
  protected container_: MedusaContainer | undefined
  protected logger_: Logger | Console

  #subscriptions: RunSubscriptions
  // The locals of unfinished runs started here, which the engine keeps by
  // reference, so a step completion call can hand the run its container.
  #runLocals = new Map<string, Record<string, unknown>>()
  // Containers passed to step completion calls of runs not started here.
  #stepCallContainers = new Map<string, unknown>()
  // Registered workflow objects by id, for the `.config()` options of runs
  // started by id.
  #workflows = new Map<string, unknown>()
  #outbox?: Outbox
  #shutdown?: Promise<void>
  #legacyCheck?: () => Promise<void>
  #shutdownGraceMs: number
  #routerInstalled = false

  constructor(
    {
      workflowEngine,
      workflowOutbox,
      sharedContainer,
      logger,
      workflowEngineLegacyCheck,
      workflowEngineShutdownGraceMs,
    }: InjectedDependencies,
    protected readonly moduleDeclaration?: InternalModuleDeclaration
  ) {
    this.engine_ = workflowEngine
    this.container_ = sharedContainer
    this.logger_ = logger ?? console
    this.#legacyCheck = workflowEngineLegacyCheck
    this.#shutdownGraceMs = workflowEngineShutdownGraceMs ?? 10_000
    this.#outbox = workflowOutbox

    this.engine_.use({
      name: "medusa-workflows",
      resolveLocals: (run) => {
        const key = runKey(run)
        const stepCallContainer = this.#stepCallContainers.get(key)
        if (stepCallContainer) {
          return this.#locals(stepCallContainer)
        }
        return this.#runLocals.get(key) ?? this.#locals(this.container_)
      },
      onRunFinished: (run, locals) => {
        this.#runLocals.delete(runKey(run))
        // Once the router is installed, the outbox releases the events of
        // runs started after it.
        if (this.#routerInstalled && !run.metadata?.[EVENTS_GROUPED_ON_BUS]) {
          return
        }
        return releaseEventGroup(
          run.context,
          run.status,
          (locals.container ?? this.container_) as MedusaContainer | undefined,
          this.logger_
        )
      },
    })
    this.#subscriptions = new RunSubscriptions(this.engine_, this.logger_)
  }

  /**
   * Installed once every module is registered. Runs started before that group
   * their events on the event bus, which releases them when the run finishes.
   */
  #installEventGroupRouter() {
    if (!this.#outbox) {
      return
    }
    this.#routerInstalled = installEventGroupRouter(
      this.container_,
      this.#outbox
    )
    if (!this.#routerInstalled) {
      this.logger_.warn(
        "No event bus that supports grouped events is registered. Events grouped by workflows are released when the workflow finishes, without being staged with the run."
      )
    }
  }

  __joinerConfig() {
    return joinerConfig
  }

  __hooks = {
    onApplicationStart: async () => {
      this.#installEventGroupRouter()
      await this.engine_.boot()
      try {
        await this.#legacyCheck?.()
      } catch (error) {
        this.logger_.warn(
          `Failed to check for executions of the previous workflow engine: ${
            (error as Error)?.message ?? error
          }`
        )
      }
    },
    // Runs alongside the other modules' hooks, so the event bus may already
    // be shutting down. Grouped events of stored runs stay in the outbox when
    // publishing fails and are published again by any instance.
    onApplicationPrepareShutdown: async () => {
      await this.#stop(this.#shutdownGraceMs)
    },
    onApplicationShutdown: async () => {
      await this.#stop(0)
    },
  }

  /**
   * Shuts the engine down once, whichever shutdown hook runs first.
   */
  #stop(graceMs: number) {
    this.#shutdown ??= (async () => {
      this.#subscriptions.stop()
      await this.engine_.shutdown({ graceMs })
      this.#subscriptions.clear()
      this.#stepCallContainers.clear()
      this.#runLocals.clear()
    })()
    return this.#shutdown
  }

  /**
   * Process-local values for a run: the container its steps resolve from,
   * wrapped so module services receive the workflow's context.
   */
  #locals(container: unknown) {
    if (!container) {
      return {}
    }
    return {
      container: contextualizeContainer(container as MedusaContainer, () =>
        this.engine_.currentScope()
      ),
    }
  }

  async listWorkflowExecutions(
    filters: FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowExecutionDTO> = {},
    @MedusaContext() _sharedContext: Context = {}
  ): Promise<WorkflowExecutionDTO[]> {
    const [executions] = await listAndCountExecutions(
      this.engine_,
      filters,
      config
    )
    return executions
  }

  async listAndCountWorkflowExecutions(
    filters: FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowExecutionDTO> = {},
    @MedusaContext() _sharedContext: Context = {}
  ): Promise<[WorkflowExecutionDTO[], number]> {
    return await listAndCountExecutions(this.engine_, filters, config)
  }

  async retrieveWorkflowExecution(
    idOrObject: string | { workflow_id: string; transaction_id: string },
    config: FindConfig<WorkflowExecutionDTO> = {},
    @MedusaContext() _sharedContext: Context = {}
  ): Promise<WorkflowExecutionDTO> {
    return await retrieveExecution(this.engine_, idOrObject, config)
  }

  // Executions are views of runs and change only by running workflows.
  async createWorkflowExecutions(): Promise<never> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Workflow executions are created by running workflows"
    )
  }

  async updateWorkflowExecutions(): Promise<never> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Workflow executions are updated by running workflows"
    )
  }

  get engine(): Engine {
    return this.engine_
  }

  /**
   * Registers the workflows and the workflows they run with `runAsStep`.
   */
  async registerWorkflows(workflows: unknown[]): Promise<void> {
    const seen = new Set<unknown>()
    const register = (workflow: unknown) => {
      if (seen.has(workflow)) {
        return
      }
      seen.add(workflow)
      if (!isWorkflow(workflow)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Only workflows created with createWorkflow can be registered"
        )
      }
      const definition = getWorkflowDefinition(workflow)
      try {
        this.engine_.register(definition)
      } catch (error) {
        throw toMedusaError(error, "run")
      }
      this.#workflows.set(definition.id, workflow)
      getWorkflowChildren(workflow).forEach(register)
    }
    workflows.forEach(register)
  }

  async unregisterWorkflows(workflowIds: string[]): Promise<void> {
    for (const workflowId of workflowIds) {
      this.engine_.unregister(workflowId)
      this.#workflows.delete(workflowId)
    }
  }

  async listRegisteredWorkflows(): Promise<RegisteredWorkflow[]> {
    return this.engine_.listRegistered()
  }

  async run<TWorkflow extends WorkflowIdOrObject>(
    workflowIdOrWorkflow: TWorkflow,
    options: WorkflowOrchestratorRunDTO<WorkflowInputOf<TWorkflow>> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowRunResult<WorkflowResultOf<TWorkflow>>> {
    const workflowId = this.#workflowId(workflowIdOrWorkflow)
    const compiled = this.#compiled(workflowId)
    const scope = this.engine_.currentScope()
    const workflow =
      typeof workflowIdOrWorkflow === "string"
        ? this.#workflows.get(workflowId)
        : workflowIdOrWorkflow
    const normalized = toRunOptions(
      options,
      sharedContext,
      workflow ? getWorkflowRunOptions(workflow) : undefined
    )
    const key = { workflowId, transactionId: normalized.transactionId }
    const parent = await this.#parentFor(normalized.context, scope)
    const locals = this.#locals(options.container ?? this.container_)

    // Set before starting: a run continued in the background can finish, and
    // drop its entry, before start returns. An entry already there belongs to
    // the unfinished run this start conflicts with.
    const localsKey = runKey(key)
    if (!this.#runLocals.has(localsKey)) {
      this.#runLocals.set(localsKey, locals)
    }
    const restoreLocals = () => {
      if (this.#runLocals.get(localsKey) === locals) {
        this.#runLocals.delete(localsKey)
      }
    }

    let handle: RunHandle
    try {
      handle = await this.#execute("run", key, options.events, () =>
        this.engine_.start({
          workflowId,
          transactionId: normalized.transactionId,
          unique: normalized.unique,
          input: options.input,
          context: normalized.context,
          locals,
          parent,
          options: normalized.workflowOptions,
          metadata: this.#routerInstalled
            ? undefined
            : { [EVENTS_GROUPED_ON_BUS]: true },
        })
      )
    } catch (error) {
      restoreLocals()
      throw error
    }
    if (handle.finished || handle.existing) {
      restoreLocals()
    }
    if (typeof options.resultFrom === "string") {
      handle = await this.#withStepResult(handle, options.resultFrom)
    }

    return this.#result(handle, "run", options, compiled) as WorkflowRunResult<
      WorkflowResultOf<TWorkflow>
    >
  }

  /**
   * The output of one step as the run's result, as `resultFrom` asks.
   */
  async #withStepResult(handle: RunHandle, stepId: string) {
    let steps = handle.run.steps
    if (!steps?.some((step) => step.stepId === stepId)) {
      steps = (await this.engine_.getRun(handle.runId, { steps: true }))?.steps
    }
    const step = steps?.find((candidate) => candidate.stepId === stepId)
    return { ...handle, result: step?.output }
  }

  async getRunningTransaction(
    workflowId: string,
    transactionId: string,
    @MedusaContext() _sharedContext: Context = {}
  ) {
    const compiled = this.#compiled(workflowId)
    const run = await this.engine_.findRun(workflowId, transactionId, {
      steps: true,
    })
    // A finished run is only kept for an idempotent workflow to return.
    if (!run || (isFinalRunStatus(run.status) && !run.idempotent)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Transaction ${transactionId} could not be found.`
      )
    }
    return new LegacyTransactionView(run, [], compiled)
  }

  async setStepSuccess(
    {
      idempotencyKey,
      stepResponse,
      options = {},
    }: {
      idempotencyKey: string | IdempotencyKeyParts
      stepResponse: unknown
      options?: Record<string, any>
    },
    @MedusaContext() _sharedContext: Context = {}
  ) {
    const key = parseInvokeKey(idempotencyKey)
    const compiled = this.#compiled(key.workflowId)
    const response = fromStepResponse(stepResponse)

    const handle = await this.#executeStepCall("success", key, options, () =>
      this.engine_.completeStep(key, response)
    )

    return this.#result(handle, "stepSuccess", options, compiled)
  }

  async setStepFailure(
    {
      idempotencyKey,
      stepResponse,
      options = {},
    }: {
      idempotencyKey: string | IdempotencyKeyParts
      stepResponse: unknown
      options?: Record<string, any>
    },
    @MedusaContext() _sharedContext: Context = {}
  ) {
    const key = parseInvokeKey(idempotencyKey)
    const compiled = this.#compiled(key.workflowId)

    const handle = await this.#executeStepCall("failure", key, options, () =>
      this.engine_.failStep(key, toStepError(stepResponse), {
        permanent: !!options.forcePermanentFailure,
      })
    )

    return this.#result(handle, "stepFailure", options, compiled)
  }

  async retryStep(
    {
      idempotencyKey,
      options = {},
    }: {
      idempotencyKey: string | IdempotencyKeyParts
      options?: Record<string, any>
    },
    @MedusaContext() _sharedContext: Context = {}
  ) {
    const key = parseInvokeKey(idempotencyKey)
    const compiled = this.#compiled(key.workflowId)

    const handle = await this.#executeStepCall("retry", key, options, () =>
      this.engine_.retryStep(key)
    )

    return this.#result(handle, "retryStep", options, compiled)
  }

  async cancel(
    workflowIdOrWorkflow: WorkflowIdOrObject,
    options: WorkflowOrchestratorCancelOptionsDTO = {},
    @MedusaContext() _sharedContext: Context = {}
  ) {
    const workflowId = this.#workflowId(workflowIdOrWorkflow)
    const compiled = this.#compiled(workflowId)
    const throwOnError = options.throwOnError ?? true
    const snapshot = snapshotFromTransaction(options.transaction)
    const transactionId =
      options.transactionId ??
      snapshot?.transactionId ??
      (options.transaction as { transactionId?: string })?.transactionId

    if (!transactionId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Transaction ID is required"
      )
    }

    let handle: RunHandle
    try {
      handle = await this.#execute(
        "cancel",
        { workflowId, transactionId },
        options.events as RunCallbacks,
        () =>
          this.engine_.cancel({
            workflowId,
            transactionId,
            snapshot,
            locals: this.#locals(options.container ?? this.container_),
          })
      )
    } catch (error) {
      if (throwOnError) {
        throw error
      }
      const exists = (error as MedusaError).type !== MedusaError.Types.NOT_FOUND
      if (!exists) {
        return {
          acknowledgement: { transactionId, workflowId, exists: false },
        }
      }
      return {
        acknowledgement: {
          transactionId,
          workflowId,
          exists: true,
          hasFinished: false,
          hasFailed: true,
        },
        errors: [error],
        thrownError: error,
      }
    }

    return this.#result(handle, "cancel", options, compiled)
  }

  async subscribe(
    {
      workflowId,
      transactionId,
      subscriber,
      subscriberId,
    }: {
      workflowId: string
      transactionId?: string
      subscriber: Function
      subscriberId?: string
    },
    @MedusaContext() _sharedContext: Context = {}
  ): Promise<void> {
    this.#subscriptions.subscribe(
      workflowId,
      transactionId,
      subscriber,
      subscriberId
    )
  }

  async unsubscribe(
    {
      workflowId,
      transactionId,
      subscriberOrId,
    }: {
      workflowId: string
      transactionId?: string
      subscriberOrId: string | Function
    },
    @MedusaContext() _sharedContext: Context = {}
  ) {
    this.#subscriptions.unsubscribe(workflowId, transactionId, subscriberOrId)
  }

  #workflowId(workflowIdOrWorkflow: WorkflowIdOrObject): string {
    const workflowId =
      typeof workflowIdOrWorkflow === "string"
        ? workflowIdOrWorkflow
        : workflowIdOrWorkflow?.getName?.()
    if (!workflowId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Workflow ID is required"
      )
    }
    return workflowId
  }

  #compiled(workflowId: string): CompiledWorkflow {
    try {
      return this.engine_.registry.get(workflowId)
    } catch (error) {
      throw toMedusaError(error, "run")
    }
  }

  /**
   * A run started from inside a step is linked to that step. A step that hosts
   * an async child (`nested`) is completed by the child when it finishes.
   */
  async #parentFor(
    context: Record<string, any>,
    scope: RunScope | undefined
  ): Promise<
    { runId: string; stepId: string; completeStep?: boolean } | undefined
  > {
    const parentKey = context.parentStepIdempotencyKey as string | undefined
    if (parentKey) {
      const parts = parseKey(parentKey)
      const runId =
        scope &&
        scope.workflowId === parts.workflowId &&
        scope.transactionId === parts.transactionId
          ? scope.runId
          : (await this.engine_.findRun(parts.workflowId, parts.transactionId))
              ?.id
      if (runId) {
        const parentCompiled = this.engine_.registry.has(parts.workflowId)
          ? this.engine_.registry.get(parts.workflowId)
          : undefined
        const index = parentCompiled?.indexById.get(parts.stepId)
        const nested =
          index !== undefined && !!parentCompiled!.steps[index].options.nested
        return { runId, stepId: parts.stepId, completeStep: nested }
      }
    }

    if (scope?.stepId) {
      return { runId: scope.runId, stepId: scope.stepId }
    }
    return undefined
  }

  /**
   * Runs an engine call with the callbacks it was given, removing only those
   * when the call fails or the run is already finished, and maps engine
   * errors to Medusa errors.
   */
  async #execute(
    operation: Operation,
    key: RunKey,
    callbacks: RunCallbacks | undefined,
    fn: () => Promise<RunHandle>
  ): Promise<RunHandle> {
    const added = this.#subscriptions.addCallbacks(key, callbacks)
    let handle: RunHandle
    try {
      handle = await fn()
    } catch (error) {
      this.#subscriptions.removeCallbacks(key, added)
      throw toMedusaError(error, operation)
    }
    if (handle.finished) {
      this.#subscriptions.removeCallbacks(key, added)
    }
    return handle
  }

  /**
   * Step completion calls take the container to continue the run with from
   * their options, as `run` does.
   */
  async #executeStepCall(
    operation: "success" | "failure" | "retry",
    key: RunKey,
    options: Record<string, any>,
    fn: () => Promise<RunHandle>
  ) {
    const container = options.container
    const containerKey = runKey(key)
    if (container) {
      const runLocals = this.#runLocals.get(containerKey)
      if (runLocals) {
        Object.assign(runLocals, this.#locals(container))
      }
      this.#stepCallContainers.set(containerKey, container)
    }
    try {
      return await this.#execute(operation, key, options.events, fn)
    } finally {
      if (
        container &&
        this.#stepCallContainers.get(containerKey) === container
      ) {
        this.#stepCallContainers.delete(containerKey)
      }
    }
  }

  #result(
    handle: RunHandle,
    operation: ResultOperation,
    options: { throwOnError?: boolean; logOnError?: boolean },
    compiled: CompiledWorkflow
  ) {
    return toWorkflowResult(handle, {
      operation,
      throwOnError: options.throwOnError ?? true,
      logOnError: options.logOnError,
      logger: this.logger_,
      compiled,
    })
  }
}
