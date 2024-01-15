import { ContainerLike, FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableWorkflowExecutionProps,
  WorkflowExecutionDTO,
} from "./common"
import type {
  ReturnWorkflow,
  UnwrapWorkflowInputDataType,
} from "@medusajs/workflows-sdk"

type FlowRunOptions<TData = unknown> = {
  input?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
  events?: Record<string, Function>
}

export interface WorkflowOrchestratorRunDTO<T = unknown>
  extends FlowRunOptions<T> {
  transactionId?: string
  container?: ContainerLike
}

export type IdempotencyKeyParts = {
  workflowId: string
  transactionId: string
  stepId: string
  action: "invoke" | "compensate"
}

export interface IWorkflowOrchestratorModuleService extends IModuleService {
  listWorkflowExecution(
    filters?: FilterableWorkflowExecutionProps,
    config?: FindConfig<WorkflowExecutionDTO>,
    sharedContext?: Context
  ): Promise<WorkflowExecutionDTO[]>

  listAndCountWorkflowExecution(
    filters?: FilterableWorkflowExecutionProps,
    config?: FindConfig<WorkflowExecutionDTO>,
    sharedContext?: Context
  ): Promise<[WorkflowExecutionDTO[], number]>

  run<
    TWorkflow extends ReturnWorkflow<any, any, any>,
    TData = UnwrapWorkflowInputDataType<TWorkflow>
  >(
    workflowId: string,
    options?: WorkflowOrchestratorRunDTO,
    sharedContext?: Context
  ): Promise<{
    errors: Error[]
    transaction: object
    result: any
    acknowledgement: object
  }>

  getRunningTransaction(
    workflowId: string,
    transactionId: string,
    options?: Record<string, any>,
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
      idempotencyKey: string | object
      stepResponse: unknown
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
}
