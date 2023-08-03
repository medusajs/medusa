import { Context, MedusaContainer, SharedContext } from "@medusajs/types"
import {
  TransactionMetadata,
  WorkflowStepHandler,
} from "@medusajs/orchestration"

import { InputAlias } from "../definitions"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

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
  onComplete?: PipelineHandler
}

/**
 * Event emitter handler helper to be used on complete as part of a pipe
 *
 * @example
 * pipe({
 *   onComplete: emitEventHandler("order.completed", async (data) => ([data.order.id]))
 * })
 *
 * @param eventName
 * @param fn
 * @param options
 */
const emitEventHandler = (
  eventName: string,
  fn: (data) => Promise<unknown[]>,
  options?: Record<string, unknown>
) => {
  return async ({ container, data }: WorkflowArguments) => {
    const eventBusModule = container.resolve(
      ModulesDefinition[Modules.EVENT_BUS].registrationName
    )

    let dataToEmits = await fn(data)
    dataToEmits = Array.isArray(dataToEmits) ? dataToEmits : [dataToEmits]

    return await eventBusModule.emit(
      dataToEmits.map((d) => ({ data: d, eventName, options }))
    )
  }
}

export type WorkflowArguments = {
  container: MedusaContainer
  payload: unknown
  data: any
  metadata: TransactionMetadata
  context: Context | SharedContext
}

export type PipelineHandlerResult<T = undefined> = T extends undefined
  ? WorkflowStepMiddlewareReturn | WorkflowStepMiddlewareReturn[]
  : T

export type PipelineHandler<T extends any = undefined> = (
  args: WorkflowArguments
) => PipelineHandlerResult<T> | Promise<PipelineHandlerResult<T>>

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
