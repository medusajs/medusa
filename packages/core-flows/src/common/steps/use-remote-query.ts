import { remoteQueryObjectFromString } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  entry_point: string
  fields: string[]
  variables?: Record<string, any>
  throw_if_key_not_found?: boolean
  throw_if_relation_not_found?: boolean | string[]
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

    const config = {
      throwIfKeyNotFound: !!data.throw_if_key_not_found,
      throwIfRelationNotFound: data.throw_if_key_not_found
        ? data.throw_if_relation_not_found
        : undefined,
    }

    const result = await query(queryObject, undefined, config)

    return new StepResponse(result)
  }
)
