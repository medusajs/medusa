import { Logger } from "@medusajs/framework/types"

// Seeding is background work with nothing waiting on it, so it can afford to
// sit out a rate limit rather than fail the run.
const MAX_RETRIES = 5
const INITIAL_DELAY = 2_000
const MAX_DELAY = 60_000

export function isRateLimitError(error: unknown): boolean {
  return (error as { status?: number })?.status === 429
}

export function parseRetryAfter(
  header: string | null | undefined
): number | undefined {
  const seconds = Number(header)

  return header && Number.isFinite(seconds) ? seconds * 1000 : undefined
}

export function rateLimitDelay(
  attempt: number,
  retryAfter?: number,
  random: () => number = Math.random
): number {
  if (retryAfter !== undefined) {
    return Math.min(retryAfter, MAX_DELAY)
  }

  const exponential = Math.min(INITIAL_DELAY * 2 ** attempt, MAX_DELAY)

  // Jittered so replicas rate limited together don't all come back at once.
  return Math.round(exponential * (0.5 + random() * 0.5))
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retryOnRateLimit<T>(
  operation: () => Promise<T>,
  { label, logger }: { label: string; logger?: Pick<Logger, "warn"> }
): Promise<T> {
  let attempt = 0

  for (;;) {
    try {
      return await operation()
    } catch (error) {
      if (!isRateLimitError(error) || attempt >= MAX_RETRIES) {
        throw error
      }

      const delay = rateLimitDelay(attempt, error.retry_after)

      logger?.warn(
        `[Search] Rate limited on ${label}: waiting ${delay}ms before retry ${
          attempt + 1
        }/${MAX_RETRIES} (${error.message})`
      )

      await sleep(delay)
      attempt++
    }
  }
}
