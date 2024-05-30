import { remoteQueryObjectFromString } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  entry_point: string
  fields: string[]
  variables?: Record<string, any>
  list?: boolean
}

export const useRemoteQueryStepId = "use-remote-query"
export const useRemoteQueryStep = createStep(
  useRemoteQueryStepId,
  async (data: StepInput, { container }) => {
    const { list = true, fields, variables, entry_point: entryPoint } = data
    const query = container.resolve("remoteQuery")

    const queryObject = remoteQueryObjectFromString({
      entryPoint,
      fields,
      variables,
    })

    const entities = await query(queryObject)
    const result = list ? entities : entities[0]

    return new StepResponse(result)
  }
)
