import { MedusaError } from "@medusajs/framework/utils"

export type ActiveIndexVersion = {
  physical_name: string
  provider: string
  version: number
}

type IndexVersionState = {
  active?: ActiveIndexVersion
  building?: ActiveIndexVersion
}

const SOFT_TTL_MS = 30_000
const HARD_TTL_MS = 10 * 60_000

/**
 * Per-index cache of the active and (if any) currently-building version,
 * since either can change from another replica finishing/starting a build.
 * Fresh for SOFT_TTL_MS, stale-while-revalidate until HARD_TTL_MS, then
 * blocks for a fresh fetch. A failed background refresh doesn't reset the
 * clock.
 */
export class ActiveIndexVersionCache {
  protected values_ = new Map<string, IndexVersionState>()
  // `null`, not `0` — `0` is falsy too, and a mocked clock could start there.
  protected fetchedAt_: number | null = null
  protected refreshing_?: Promise<void>

  constructor(
    protected readonly fetchAll_: () => Promise<Map<string, IndexVersionState>>
  ) {}

  async get(name: string): Promise<ActiveIndexVersion> {
    const state = await this.resolve(name)

    if (!state.active) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Search index "${name}" has no active version yet. It has to be migrated and seeded first.`
      )
    }

    return state.active
  }

  /** The version currently being built for this index, if any. Never throws. */
  async getBuilding(name: string): Promise<ActiveIndexVersion | undefined> {
    return (await this.resolve(name)).building
  }

  protected async resolve(name: string): Promise<IndexVersionState> {
    if (this.fetchedAt_ === null) {
      await this.refresh()
      return this.values_.get(name) ?? {}
    }

    const age = Date.now() - this.fetchedAt_

    if (age >= HARD_TTL_MS) {
      await this.refresh()
    } else if (age >= SOFT_TTL_MS && !this.refreshing_) {
      this.refreshing_ = this.refresh()
        // Left stale on purpose: `fetchedAt_` stays untouched on failure.
        .catch(() => {})
        // Cleared here since `refresh()`'s own clear never runs on rejection.
        .finally(() => {
          this.refreshing_ = undefined
        })
    }

    return this.values_.get(name) ?? {}
  }

  protected async refresh(): Promise<void> {
    this.values_ = await this.fetchAll_()
    this.fetchedAt_ = Date.now()
    this.refreshing_ = undefined
  }

  /** Sets the active value directly, e.g. right after this process itself flips it. */
  setActive(name: string, value: ActiveIndexVersion): void {
    this.values_.set(name, { ...this.values_.get(name), active: value })
  }

  /** Marks, or clears, the version currently building for one index. */
  setBuilding(name: string, value: ActiveIndexVersion | undefined): void {
    this.values_.set(name, { ...this.values_.get(name), building: value })
  }

  invalidate(): void {
    this.fetchedAt_ = null
    this.values_.clear()
  }
}
