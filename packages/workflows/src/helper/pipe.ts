import { Context, MedusaContainer, SharedContext } from "@medusajs/types"
import {
  TransactionMetadata,
  WorkflowStepHandler,
} from "@medusajs/orchestration"

import { InputAlias } from "../definitions"

export type WorkflowStepMiddlewareReturn = {
  alias?: string
  value: any
}

export type WorkflowStepMiddlewareInput = {
  from: string
  alias?: string
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
) => Promise<
  T extends undefined
    ? WorkflowStepMiddlewareReturn | WorkflowStepMiddlewareReturn[]
    : T
>

export function pipe<T>(
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
    let data = {}

    const original = {
      invoke: invoke ?? {},
      compensate: compensate ?? {},
    }

    if (input.inputAlias) {
      Object.assign(original.invoke, { [input.inputAlias]: payload })
    }

    for (const key in input) {
      if (!input[key] || key === "inputAlias") {
        continue
      }

      if (!Array.isArray(input[key])) {
        input[key] = [input[key]]
      }

      for (const action of input[key]) {
        if (action.alias) {
          data[action.alias] = original[key][action.from]
        } else {
          data[action.from] = original[key][action.from]
        }
      }
    }

    let finalResult
    for (const fn of functions) {
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
      } else if (
        result &&
        "alias" in (result as WorkflowStepMiddlewareReturn)
      ) {
        if ((result as WorkflowStepMiddlewareReturn).alias) {
          data[(result as WorkflowStepMiddlewareReturn).alias!] = (
            result as WorkflowStepMiddlewareReturn
          ).value
        } else {
          data = (result as WorkflowStepMiddlewareReturn).value
        }
      }

      finalResult = result
    }

    return finalResult
  }
}
