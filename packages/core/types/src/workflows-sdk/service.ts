import { FindConfig } from "../common"
import { ContainerLike, IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableWorkflowExecutionProps,
  WorkflowExecutionDTO,
} from "./common"
import {
  LegacyTransaction,
  TransactionStepError,
  WorkflowConfigOptions,
} from "./engine"

/**
 * Options of a workflow run.
 */
export type FlowRunOptions<TData = unknown> = {
  input?: TData
  context?: Context
  /**
   * A step whose output is returned as the run's result instead of the
   * workflow's.
   */
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
  logOnError?: boolean
  events?: Record<string, Function>
}

export type Acknowledgement = {
  workflowId: string
  transactionId: string
  parentStepIdempotencyKey?: string
  hasFinished: boolean
  hasFailed: boolean
}

export interface WorkflowOrchestratorRunDTO<T = unknown>
  extends FlowRunOptions<T> {
  transactionId?: string
  container?: ContainerLike
  /**
   * Options for this run, on top of the ones set with the workflow's
   * `.config()`.
   */
  workflowOptions?: WorkflowConfigOptions
}

/**
 * A workflow id, or the workflow object returned by `createWorkflow`.
 */
export type WorkflowIdOrObject = string | { getName(): string }

/**
 * Key of the type-only property that carries a workflow's input and result
 * types, so the module's methods can infer them from the workflow object.
 */
export type WorkflowTypesKey = " $workflowTypes"

/**
 * A workflow's input type. Runs started by id are not typed.
 */
export type WorkflowInputOf<TWorkflow> = TWorkflow extends string
  ? any
  : TWorkflow extends { [K in WorkflowTypesKey]?: { input: infer TInput } }
  ? TInput
  : any

/**
 * A workflow's result type. Runs started by id are not typed.
 */
export type WorkflowResultOf<TWorkflow> = TWorkflow extends string
  ? any
  : TWorkflow extends { [K in WorkflowTypesKey]?: { result: infer TResult } }
  ? TResult
  : any

/**
 * The details of a workflow's execution.
 */
export type WorkflowRunResult<TResult = unknown> = {
  /**
   * Any errors that occurred in the workflow.
   */
  errors: TransactionStepError[]
  /**
   * The transaction details of the workflow's execution.
   */
  transaction: LegacyTransaction
  /**
   * The result returned by the workflow.
   */
  result: TResult
  /**
   * Whether the workflow finished or failed by the time the call returned.
   */
  acknowledgement: Acknowledgement
  /**
   * The error that made the run fail, when `throwOnError` is false.
   */
  thrownError?: unknown
}

export type RegisteredWorkflow = {
  id: string
  hash: string
  schedule?: unknown
}

export interface WorkflowOrchestratorCancelOptionsDTO {
  transactionId?: string
  transaction?: unknown
  context?: Context
  throwOnError?: boolean
  logOnError?: boolean
  events?: Record<string, Function>
  container?: ContainerLike
}

export type IdempotencyKeyParts = {
  workflowId: string
  transactionId: string
  stepId: string
  action: "invoke" | "compensate"
}

export interface IWorkflowEngineService extends IModuleService {
  retrieveWorkflowExecution(
    idOrObject:
      | string
      | {
          workflow_id: string
          transaction_id: string
        },
    config?: FindConfig<WorkflowExecutionDTO>,
    sharedContext?: Context
  ): Promise<WorkflowExecutionDTO>

  listWorkflowExecutions(
    filters?: FilterableWorkflowExecutionProps,
    config?: FindConfig<WorkflowExecutionDTO>,
    sharedContext?: Context
  ): Promise<WorkflowExecutionDTO[]>

  listAndCountWorkflowExecutions(
    filters?: FilterableWorkflowExecutionProps,
    config?: FindConfig<WorkflowExecutionDTO>,
    sharedContext?: Context
  ): Promise<[WorkflowExecutionDTO[], number]>

  run<TWorkflow extends WorkflowIdOrObject>(
    workflowIdOrWorkflow: TWorkflow,
    options?: WorkflowOrchestratorRunDTO<WorkflowInputOf<TWorkflow>>,
    sharedContext?: Context
  ): Promise<WorkflowRunResult<WorkflowResultOf<TWorkflow>>>

  getRunningTransaction(
    workflowId: string,
    transactionId: string,
    sharedContext?: Context
  ): Promise<unknown>

  setStepSuccess(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | IdempotencyKeyParts
      stepResponse: unknown
      options?: Record<string, any>
    },
    sharedContext?: Context
  )

  setStepFailure(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | IdempotencyKeyParts
      stepResponse: unknown
      options?: Record<string, any>
    },
    sharedContext?: Context
  )

  retryStep(
    {
      idempotencyKey,
      options,
    }: {
      idempotencyKey: string | IdempotencyKeyParts
      options?: Record<string, any>
    },
    sharedContext?: Context
  )

  subscribe(
    args: {
      workflowId: string
      transactionId?: string
      subscriber: Function
      subscriberId?: string
    },
    sharedContext?: Context
  ): Promise<void>

  unsubscribe(
    args: {
      workflowId: string
      transactionId?: string
      subscriberOrId: string | Function
    },
    sharedContext?: Context
  )

  cancel(
    workflowIdOrWorkflow: WorkflowIdOrObject,
    options: WorkflowOrchestratorCancelOptionsDTO,
    sharedContext?: Context
  )

  /**
   * Makes workflows runnable on this instance. Registering a workflow again
   * with the same steps is a no-op; different steps under the same id throw.
   */
  registerWorkflows(workflows: unknown[]): Promise<void>

  unregisterWorkflows(workflowIds: string[]): Promise<void>

  listRegisteredWorkflows(): Promise<RegisteredWorkflow[]>
}
