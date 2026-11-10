export interface Clock {
  now(): number
  setTimeout(fn: () => void, ms: number): unknown
  clearTimeout(handle: unknown): void
}

// setTimeout overflows above this and fires immediately.
export const MAX_TIMER_MS = 2 ** 31 - 1

export const systemClock: Clock = {
  now: () => Date.now(),
  setTimeout: (fn, ms) =>
    setTimeout(fn, Math.min(Math.max(ms, 0), MAX_TIMER_MS)),
  clearTimeout: (handle) => clearTimeout(handle as NodeJS.Timeout),
}

/**
 * A delay up to `ratio` shorter than `ms`, so instances that started together
 * spread their periodic work out instead of hitting the store at once.
 */
export function jittered(ms: number, ratio: number) {
  return ms * (1 - Math.random() * ratio)
}

export function sleep(clock: Clock, ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    const handle = clock.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      clock.clearTimeout(handle)
      resolve()
    }
    signal?.addEventListener("abort", onAbort, { once: true })
  })
}
