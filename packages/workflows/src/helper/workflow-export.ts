import {
  Context,
  JoinerServiceConfig,
  MedusaContainer,
  ModuleDefinition,
} from "@medusajs/types"
import {
  DistributedTransaction,
  LocalWorkflow,
  TransactionState,
} from "@medusajs/orchestration"
import { InputAlias, Workflows } from "../definitions"

import { MedusaModule } from "@medusajs/modules-sdk"
import { ulid } from "ulid"

export const exportWorkflow = (
  workflowId: Workflows,
  inputAlias?: InputAlias | string
) => {
  return (
    container?:
      | (any & {
          __joinerConfig: JoinerServiceConfig
          __definition: ModuleDefinition
        })[]
      | MedusaContainer
  ): LocalWorkflow & {
    run: (input?: any, context?: Context) => Promise<DistributedTransaction>
  } => {
    if (!container) {
      container = [...MedusaModule.getLoadedModules().entries()].map(
        (_, mod) => mod
      )
    }

    const flow = new LocalWorkflow(workflowId, container) as LocalWorkflow & {
      run: (input?: any, context?: Context) => Promise<DistributedTransaction>
    }

    flow.run = async (input?, context?: Context) => {
      const transaction = await flow.begin(
        context?.transactionId ?? ulid(),
        inputAlias ? { [inputAlias]: input } : input,
        context
      )

      const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]
      if (failedStatus.includes(transaction.getState())) {
        throw new Error(
          transaction
            .getErrors()
            .map((err) => err.error?.message)
            .join("\n")
        )
      }

      return transaction
    }

    return flow
  }
}
