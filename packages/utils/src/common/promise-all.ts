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
    const aggregatedErrors = aggregateErrors
      ? rejected.map((state) => state.reason)
      : [rejected[0].reason]
    throw new Error(aggregatedErrors.join(EOL))
  }

  return states.map((state) => (state as PromiseFulfilledResult<T>).value)
}
