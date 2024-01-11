import { ContainerLike } from "../../common"
import { Context } from "../../shared-context"

export * from "./workflow-execution"

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
