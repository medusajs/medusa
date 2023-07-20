import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import {
  DistributedTransaction,
  LocalWorkflow,
  TransactionState,
} from "@medusajs/orchestration"
import { InputAlias, Workflows } from "../definitions"

import { MedusaModule } from "@medusajs/modules-sdk"
import { ulid } from "ulid"

type FlowRunOptions = {
  input?: unknown
  context?: Context
  onFail?: (errorMessage: string) => void
}

export const exportWorkflow = (
  workflowId: Workflows,
  inputAlias?: InputAlias | string
) => {
  return (
    container?: LoadedModule[] | MedusaContainer
  ): LocalWorkflow & {
    run: (args: FlowRunOptions) => Promise<DistributedTransaction>
  } => {
    if (!container) {
      container = [...MedusaModule.getLoadedModules().entries()].map(
        ([_, mod]) => mod
      )
    }

    const flow = new LocalWorkflow(workflowId, container) as LocalWorkflow & {
      run: (args: FlowRunOptions) => Promise<DistributedTransaction>
    }

    flow.run = async ({ input, context, onFail }: FlowRunOptions) => {
      const transaction = await flow.begin(
        context?.transactionId ?? ulid(),
        inputAlias ? { [inputAlias]: input } : input,
        context
      )

      const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]
      if (failedStatus.includes(transaction.getState())) {
        const errorMessage = transaction
          .getErrors()
          .map((err) => err.error?.message)
          .join("\n")

        if (onFail) {
          await onFail(errorMessage)
        } else {
          throw new Error(errorMessage)
        }
      }

      return transaction
    }

    return flow
  }
}
