import {
  DistributedTransaction,
  TransactionMetadata,
  WorkflowStepHandler,
} from "@medusajs/orchestration"
import { Context, MedusaContainer, SharedContext } from "@medusajs/types"
import { InputAlias } from "../definitions"
import { aggregateData } from "./aggregate"

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
    transaction,
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

    const dataKeys = ["invoke", "compensate"]
    for (const key of dataKeys) {
      if (!input[key]) {
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

    functions.splice(functions.length - 2, 0, aggregateData())

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

    return finalResult
  }
}
