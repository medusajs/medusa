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
   * Values written by `set()` since the in-flight fetch started. That fetch may
   * have read the database before this process flipped the version, so its
   * answer would otherwise drop an entry we know is active.
   */
  protected writesSinceFetchStarted_?: Map<string, ActiveIndexVersion>

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
    if (!this.refreshing_) {
      const writes = (this.writesSinceFetchStarted_ = new Map<
        string,
        ActiveIndexVersion
      >())

      this.refreshing_ = this.fetchAll_()
        .then((values) => {
          for (const [name, value] of writes) {
            values.set(name, value)
          }

          this.values_ = values
          this.fetchedAt_ = Date.now()
        })
        .finally(() => {
          this.refreshing_ = undefined

          if (this.writesSinceFetchStarted_ === writes) {
            this.writesSinceFetchStarted_ = undefined
          }
        })
    }

    return this.refreshing_
  }

  /** Sets one value directly, e.g. right after this process itself flips it. */
  set(name: string, value: ActiveIndexVersion): void {
    this.values_.set(name, value)
    this.writesSinceFetchStarted_?.set(name, value)
  }

  invalidate(): void {
    this.fetchedAt_ = 0
    this.values_.clear()
    // Everything known is dropped on purpose, including writes an in-flight
    // fetch would otherwise carry over.
    this.writesSinceFetchStarted_?.clear()
  }
}
