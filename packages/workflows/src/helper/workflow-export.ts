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

import { Workflows } from "../definitions"
import { ulid } from "ulid"

export const exportWorkflow = (workflowId: Workflows) => {
  return (
    container?:
      | (any & {
          __joinerConfig: JoinerServiceConfig
          __definition: ModuleDefinition
        })[]
      | MedusaContainer,
    context?: Context
  ): { run: (input?: any) => Promise<DistributedTransaction> } => {
    const flow = new LocalWorkflow(
      workflowId,
      container,
      context
    ) as LocalWorkflow & {
      run: (input?: any) => Promise<DistributedTransaction>
    }

    flow.run = async (input?) => {
      const transaction = await flow.begin(
        context?.transactionId ?? ulid(),
        input
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
