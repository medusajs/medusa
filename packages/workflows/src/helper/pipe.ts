import {
  TransactionMetadata,
  WorkflowStepHandler,
} from "@medusajs/orchestration"
import { Context, MedusaContainer, SharedContext } from "@medusajs/types"

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
}

export type WorkflowArguments<T = any> = {
  container: MedusaContainer
  payload: unknown
  data: T
  metadata: TransactionMetadata
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

    for (const key in input) {
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

    return functions.reduce(async (_, fn) => {
      const result = await fn({
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
  }
}
