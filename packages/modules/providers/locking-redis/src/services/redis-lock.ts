import { MedusaError, promiseAll } from "@medusajs/framework/utils"
import { ILockingProvider } from "@medusajs/types"
import { RedisCacheModuleOptions } from "@types"
import { Redis } from "ioredis"
import type { ChainableCommander } from "ioredis"
import { setTimeout } from "node:timers/promises"

export class RedisLockingProvider implements ILockingProvider {
  static identifier = "locking-redis"

  protected redisClient: Redis & {
    acquireLock: (key: string, ownerId: string, ttl: number) => Promise<number>
    releaseLock: (key: string, ownerId: string) => Promise<number>
  }
  protected keyNamePrefix: string
  protected waitLockingTimeout: number = 5
  protected defaultRetryInterval: number = 20
  protected maximumRetryInterval: number = 1000
  protected backoffFactor: number = 2

  constructor({ redisClient, prefix }, options: RedisCacheModuleOptions) {
    this.redisClient = redisClient
    this.keyNamePrefix = prefix ?? "medusa_lock:"

    if (!isNaN(+options?.waitLockingTimeout!)) {
      this.waitLockingTimeout = +options.waitLockingTimeout!
    }

    if (!isNaN(+options?.defaultRetryInterval!)) {
      this.defaultRetryInterval = +options.defaultRetryInterval!
    }

    if (!isNaN(+options?.maximumRetryInterval!)) {
      this.maximumRetryInterval = +options.maximumRetryInterval!
    }

    if (!isNaN(+options?.backoffFactor!)) {
      this.backoffFactor = +options.backoffFactor!
    }

    // The script only reports the state of the key; whether to wait for a lock
    // held by someone else is the caller's decision, which is why it takes no
    // awaitQueue argument. The anonymous owner '*' is not an identity - two
    // anonymous callers are indistinguishable - so it can never re-enter.
    this.redisClient.defineCommand("acquireLock", {
      numberOfKeys: 1,
      lua: `
        local key = KEYS[1]
        local ownerId = ARGV[1]
        local ttl = tonumber(ARGV[2])

        local setArgs = {key, ownerId, 'NX'}
        if ttl > 0 then
            table.insert(setArgs, 'EX')
            table.insert(setArgs, ttl)
        end

        if redis.call('SET', unpack(setArgs)) then
            return 1
        end

        local currentOwnerId = redis.call('GET', key)
        if currentOwnerId == ownerId and ownerId ~= '*' then
            setArgs = {key, ownerId, 'XX'}
            if ttl > 0 then
                table.insert(setArgs, 'EX')
                table.insert(setArgs, ttl)
            end
            redis.call('SET', unpack(setArgs))
            return 1
        end

        return 0
      `,
    })

    // Define the custom command for releasing locks
    this.redisClient.defineCommand("releaseLock", {
      numberOfKeys: 1,
      lua: `
        local key = KEYS[1]
        local ownerId = ARGV[1]

        if redis.call('GET', key) == ownerId then
          return redis.call('DEL', key)
        else
          return 0
        end
      `,
    })
  }

  private getKeyName(key: string): string {
    return `${this.keyNamePrefix}${key}`
  }

