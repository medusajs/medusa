import { EOL } from "os"

const getMessageError = (state: PromiseRejectedResult) =>
  state.reason.message ?? state.reason

const isRejected = (
  state: PromiseSettledResult<unknown>
): state is PromiseRejectedResult => {
  return state.status === "rejected"
}

const getValue = (state: PromiseFulfilledResult<unknown>) => state.value

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
    isRejected
  )

  if (rejected.length) {
    const aggregatedErrors = aggregateErrors
      ? rejected.map(getMessageError)
      : [getMessageError(rejected[0])]
    throw new Error(aggregatedErrors.join(EOL))
  }

  return (states as PromiseFulfilledResult<unknown>[]).map(
    getValue
  ) as unknown as Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>
}
