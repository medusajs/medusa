/**
 * Promise.allSettled with error handling, safe alternative to Promise.all
 * @param promises
 */
export async function promiseAll<T = unknown>(
  promises: Promise<T>[]
): Promise<T[]> {
  const states = await Promise.allSettled(promises)
  const rejected = states.filter((state) => state.status === "rejected")
  if (rejected.length) {
    throw (rejected[0] as PromiseRejectedResult).reason
  }

  return states.map((state) => (state as PromiseFulfilledResult<T>).value)
}