  async execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: {
      timeout?: number
    }
  ): Promise<T> {
    const timeout = Math.max(args?.timeout ?? this.waitLockingTimeout, 1)
    const timeoutSeconds = Number.isNaN(timeout) ? 1 : timeout

    const cancellationToken = { cancelled: false }
    const promises: Promise<any>[] = []
    if (timeoutSeconds > 0) {
      promises.push(this.getTimeout(timeoutSeconds, cancellationToken))
    }

    const ONE_MINUTE = 60
    promises.push(
      this.acquire_(
        keys,
        {
          awaitQueue: true,
          expire: args?.timeout ? timeoutSeconds : ONE_MINUTE,
        },
        cancellationToken
      )
    )

    await Promise.race(promises)

    try {
      return await job()
    } finally {
      await this.release(keys)
    }
  }

  async acquire(
    keys: string | string[],
    args?: {
      ownerId?: string
      expire?: number
      awaitQueue?: boolean
    }
  ): Promise<void> {
    return this.acquire_(keys, args)
  }

  async acquire_(
    keys: string | string[],
    args?: {
      ownerId?: string
      expire?: number
      awaitQueue?: boolean
    },
    cancellationToken?: { cancelled: boolean }
  ): Promise<void> {
    keys = Array.isArray(keys) ? keys : [keys]

    const timeout = Math.max(args?.expire ?? this.waitLockingTimeout, 1)
    const timeoutSeconds = Number.isNaN(timeout) ? 1 : timeout

    const ownerId = args?.ownerId ?? "*"
    const awaitQueue = args?.awaitQueue ?? false

    // Deduplicated and taken in a single global order: two callers asking for
    // the same keys in opposite orders would otherwise each hold a key the
    // other is waiting on and deadlock under awaitQueue.
    const orderedKeys = [...new Set(keys)].sort()

    for (const key of orderedKeys) {
      const errMessage = `Failed to acquire lock for key "${key}"`
      const keyName = this.getKeyName(key)
      let retryDelay = this.defaultRetryInterval

      while (true) {
        if (cancellationToken?.cancelled) {
          throw new MedusaError(MedusaError.Types.CONFLICT, errMessage)
        }

        const result = await this.redisClient.acquireLock(
          keyName,
          ownerId,
          args?.expire ? timeoutSeconds : 0
        )

        if (result === 1) {
          break
        }

        if (!awaitQueue) {
          throw new MedusaError(MedusaError.Types.CONFLICT, errMessage)
        }

        const jitteredDelay = retryDelay * (0.5 + Math.random() * 0.5)
        await setTimeout(jitteredDelay)

        retryDelay = Math.min(
          retryDelay * this.backoffFactor,
          this.maximumRetryInterval
        )
      }
    }

    // Known limitation: when one key of a multi-key acquire fails, the keys
    // already taken stay held until their TTL expires, or forever when no
    // `expire` was passed. A compare-and-delete rollback keyed on the owner is
    // not a safe fix: if one of those keys expired and was re-acquired by
    // another call sharing the same ownerId, the rollback would delete that
    // live lease. Telling the two apart requires a per-call acquisition token.
  }

  async release(
    keys: string | string[],
    args?: {
      ownerId?: string | null
    }
  ): Promise<boolean> {
    const ownerId = args?.ownerId ?? "*"
    keys = Array.isArray(keys) ? keys : [keys]

    const releasePromises = keys.map(async (key) => {
      const keyName = this.getKeyName(key)
      const result = await this.redisClient.releaseLock(keyName, ownerId)
      return result === 1
    })

    const results = await promiseAll(releasePromises)

    return results.every((released) => released)
  }

  async releaseAll(args?: { ownerId?: string | null }): Promise<void> {
    const ownerId = args?.ownerId ?? "*"

    const pattern = `${this.keyNamePrefix}*`
    let cursor = "0"

    do {
      const result = await this.redisClient.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      )
      cursor = result[0]
      const keys = result[1]

      if (keys.length > 0) {
        // One atomic compare-and-delete per key, replacing a GET pipeline
        // followed by an UNLINK pipeline: in the window between the two, a key
        // could expire and be re-acquired by another owner, and the delete
        // then destroyed that new owner's lock.
        const pipeline = this.redisClient.pipeline() as ChainableCommander & {
          releaseLock: (key: string, ownerId: string) => ChainableCommander
        }

        keys.forEach((key) => {
          pipeline.releaseLock(key, ownerId)
        })

        await pipeline.exec()
      }
    } while (cursor !== "0")
  }

  private async getTimeout(
    seconds: number,
    cancellationToken: { cancelled: boolean }
  ): Promise<void> {
    return new Promise(async (_, reject) => {
      await setTimeout(seconds * 1000)
      cancellationToken.cancelled = true
      reject(new MedusaError(MedusaError.Types.CONFLICT, "Timed-out acquiring lock."))
    })
  }
}
