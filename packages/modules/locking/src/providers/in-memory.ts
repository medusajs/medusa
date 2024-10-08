import { ILockingProvider, MedusaContainer } from "@medusajs/types"

type LockInfo = {
  ownerId: string | null
  expiration: number | null
  acquiredAt: number
}

export class InMemoryLockingProvider implements ILockingProvider {
  static identifier = "in-memory"

  private locks: Map<string, LockInfo> = new Map()

  constructor(container: MedusaContainer, options?: { [key: string]: any }) {}

  async execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: { timeout?: number }
  ): Promise<T> {
    const keyArray = Array.isArray(keys) ? keys : [keys]
    const timeout = (args?.timeout ?? 5) * 1000
    const startTime = Date.now()

    await this.acquireLocksWithTimeout(keyArray, timeout, startTime)

    try {
      return await job()
    } finally {
      await this.release(keyArray)
    }
  }

  async acquire(
    keys: string | string[],
    args?: { ownerId?: string | null; expire?: number }
  ): Promise<void> {
    const keyArray = Array.isArray(keys) ? keys : [keys]
    const ownerId = args?.ownerId ?? null
    const expire = args?.expire ?? null

    const success = this.tryAcquireLocksWithOwner(keyArray, ownerId, expire)
    if (!success) {
      throw new Error(`"${keyArray}" is already locked.`)
    }
  }

  async release(
    keys: string | string[],
    ownerId?: string | null
  ): Promise<boolean> {
    const keyArray = Array.isArray(keys) ? keys : [keys]
    let success = true

    for (const key of keyArray) {
      const lock = this.locks.get(key)
      if (!lock || (ownerId && lock.ownerId !== ownerId)) {
        success = false
      } else {
        this.locks.delete(key)
      }
    }

    return success
  }

  async releaseAll(ownerId?: string | null): Promise<void> {
    if (ownerId == null) {
      this.locks.clear()
    } else {
      for (const [key, lock] of this.locks.entries()) {
        if (lock.ownerId === ownerId) {
          this.locks.delete(key)
        }
      }
    }
  }

  private async acquireLocksWithTimeout(
    keys: string[],
    timeout: number,
    startTime: number
  ): Promise<void> {
    if (this.tryAcquireLocksWithOwner(keys, null, null)) {
      return
    }

    const elapsedTime = Date.now() - startTime
    if (elapsedTime >= timeout) {
      throw new Error("Timed-out acquiring lock.")
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
    return this.acquireLocksWithTimeout(keys, timeout, startTime)
  }

  private tryAcquireLocksWithOwner(
    keys: string[],
    ownerId: string | null,
    expire: number | null
  ): boolean {
    const now = Date.now()
    const expirationTime = expire ? now + expire * 1000 : null

    for (const key of keys) {
      const lock = this.locks.get(key)
      if (
        lock &&
        !(
          lock.ownerId === ownerId ||
          (lock.expiration && lock.expiration <= now)
        )
      ) {
        return false
      }
    }

    for (const key of keys) {
      const lock = this.locks.get(key)
      if (lock && lock.ownerId === ownerId && expire) {
        lock.expiration = expirationTime
      } else {
        this.locks.set(key, {
          ownerId,
          expiration: expirationTime,
          acquiredAt: now,
        })
      }
    }

    return true
  }
}
