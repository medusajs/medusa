import {
  TransactionMetadata,
  WorkflowStepHandler,
} from "@medusajs/orchestration"
import { Context, MedusaContainer, SharedContext } from "@medusajs/types"

import { DistributedTransaction } from "@medusajs/orchestration"
import { InputAlias } from "../definitions"

type WorkflowStepMiddlewareReturn = {
  alias: string
  value: any
}

type WorkflowStepMiddlewareInput = {
  from: string
  alias: string
}

interface PipelineInput {
  inputAlias?: InputAlias | string
  invoke?: WorkflowStepMiddlewareInput | WorkflowStepMiddlewareInput[]
  compensate?: WorkflowStepMiddlewareInput | WorkflowStepMiddlewareInput[]
  onComplete?: (args: WorkflowOnCompleteArguments) => {}
}

export type WorkflowArguments<T = any> = {
  container: MedusaContainer
  payload: unknown
  data: T
  metadata: TransactionMetadata
  context: Context | SharedContext
}

export type WorkflowOnCompleteArguments<T = any> = {
  container: MedusaContainer
  payload: unknown
  data: T
  metadata: TransactionMetadata
  transaction: DistributedTransaction
  context: Context | SharedContext
}

export type PipelineHandler<T extends any = undefined> = (
  args: WorkflowArguments
) => T extends undefined
  ? Promise<WorkflowStepMiddlewareReturn | WorkflowStepMiddlewareReturn[]>
  : T

export function pipe<T = undefined>(
  input: PipelineInput,
  ...functions: [...PipelineHandler[], PipelineHandler<T>]
): WorkflowStepHandler {
  return async ({
    container,
    payload,
    invoke,
    compensate,
    metadata,
    transaction,
    context,
  }) => {
    const data = {}

    const original = {
      invoke: invoke ?? {},
      compensate: compensate ?? {},
    }

    if (input.inputAlias) {
      Object.assign(original.invoke, { [input.inputAlias]: payload })
    }

    const dataKeys = ["invoke", "compensate"]
    for (const key of dataKeys) {
      if (!input[key]) {
        continue
      }

      if (!Array.isArray(input[key])) {
        input[key] = [input[key]]
      }

      for (const action of input[key]) {
        if (action?.alias) {
          data[action.alias] = original[key][action.from]
        }
      }
    }

    const response = functions.reduce(async (_, fn) => {
      let result = await fn({
        container,
        payload,
        data,
        metadata,
        context: context as Context,
      })

      if (Array.isArray(result)) {
        for (const action of result) {
          if (action?.alias) {
            data[action.alias] = action.value
          }
        }
      } else if ((result as WorkflowStepMiddlewareReturn)?.alias) {
        data[(result as WorkflowStepMiddlewareReturn).alias] = (
          result as WorkflowStepMiddlewareReturn
        ).value
      }

      return result
    }, {})

    if (typeof input.onComplete === "function") {
      const dataCopy = JSON.parse(JSON.stringify(data))
      await input.onComplete({
        container,
        payload,
        data: dataCopy,
        metadata,
        transaction,
        context: context as Context,
      })
    }

    return response
  }
}
