import {
  TransactionMetadata,
  WorkflowStepHandler,
} from "@medusajs/orchestration"
import { Context, MedusaContainer, SharedContext } from "@medusajs/types"

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

    // payload = { products: [] }

    // inputAlias = "TEST"
    // original.invoke = { from: "LOL", alias: "LOL2" }

    if (input.inputAlias) {
      Object.assign(original.invoke, { [input.inputAlias]: payload })
    }

    // original.invoke = { "TEST": products, from: "LOL", alias: "LOL2" }

    for (const key in input) {
      if (!input[key]) {
        continue
      }

      // key = "invoke"

      if (!Array.isArray(input[key])) {
        input[key] = [input[key]]
      }

      for (const action of input[key]) {
        // action = "alias"
        if (action?.alias) {
          data[action.alias] = original[key][action.from]
          // data = { LOL2: "LOL" }
        }
      }
    }
    // data = { LOL2: "LOL" }
    // payload =

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
      } else if (result?.alias) {
        data[result.alias] = result.value
      }

      return result
    }, {})
  }
}
