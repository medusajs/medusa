import {
  DistributedTransaction,
  LocalWorkflow,
  TransactionHandlerType,
  TransactionState,
  TransactionStepError,
} from "@medusajs/orchestration"
import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"

import { MedusaModule } from "@medusajs/modules-sdk"
import { EOL } from "os"
import { ulid } from "ulid"
import { SymbolWorkflowWorkflowData } from "../utils/composer"

export type FlowRunOptions<TData = unknown> = {
  input?: TData
  context?: Context
  resultFrom?: string | string[]
  throwOnError?: boolean
}

export type WorkflowResult<TResult = unknown> = {
  errors: TransactionStepError[]
  transaction: DistributedTransaction
  result: TResult
}

export const exportWorkflow = <TData = unknown, TResult = unknown>(
  workflowId: string,
  defaultResult?: string,
  dataPreparation?: (data: TData) => Promise<unknown>
) => {
  return function <TDataOverride = undefined, TResultOverride = undefined>(
    container?: LoadedModule[] | MedusaContainer
  ): Omit<LocalWorkflow, "run"> & {
    run: (
      args?: FlowRunOptions<
        TDataOverride extends undefined ? TData : TDataOverride
      >
    ) => Promise<
      WorkflowResult<
        TResultOverride extends undefined ? TResult : TResultOverride
      >
    >
  } {
    if (!container) {
      container = MedusaModule.getLoadedModules().map(
        (mod) => Object.values(mod)[0]
      )
    }

    const flow = new LocalWorkflow(workflowId, container)

    const originalRun = flow.run.bind(flow)
    const newRun = async (
      { input, context, throwOnError, resultFrom }: FlowRunOptions = {
        throwOnError: true,
        resultFrom: defaultResult,
      }
    ) => {
      resultFrom ??= defaultResult
      throwOnError ??= true

      if (typeof dataPreparation === "function") {
        try {
          const copyInput = input ? JSON.parse(JSON.stringify(input)) : input
          input = await dataPreparation(copyInput as TData)
        } catch (err) {
          if (throwOnError) {
            throw new Error(
              `Data preparation failed: ${err.message}${EOL}${err.stack}`
            )
          }
          return {
            errors: [err],
          }
        }
      }

      const transaction = await originalRun(
        context?.transactionId ?? ulid(),
        input,
        context
      )

      const errors = transaction.getErrors(TransactionHandlerType.INVOKE)

      const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]
      if (failedStatus.includes(transaction.getState()) && throwOnError) {
        const errorMessage = errors
          ?.map((err) => `${err.error?.message}${EOL}${err.error?.stack}`)
          ?.join(`${EOL}`)
        throw new Error(errorMessage)
      }

      let result: any = undefined

      if (resultFrom) {
        if (Array.isArray(resultFrom)) {
          result = resultFrom.map((from) => {
            const res = transaction.getContext().invoke?.[from]
            return res?.__type === SymbolWorkflowWorkflowData ? res.output : res
          })
        } else {
          const res = transaction.getContext().invoke?.[resultFrom]
          result = res?.__type === SymbolWorkflowWorkflowData ? res.output : res
        }
      }

      return {
        errors,
        transaction,
        result,
      }
    }
    flow.run = newRun as any

    return flow as unknown as LocalWorkflow & {
      run: (
        args?: FlowRunOptions<
          TDataOverride extends undefined ? TData : TDataOverride
        >
      ) => Promise<
        WorkflowResult<
          TResultOverride extends undefined ? TResult : TResultOverride
        >
      >
    }
  }
}
