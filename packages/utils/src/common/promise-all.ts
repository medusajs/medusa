import { EOL } from "os"

/**
 * Promise.allSettled with error handling, safe alternative to Promise.all
 * @param promises
 * @param aggregateErrors
 */
export async function promiseAll<T extends readonly unknown[] | []>(
  promises: T,
  { aggregateErrors } = { aggregateErrors: false }
): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
  const states = await Promise.allSettled(promises)

  const rejected = (states as PromiseSettledResult<unknown>[]).filter(
    (state): state is PromiseRejectedResult => state.status === "rejected"
  )

  if (rejected.length) {
    const aggregatedErrors = aggregateErrors
      ? rejected.map((state) => state.reason?.message ?? state.reason)
      : [rejected[0].reason]
    throw new Error(aggregatedErrors.join(EOL))
  }

  return (states as PromiseSettledResult<unknown>[]).map(
    (state) => (state as PromiseFulfilledResult<T>).value
  ) as unknown as Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>
}
