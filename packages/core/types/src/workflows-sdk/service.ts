import { FindConfig } from "../common"
import { ContainerLike, IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableWorkflowExecutionProps,
  WorkflowExecutionDTO,
} from "./common"

type FlowRunOptions<TData = unknown> = {
  input?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
  logOnError?: boolean
  events?: Record<string, Function>
  /**
   * When enabled, the workflow run is added to the workflow engine's queue and
   * executed by an instance running in worker mode, instead of being executed
   * in the current process. The call resolves immediately with an
   * acknowledgement and no result. The input must be JSON-serializable, and
   * `events` cannot be combined with this option.
   */
  queue?: boolean
}

export type Acknowledgement = {
  workflowId: string
  transactionId: string
  parentStepIdempotencyKey?: string
  hasFinished: boolean
  hasFailed: boolean
  /**
   * Whether the workflow run was queued for execution instead of being
   * executed in the current process.
   */
  queued?: boolean
}

export interface WorkflowOrchestratorRunDTO<T = unknown>
  extends FlowRunOptions<T> {
  transactionId?: string
}

export interface WorkflowOrchestratorCancelOptionsDTO {
  transactionId: string
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

  run(
    workflowId: string,
    options?: WorkflowOrchestratorRunDTO,
    sharedContext?: Context
  )

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
    workflowId: string,
    options: WorkflowOrchestratorCancelOptionsDTO,
    sharedContext?: Context
  )
}
