import { remoteQueryObjectFromString } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  entry_point: string
  fields: string[]
  variables?: Record<string, any>
  throw_if_key_not_found?: boolean
  throw_if_relation_not_found?: boolean | string[]
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

    const config = {
      throwIfKeyNotFound: !!data.throw_if_key_not_found,
      throwIfRelationNotFound: data.throw_if_key_not_found
        ? data.throw_if_relation_not_found
        : undefined,
    }

    const entities = await query(queryObject, undefined, config)
    const result = list ? entities : entities[0]

    return new StepResponse(result)
  }
)
