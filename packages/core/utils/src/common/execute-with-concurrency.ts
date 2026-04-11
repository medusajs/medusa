import { promiseAll } from "./promise-all"

/**
 * Execute functions with a concurrency limit
 * @param functions Array of functions to execute in parallel
 * @param concurrency Maximum number of concurrent executions
 */
export async function executeWithConcurrency<T>(
  functions: (() => Promise<T>)[],
  concurrency: number
): Promise<PromiseSettledResult<Awaited<T>>[]> {
  const functionsLength = functions.length
  const results: PromiseSettledResult<Awaited<T>>[] = new Array(functionsLength)
  let currentIndex = 0

  const executeNext = async (): Promise<void> => {
    while (currentIndex < functionsLength) {
      const index = currentIndex++
      const result = await Promise.allSettled([functions[index]()])
      results[index] = result[0]
    }
  }

  const workers: Promise<void>[] = []
  for (let i = 0; i < Math.min(concurrency, functionsLength); i++) {
    workers.push(executeNext())
  }

  await promiseAll(workers)

  return results
}
