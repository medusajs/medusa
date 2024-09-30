import {
  RemoteJoinerOptions,
  RemoteQueryEntryPoints,
  RemoteQueryFunction,
  RemoteQueryInput,
} from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"

type EntryStepInput<TEntry> = RemoteQueryInput<TEntry> & {
  options?: RemoteJoinerOptions
}

const useQueryGraphStepId = "use-query-graph-step"

const step = createStep(
  useQueryGraphStepId,
  async (input: EntryStepInput<any>, { container }) => {
    const query = container.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.QUERY
    )
    const { options, ...queryConfig } = input

    const result = await query.graph(queryConfig as any, options)
    return new StepResponse(result)
  }
)

export const useQueryGraphStep = <const TEntry extends string>(
  queryConfig: TEntry extends keyof RemoteQueryEntryPoints
    ? RemoteQueryInput<TEntry>
    : any,
  options?: RemoteJoinerOptions
) => null
