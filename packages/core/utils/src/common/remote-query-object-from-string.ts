import { RemoteQueryEntryPointFields } from "@medusajs/types"
import { isObject } from "../common"

/**
 * Convert a string fields array to a remote query object
 * @param config - The configuration object
 *
 * @example
 * const fields = [
 *   "id",
 *   "created_at",
 *   "updated_at",
 *   "deleted_at",
 *   "url",
 *   "metadata",
 *   "tags.id",
 *   "tags.created_at",
 *   "tags.updated_at",
 *   "tags.deleted_at",
 *   "tags.value",
 *   "options.id",
 *   "options.created_at",
 *   "options.updated_at",
 *   "options.deleted_at",
 *   "options.title",
 *   "options.product_id",
 *   "options.metadata",
 *   "options.values.id",
 *   "options.values.created_at",
 *   "options.values.updated_at",
 *   "options.values.deleted_at",
 *   "options.values.value",
 *   "options.values.option_id",
 *   "options.values.variant_id",
 *   "options.values.metadata",
 * ]
 *
 * const remoteQueryObject = remoteQueryObjectFromString({
 *   entryPoint: "product",
 *   variables: {},
 *   fields,
 * })
 *
 * console.log(remoteQueryObject)
 * // {
 * //   product: {
 * //     __args: {},
 * //     fields: [
 * //       "id",
 * //       "created_at",
 * //       "updated_at",
 * //       "deleted_at",
 * //       "url",
 * //       "metadata",
 * //     ],
 * //
 * //     tags: {
 * //       fields: ["id", "created_at", "updated_at", "deleted_at", "value"],
 * //     },
 * //
 * //     options: {
 * //       fields: [
 * //         "id",
 * //         "created_at",
 * //         "updated_at",
 * //         "deleted_at",
 * //         "title",
 * //         "product_id",
 * //         "metadata",
 * //       ],
 * //       values: {
 * //         fields: [
 * //           "id",
 * //           "created_at",
 * //           "updated_at",
 * //           "deleted_at",
 * //           "value",
 * //           "option_id",
 * //           "variant_id",
 * //           "metadata",
 * //         ],
 * //       },
 * //     },
 * //   },
 * // }
 */
export function remoteQueryObjectFromString<
  const EntryPoint extends string,
  Fields = RemoteQueryEntryPointFields<EntryPoint>
>(
  config:
    | {
        entryPoint: EntryPoint
        variables?: any
        fields: Fields
      }
    | {
        service: string
        variables?: any
        fields: string[]
      }
): object {
  const { entryPoint, service, variables, fields } = {
    ...config,
    entryPoint: "entryPoint" in config ? config.entryPoint : undefined,
    service: "service" in config ? config.service : undefined,
  }

  const entryKey = (entryPoint ?? service) as string

  const remoteJoinerConfig: object = {
    [entryKey]: {
      fields: [],
      isServiceAccess: !!service, // specifies if the entry point is a service
    },
  }

  const usedVariables = new Set()

  for (const field of fields as string[]) {
    if (!field.includes(".")) {
      remoteJoinerConfig[entryKey]["fields"].push(field)
      continue
    }

    const fieldSegments = field.split(".")
    const fieldProperty = fieldSegments.pop()

    let combinedPath = ""

    const deepConfigRef = fieldSegments.reduce((acc, curr) => {
      combinedPath = combinedPath ? combinedPath + "." + curr : curr

      if (isObject(variables) && combinedPath in variables) {
        acc[curr] ??= {}
        acc[curr]["__args"] = variables[combinedPath]
        usedVariables.add(combinedPath)
      } else {
        acc[curr] ??= {}
      }

      return acc[curr]
    }, remoteJoinerConfig[entryKey])

    deepConfigRef["fields"] ??= []
    deepConfigRef["fields"].push(fieldProperty)
  }

  const topLevelArgs = {}
  for (const key of Object.keys(variables ?? {})) {
    if (!usedVariables.has(key)) {
      topLevelArgs[key] = variables[key]
    }
  }

  remoteJoinerConfig[entryKey]["__args"] = topLevelArgs ?? {}

  return remoteJoinerConfig
}
