import {
  GraphResultSet,
  RemoteJoinerOptions,
  RemoteQueryFunction,
  RemoteQueryInput,
} from "@medusajs/framework/types"
import {
  createStep,
  createWorkflow,
  StepFunction,
  StepResponse,
} from "@medusajs/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"

type EntryStepInput<TEntry extends string> = RemoteQueryInput<TEntry> & {
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
  input: EntryStepInput<TEntry>
): ReturnType<StepFunction<EntryStepInput<TEntry>, GraphResultSet<TEntry>>> =>
  step(input)
