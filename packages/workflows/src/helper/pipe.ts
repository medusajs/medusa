import { Context, MedusaContainer, SharedContext } from "@medusajs/types"
import {
  TransactionMetadata,
  WorkflowStepHandler,
} from "@medusajs/orchestration"

import { InputAlias } from "../definitions"

type WorkflowStepReturn = {
  alias: string
  value: any
}

type WorkflowStepInput = {
  from: string
  alias: string
}

interface PipelineInput {
  inputAlias?: InputAlias | string
  invoke?: WorkflowStepInput | WorkflowStepInput[]
  compensate?: WorkflowStepInput | WorkflowStepInput[]
}

export type WorkflowArguments = {
  container: MedusaContainer
  payload: unknown
  data: any
  metadata: TransactionMetadata
  context: Context | SharedContext
}

export type PipelineHandler = (
  args: WorkflowArguments
) => Promise<WorkflowStepReturn | WorkflowStepReturn[]>

export function pipe(
  input: PipelineInput,
  ...functions: PipelineHandler[]
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
      } else if (result?.alias) {
        data[result.alias] = result.value
      }

      return result
    }, {})
  }
}
