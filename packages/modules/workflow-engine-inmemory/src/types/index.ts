import { ContainerLike } from "@zjedene-medusa/framework"
import { Logger } from "@zjedene-medusa/framework/types"
import { FlowCancelOptions } from "@zjedene-medusa/framework/workflows-sdk"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export type WorkflowOrchestratorCancelOptions = Omit<
  FlowCancelOptions,
  "transaction" | "transactionId" | "container"
> & {
  transactionId: string
  container?: ContainerLike
}
