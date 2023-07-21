import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import {
  DistributedTransaction,
  LocalWorkflow,
  TransactionState,
} from "@medusajs/orchestration"

import { EOL } from "os"
import { MedusaModule } from "@medusajs/modules-sdk"
import { Workflows } from "../definitions"
import { ulid } from "ulid"

type FlowRunOptions<TData = unknown> = {
  input?: TData
  context?: Context
  resultFrom?: string | string[]
  throwOnError?: boolean
}

export const exportWorkflow = <TData = unknown>(
  workflowId: Workflows,
  defaultResult?: string
) => {
  return function <TDataOverride = undefined>(
    container?: LoadedModule[] | MedusaContainer
  ): Omit<LocalWorkflow, "run"> & {
    run: (
      args: FlowRunOptions<
        TDataOverride extends undefined ? TData : TDataOverride
      >
    ) => Promise<DistributedTransaction>
  } {
    if (!container) {
      container = MedusaModule.getLoadedModules().map(
        (mod) => Object.values(mod)[0]
      )
    }

    const flow = new LocalWorkflow(workflowId, container) as LocalWorkflow & {
      run: (args: FlowRunOptions) => Promise<DistributedTransaction>
    }

    const originalRun = flow.run.bind(flow)
    const newRun = async (
      { input, context, throwOnError, resultFrom }: FlowRunOptions = {
        throwOnError: true,
        resultFrom: defaultResult,
      }
    ) => {
      const transaction = await originalRun(
        context?.transactionId ?? ulid(),
        input,
        context
      )

      const errors = transaction.getErrors()

      const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]
      if (failedStatus.includes(transaction.getState()) && throwOnError) {
        const errorMessage = errors
          ?.map((err) => `${err.error?.message}${EOL}${err.error?.stack}`)
          ?.join(`${EOL}`)
        throw new Error(errorMessage)
      }

      let result: string | string[] | undefined = undefined

      if (resultFrom) {
        if (Array.isArray(resultFrom)) {
          result = resultFrom.map(
            (from) => transaction.getContext().invoke?.[from]
          )
        } else {
          result = transaction.getContext().invoke?.[resultFrom]
        }
      }

      return {
        errors,
        transaction,
        result,
      }
    }
    flow.run = newRun as any

    return flow
  }
}
