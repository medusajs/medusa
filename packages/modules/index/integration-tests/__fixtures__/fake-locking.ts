import { ILockingModule } from "@medusajs/framework/types"

/**
 * In-memory locking module. Acquiring a key that is already held throws,
 * which emulates the contention between separate processes the index
 * module guards against (each process would have its own owner id).
 */
export class FakeLocking implements ILockingModule {
  locks: Map<string, string | null> = new Map()

  async execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: { timeout?: number }
  ): Promise<T> {
    await this.acquire(keys)

    try {
      return await job()
    } finally {
      await this.release(keys)
    }
  }

  async acquire(
    keys: string | string[],
    args?: { ownerId?: string | null; expire?: number }
  ): Promise<void> {
    const keys_ = Array.isArray(keys) ? keys : [keys]

    for (const key of keys_) {
      if (this.locks.has(key)) {
        throw new Error(`Lock for key "${key}" is already acquired`)
      }
    }

    for (const key of keys_) {
      this.locks.set(key, args?.ownerId ?? null)
    }
  }

  async release(
    keys: string | string[],
    args?: { ownerId?: string | null }
  ): Promise<boolean> {
    const keys_ = Array.isArray(keys) ? keys : [keys]

    for (const key of keys_) {
      this.locks.delete(key)
    }

    return true
  }

  async releaseAll(): Promise<void> {
    this.locks.clear()
  }
}
