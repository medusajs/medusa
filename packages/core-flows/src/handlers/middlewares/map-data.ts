import { WorkflowArguments } from "@medusajs/workflows-sdk"

/**
 * Middleware for map input data to a key/s.
 *
 * @param mapFn - apply function on the input data and return result as the middleware output
 * @param alias - key to save output under (if `merge === false`)
 */
export function mapData<T, S>(mapFn: (arg: T) => S, alias = "mapData") {
  return async function ({ data }: WorkflowArguments<T>) {
    return {
      alias,
      value: mapFn(data),
    }
  }
}
