/**
 * Convert a string fields array to a remote query object
 * @param entryPoint
 * @param variables
 * @param fields
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
export function remoteQueryObjectFromString({
  entryPoint,
  variables,
  fields,
}: {
  entryPoint: string
  variables?: any
  fields: string[]
}): object {
  const remoteJoinerConfig: object = {
    [entryPoint]: {
      fields: [],
    },
  }

  if (variables) {
    remoteJoinerConfig[entryPoint]["__args"] = variables
  }

  for (const field of fields) {
    if (!field.includes(".")) {
      remoteJoinerConfig[entryPoint]["fields"].push(field)
      continue
    }

    const fieldSegments = field.split(".")
    const fieldProperty = fieldSegments.pop()

    const deepConfigRef = fieldSegments.reduce((acc, curr) => {
      acc[curr] ??= {}
      return acc[curr]
    }, remoteJoinerConfig[entryPoint])

    deepConfigRef["fields"] ??= []
    deepConfigRef["fields"].push(fieldProperty)
  }

  return remoteJoinerConfig
}
