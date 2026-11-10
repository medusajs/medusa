import { Client } from "pg"

/**
 * Counts queries issued on a pg client while that same client is still
 * executing a previous query.
 */
export function trackOverlappingQueries() {
  const originalQuery = Client.prototype.query
  const inFlight = new WeakMap<object, number>()
  const overlapping: string[] = []

  Client.prototype.query = function (this: object, ...args: any[]) {
    const running = inFlight.get(this) ?? 0
    if (running > 0) {
      const config = args[0]
      overlapping.push(typeof config === "string" ? config : config?.text)
    }
    inFlight.set(this, running + 1)

    let finished = false
    const done = () => {
      if (!finished) {
        finished = true
        inFlight.set(this, (inFlight.get(this) ?? 1) - 1)
      }
    }

    const callbackIndex = args.findIndex((arg) => typeof arg === "function")
    if (callbackIndex !== -1) {
      const callback = args[callbackIndex]
      args[callbackIndex] = (...cbArgs: unknown[]) => {
        done()
        return callback(...cbArgs)
      }
    }

    const result = (originalQuery as any).apply(this, args)
    if (result && typeof result.then === "function") {
      result.then(done, done)
    } else if (result && typeof result.once === "function") {
      result.once("end", done)
      result.once("error", done)
    }
    return result
  } as typeof Client.prototype.query

  return {
    overlapping,
    restore: () => {
      Client.prototype.query = originalQuery
    },
  }
}
