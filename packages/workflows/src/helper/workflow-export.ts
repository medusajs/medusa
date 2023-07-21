import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import {
  DistributedTransaction,
  LocalWorkflow,
  TransactionState,
  TransactionStepError,
} from "@medusajs/orchestration"
import { InputAlias, Workflows } from "../definitions"

import { MedusaModule } from "@medusajs/modules-sdk"
import { ulid } from "ulid"
import { EOL } from "os"

type FlowRunOptions = {
  input?: unknown
  context?: Context
  onFail?: ({
    errors,
  }: {
    errors: TransactionStepError[]
    transaction: DistributedTransaction
  }) => void
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
      container = MedusaModule.getLoadedModules().map(
        (mod) => Object.values(mod)[0]
      )
    }

    const flow = new LocalWorkflow(workflowId, container) as LocalWorkflow & {
      run: (args: FlowRunOptions) => Promise<DistributedTransaction>
    }

    flow.run = async ({ input, context, onFail }: FlowRunOptions) => {
      const transaction = await flow.begin(
        context?.transactionId ?? ulid(),
        input,
        context
      )

      const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]
      if (failedStatus.includes(transaction.getState())) {
        const errors = transaction.getErrors()

        if (onFail) {
          await onFail({ errors, transaction })
        } else {
          const errorMessage = errors
            ?.map((err) => `${err.error?.message}${EOL}${err.error?.stack}`)
            ?.join(`${EOL}`)
          throw new Error(errorMessage)
        }
      }

      return transaction
    }

    return flow
  }
}
