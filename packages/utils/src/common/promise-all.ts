import { EOL } from "os"

/**
 * Promise.allSettled with error handling, safe alternative to Promise.all
 * @param promises
 * @param aggregateErrors
 */
export async function promiseAll<T = unknown>(
  promises: Promise<T>[],
  { aggregateErrors } = { aggregateErrors: false }
): Promise<T[]> {
  const states = await Promise.allSettled(promises)

  const rejected = states.filter(
    (state) => state.status === "rejected"
  ) as PromiseRejectedResult[]

  if (rejected.length) {
    let aggregatedErrors = (rejected[0] as PromiseRejectedResult).reason
    if (aggregateErrors) {
      aggregatedErrors = rejected.reduce((errors, state) => {
        errors.push(state.reason)
        return errors
      }, [] as string[])
    }
    throw new Error(aggregatedErrors.join(EOL))
  }

  return states.map((state) => (state as PromiseFulfilledResult<T>).value)
}
