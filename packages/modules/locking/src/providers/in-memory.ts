import { ILockingProvider } from "@medusajs/framework/types"
import { isDefined } from "@medusajs/framework/utils"

type LockInfo = {
  ownerId: string | null
  expiration: number | null
  currentPromise?: ResolvablePromise
}

type ResolvablePromise = {
  promise: Promise<any>
  resolve: () => void
}

export class InMemoryLockingProvider implements ILockingProvider {
  static identifier = "in-memory"

  private locks: Map<string, LockInfo> = new Map()

  constructor() {}

  private getPromise(): ResolvablePromise {
    let resolve: any
    const pro = new Promise((ok) => {
      resolve = ok
    })

    return {
      promise: pro,
      resolve,
    }
  }

  async execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: {
      timeout?: number
    }
  ): Promise<T> {
    keys = Array.isArray(keys) ? keys : [keys]

    const timeoutSeconds = args?.timeout ?? 5

    const promises: Promise<any>[] = []
    if (timeoutSeconds > 0) {
      promises.push(this.getTimeout(timeoutSeconds))
    }

    promises.push(
      this.acquire(keys, {
        awaitQueue: true,
      })
    )

    await Promise.race(promises).catch(async (err) => {
      await this.release(keys)
    })

    try {
      return await job()
    } finally {
      await this.release(keys)
    }
  }

  async acquire(
    keys: string | string[],
    args?: {
      ownerId?: string | null
      expire?: number
      awaitQueue?: boolean
    }
  ): Promise<void> {
    keys = Array.isArray(keys) ? keys : [keys]
    const { ownerId, expire } = args ?? {}

    for (const key of keys) {
      const lock = this.locks.get(key)
      const now = Date.now()

      if (!lock) {
        this.locks.set(key, {
          ownerId: ownerId ?? null,
          expiration: expire ? now + expire * 1000 : null,
          currentPromise: this.getPromise(),
        })

        continue
      }

      if (lock.expiration && lock.expiration <= now) {
        lock.currentPromise?.resolve?.()
        this.locks.set(key, {
          ownerId: ownerId ?? null,
          expiration: expire ? now + expire * 1000 : null,
          currentPromise: this.getPromise(),
        })

        continue
      }

      if (lock.ownerId === ownerId) {
        if (expire) {
          lock.expiration = now + expire * 1000
          this.locks.set(key, lock)
        }

        continue
      }

      if (lock.currentPromise && args?.awaitQueue) {
        await lock.currentPromise.promise
        return this.acquire(keys, args)
      }

      throw new Error(`"${key}" is already locked.`)
    }
  }

  async release(
    keys: string | string[],
    args?: {
      ownerId?: string | null
    }
  ): Promise<boolean> {
    const { ownerId } = args ?? {}
    keys = Array.isArray(keys) ? keys : [keys]

    let success = true

    for (const key of keys) {
      const lock = this.locks.get(key)
      if (!lock) {
        success = false
        continue
      }

      if (isDefined(ownerId) && lock.ownerId !== ownerId) {
        success = false
        continue
      }

      lock.currentPromise?.resolve?.()
      this.locks.delete(key)
    }

    return success
  }

  async releaseAll(args?: { ownerId?: string | null }): Promise<void> {
    const { ownerId } = args ?? {}

    if (!isDefined(ownerId)) {
      for (const [key, lock] of this.locks.entries()) {
        lock.currentPromise?.resolve?.()
        this.locks.delete(key)
      }
    } else {
      for (const [key, lock] of this.locks.entries()) {
        if (lock.ownerId === ownerId) {
          lock.currentPromise?.resolve?.()
          this.locks.delete(key)
        }
      }
    }
  }

  private async getTimeout(seconds: number): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timed-out acquiring lock."))
      }, seconds * 1000)
    })
  }
}
