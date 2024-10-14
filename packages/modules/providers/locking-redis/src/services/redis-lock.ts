import { promiseAll } from "@medusajs/framework/utils"
import { ILockingProvider } from "@medusajs/types"
import { RedisCacheModuleOptions } from "@types"
import { Redis } from "ioredis"
import { setTimeout } from "node:timers/promises"

export class RedisLockingProvider implements ILockingProvider {
  static identifier = "locking-redis"

  protected redisClient: Redis & {
    acquireLock: (
      key: string,
      ownerId: string,
      ttl: number,
      awaitQueue?: boolean
    ) => Promise<number>
    releaseLock: (key: string, ownerId: string) => Promise<number>
  }
  protected keyNamePrefix: string
  protected waitLockingTimeout: number = 5
  protected defaultRetryInterval: number = 5
  protected maximumRetryInterval: number = 200

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

    // Define the custom command for acquiring locks
    this.redisClient.defineCommand("acquireLock", {
      numberOfKeys: 1,
      lua: `
        local key = KEYS[1]
        local ownerId = ARGV[1]
        local ttl = tonumber(ARGV[2])
        local awaitQueue = ARGV[3] == 'true'

        local setArgs = {key, ownerId, 'NX'}
        if ttl > 0 then
            table.insert(setArgs, 'EX')
            table.insert(setArgs, ttl)
        end

        local setResult = redis.call('SET', unpack(setArgs))

        if setResult then
            return 1
        elseif not awaitQueue then
            -- Key already exists; retrieve the current ownerId
            local currentOwnerId = redis.call('GET', key)
            if currentOwnerId == '*' then
              return 0
            elseif currentOwnerId == ownerId then
                setArgs = {key, ownerId, 'XX'}
                if ttl > 0 then
                    table.insert(setArgs, 'EX')
                    table.insert(setArgs, ttl)
                end
                redis.call('SET', unpack(setArgs))
                return 1
            else
                return 0
            end
        else
            return 0
        end

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

    promises.push(
      this.acquire_(
        keys,
        {
          awaitQueue: true,
          expire: args?.timeout ? timeoutSeconds : 0,
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
    let retryTimes = 0

    const ownerId = args?.ownerId ?? "*"
    const awaitQueue = args?.awaitQueue ?? false

    const acquirePromises = keys.map(async (key) => {
      const errMessage = `Failed to acquire lock for key "${key}"`
      const keyName = this.getKeyName(key)

      const acquireLock = async () => {
        while (true) {
          if (cancellationToken?.cancelled) {
            throw new Error(errMessage)
          }

          const result = await this.redisClient.acquireLock(
            keyName,
            ownerId,
            args?.expire ? timeoutSeconds : 0,
            awaitQueue
          )

          if (result === 1) {
            break
          } else {
            if (awaitQueue) {
              // Wait for a short period before retrying
              await setTimeout(
                Math.min(
                  this.defaultRetryInterval +
                    (retryTimes / 10) * this.defaultRetryInterval,
                  this.maximumRetryInterval
                )
              )
              retryTimes++
            } else {
              throw new Error(errMessage)
            }
          }
        }
      }

      await acquireLock()
    })

    await promiseAll(acquirePromises)
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
        const pipeline = this.redisClient.pipeline()

        keys.forEach((key) => {
          pipeline.get(key)
        })

        const currentOwners = await pipeline.exec()

        const deletePipeline = this.redisClient.pipeline()
        keys.forEach((key, idx) => {
          const currentOwner = currentOwners?.[idx]?.[1]

          if (currentOwner === ownerId) {
            deletePipeline.del(key)
          }
        })

        await deletePipeline.exec()
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
      reject(new Error("Timed-out acquiring lock."))
    })
  }
}
