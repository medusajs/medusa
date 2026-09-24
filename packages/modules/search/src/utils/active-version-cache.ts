import { MedusaError } from "@medusajs/framework/utils"

export type ActiveIndexVersion = {
  physical_name: string
  provider: string
  version: number
}

const SOFT_TTL_MS = 30_000
const HARD_TTL_MS = 2 * 60_000

/**
 * Caches which physical index currently serves reads for every logical index,
 * since that can change out from under a running process when another
 * replica finishes seeding and flips it.
 *
 * Populated in one bulk fetch rather than one per index: there are never many
 * search indexes in an app, so listing them all is cheap, and it means
 * refreshing because of one index refreshes every other one for free.
 *
 * Fresh for `SOFT_TTL_MS`. Stale beyond that but still served while a
 * background refresh runs (stale-while-revalidate) — a failed refresh leaves
 * `fetchedAt_` untouched, so the age keeps counting from the last *successful*
 * fetch rather than resetting. Never served past `HARD_TTL_MS` since that last
 * success; a caller waits on a synchronous refetch instead.
 */
export class ActiveIndexVersionCache {
  protected values_ = new Map<string, ActiveIndexVersion>()
  protected fetchedAt_ = 0
  protected refreshing_?: Promise<void>
  /**
   * Writes from `set()` that land while a `refresh()` fetch is in flight.
   * They are newer than the read, so the refresh re-applies them after
   * replacing the map instead of discarding them.
   */
  protected inFlightWrites_?: Map<string, ActiveIndexVersion>

  constructor(
    protected readonly fetchAll_: () => Promise<Map<string, ActiveIndexVersion>>
  ) {}

  async get(
    name: string,
    { fresh = false }: { fresh?: boolean } = {}
  ): Promise<ActiveIndexVersion> {
    const age = Date.now() - this.fetchedAt_

    if (fresh || !this.fetchedAt_ || age >= HARD_TTL_MS) {
      await this.refresh()
    } else if (age >= SOFT_TTL_MS) {
      void this.refresh().catch(() => {
        // Left stale on purpose — `fetchedAt_` is untouched, so `HARD_TTL_MS`
        // keeps counting from the last success, not this failure.
      })
    }

    const value = this.values_.get(name)

    if (!value) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Search index "${name}" has no active version yet. It has to be migrated and seeded first.`
      )
    }

    return value
  }

  protected refresh(): Promise<void> {
    this.refreshing_ ??= (async () => {
      // Collected synchronously before the fetch starts, so every `set()`
      // that lands while the read below is in flight is recorded here.
      this.inFlightWrites_ = new Map<string, ActiveIndexVersion>()
      try {
        const values = await this.fetchAll_()
        this.values_ = values
        // The read may predate these writes (e.g. another replica activated
        // an index after the read started) — they win over the stale read.
        for (const [name, value] of this.inFlightWrites_) {
          this.values_.set(name, value)
        }
        this.fetchedAt_ = Date.now()
      } finally {
        this.inFlightWrites_ = undefined
        this.refreshing_ = undefined
      }
    })()

    return this.refreshing_
  }

  /** Sets one value directly, e.g. right after this process itself flips it. */
  set(name: string, value: ActiveIndexVersion): void {
    this.values_.set(name, value)
    this.inFlightWrites_?.set(name, value)
  }

  invalidate(): void {
    this.fetchedAt_ = 0
    this.values_.clear()
  }
}
