import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

interface StepInput {
  fields: string[]
  variables?: Record<string, any>
  throw_if_key_not_found?: boolean
  throw_if_relation_not_found?: boolean | string[]
  list?: boolean
}

interface EntryStepInput extends StepInput {
  entry_point: string
}

interface ServiceStepInput extends StepInput {
  service: string
}

export const useRemoteQueryStepId = "use-remote-query"
export const useRemoteQueryStep = createStep(
  useRemoteQueryStepId,
  async (data: EntryStepInput | ServiceStepInput, { container }) => {
    const { list = true, fields, variables } = data

    const query = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    const queryObjectConfig = {
      fields,
      variables,
    } as Parameters<typeof remoteQueryObjectFromString>[0]

    const isEntryPoint = "entry_point" in data
    if (isEntryPoint) {
      queryObjectConfig["entry_point"] = data.entry_point
    } else {
      queryObjectConfig["service"] = data.service
    }

    const queryObject = remoteQueryObjectFromString(queryObjectConfig)

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
