import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

/**
 * The remote query's details.
 */
export interface RemoteStepInput {
  /**
   * The fields to retrieve in the records.
   */
  fields: string[]
  /**
   * Filters, context variables, or pagination fields to apply when retrieving the records.
   */
  variables?: Record<string, any>
  /**
   * Throw an error if a record isn't found matching an ID specified in the filters.
   */
  throw_if_key_not_found?: boolean
  /**
   * Throw an error if a specified relation isn't found.
   */
  throw_if_relation_not_found?: boolean | string[]
  /**
   * Whether to retrieve the records as an array. If disabled, only one record is retrieved as an object.
   * 
   * @defaultValue true
   */
  list?: boolean
}

export interface EntryStepInput extends RemoteStepInput {
  /**
   * The name of the data model to retrieve its records.
   */
  entry_point: string
}

export interface ServiceStepInput extends RemoteStepInput {
  /**
   * The name of the module's service.
   */
  service: string
}

export const useRemoteQueryStepId = "use-remote-query"
/**
 * This step fetches data across modules using the remote query.
 * 
 * Learn more in the [Remote Query documentation](https://docs.medusajs.com/v2/advanced-development/modules/remote-query).
 * 
 * @example
 * 
 * To retrieve a list of records of a data model:
 * 
 * ```ts
 * import { 
 *   createWorkflow
 * } from "@medusajs/workflows-sdk"
 * import {
 *   useRemoteQueryStep
 * } from "@medusajs/core-flows"
 * 
 * const helloWorldWorkflow = createWorkflow(
 *   "hello-world",
 *   () => {
 *     const products = useRemoteQueryStep({
 *       entry_point: "product",
 *       fields: [
 *         "*",
 *         "variants.*"
 *       ]
 *     })
 *   }
 * )
 * ```
 * 
 * To retrieve a single item instead of a an array:
 * 
 * ```ts
 * import { 
 *   createWorkflow
 * } from "@medusajs/workflows-sdk"
 * import {
 *   useRemoteQueryStep
 * } from "@medusajs/core-flows"
 * 
 * const helloWorldWorkflow = createWorkflow(
 *   "hello-world",
 *   () => {
 *     const product = useRemoteQueryStep({
 *       entry_point: "product",
 *       fields: [
 *         "*",
 *         "variants.*"
 *       ],
 *       variables: {
 *         filters: {
 *           id: "123"
 *         }
 *       },
 *       list: false
 *     })
 *   }
 * )
 * ```
 * 
 * To throw an error if a record isn't found matching the specified ID:
 * 
 * ```ts
 * import { 
 *   createWorkflow
 * } from "@medusajs/workflows-sdk"
 * import {
 *   useRemoteQueryStep
 * } from "@medusajs/core-flows"
 * 
 * const helloWorldWorkflow = createWorkflow(
 *   "hello-world",
 *   () => {
 *     const product = useRemoteQueryStep({
 *       entry_point: "product",
 *       fields: [
 *         "*",
 *         "variants.*"
 *       ],
 *       variables: {
 *         filters: {
 *           id: "123"
 *         }
 *       },
 *       list: false,
 *       throw_if_key_not_found: true
 *     })
 *   }
 * )
 * ```
 */
export const useRemoteQueryStep = createStep(
  useRemoteQueryStepId,
  async (data: EntryStepInput | ServiceStepInput, { container }) => {
    const { list = true, fields, variables } = data

    const query = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    const isUsingEntryPoint = "entry_point" in data

    const queryObjectConfig = {
      fields,
      variables,
      entryPoint: isUsingEntryPoint ? data.entry_point : undefined,
      service: !isUsingEntryPoint ? data.service : undefined,
    } as Parameters<typeof remoteQueryObjectFromString>[0]

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
