import { ContainerLike } from "../../common"
import { FlowRunOptions } from "@medusajs/workflows-sdk"

export * from "./workflow-execution"

export interface WorkflowOrchestratorRunDTO<T = unknown>
  extends FlowRunOptions<T> {
  transaction_id?: string
  container?: ContainerLike
}
