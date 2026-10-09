import { ILockingProvider } from "@medusajs/framework/types"
import { isDefined } from "@medusajs/framework/utils"
import { randomUUID } from "node:crypto"

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

  /**
   * Runs `job` while holding `keys`. The lock is held for exactly as long as
   * the job runs, lease renewal and aborts are not necessary as everything is in-memory.
   */
  async execute<T>(
    keys: string | string[],
    job: (signal?: AbortSignal) => Promise<T>,
    args?: {
      timeout?: number
      expire?: number
    }
  ): Promise<T> {
    const timeout = Math.max(args?.timeout ?? 5, 1)
    const timeoutSeconds = Number.isNaN(timeout) ? 1 : timeout

    // Unique per call, so the release below can only delete the lock this call
    // took, and never one a queued caller acquired in the meantime.
    const ownerId = `execute:${randomUUID()}`

    const cancellationToken = { cancelled: false }
    const promises: Promise<any>[] = []
    if (timeoutSeconds > 0) {
      promises.push(this.getTimeout(timeoutSeconds, cancellationToken))
    }

    const acquisition = this.acquire_(
      keys,
      {
        ownerId,
        awaitQueue: true,
      },
      cancellationToken
    )
    promises.push(acquisition)

    try {
      await Promise.race(promises)
    } catch (error) {
      // The acquisition may have taken some of the keys and be queued on
      // another. Those keys would otherwise stay held until the key it is
      // queued on is released, which can be long after this call gave up. Give
      // them back now; the owner id keeps this from touching anyone else's.
      await this.release(keys, { ownerId })

      // The queued acquisition can still take the keys in the same tick the
      // timeout fires, and no job is going to use them. Since nothing expires
      // them, they have to be given back explicitly.
      void acquisition.then(
        () => this.release(keys, { ownerId }),
        () => {}
      )

      throw error
    }

    try {
      return await job()
    } finally {
      await this.release(keys, { ownerId })
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
    return this.acquire_(keys, args)
  }

  async acquire_(
    keys: string | string[],
    args?: {
      ownerId?: string | null
      expire?: number
      awaitQueue?: boolean
    },
    cancellationToken?: { cancelled: boolean }
  ): Promise<void> {
    // Every caller takes keys in the same order, so two callers wanting the
    // same keys can never each hold one while waiting on the other's. A key
    // named twice is taken once; a second pass would find it held by this call
    // and, without an owner id, wait on it forever.
    const uniqueKeys = [...new Set(Array.isArray(keys) ? keys : [keys])].sort()
    const { ownerId, expire } = args ?? {}

    // Keys before `index` are held by this call. After waiting on a key, only
    // that key is checked again. Starting over from the first key would find
    // it held by this same call and, without an owner id to recognise it by,
    // wait on it until the timeout.
    let index = 0
    while (index < uniqueKeys.length) {
      const key = uniqueKeys[index]
      const lock = this.locks.get(key)
      const now = Date.now()

      if (!lock) {
        this.locks.set(key, {
          ownerId: ownerId ?? null,
          expiration: expire ? now + expire * 1000 : null,
          currentPromise: this.getPromise(),
        })

        index++
        continue
      }

      if (lock.expiration && lock.expiration <= now) {
        lock.currentPromise?.resolve?.()
        this.locks.set(key, {
          ownerId: ownerId ?? null,
          expiration: expire ? now + expire * 1000 : null,
          currentPromise: this.getPromise(),
        })

        index++
        continue
      }

      if (lock.ownerId !== null && lock.ownerId === ownerId) {
        if (expire) {
          lock.expiration = now + expire * 1000
          this.locks.set(key, lock)
        }

        index++
        continue
      }

      if (lock.currentPromise && args?.awaitQueue) {
        await lock.currentPromise.promise
        if (cancellationToken?.cancelled) {
          return
        }

        continue
      }

      throw new Error(`Failed to acquire lock for key "${key}"`)
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

  private async getTimeout(
    seconds: number,
    cancellationToken: { cancelled: boolean }
  ): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        cancellationToken.cancelled = true
        reject(new Error("Timed-out acquiring lock."))
      }, seconds * 1000).unref()
    })
  }
}
