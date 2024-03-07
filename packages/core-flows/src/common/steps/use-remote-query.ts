import { remoteQueryObjectFromString } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  entry_point: string
  fields: string[]
  variables?: Record<string, any>
}

export const useRemoteQueryStepId = "use-remote-query"
export const useRemoteQueryStep = createStep(
  useRemoteQueryStepId,
  async (data: StepInput, { container }) => {
    const query = container.resolve("remoteQuery")

    const queryObject = remoteQueryObjectFromString({
      entryPoint: data.entry_point,
      fields: data.fields,
      variables: data.variables,
    })

    const result = await query(queryObject)

    return new StepResponse(result)
  }
)
