import { MedusaService } from "@medusajs/framework/utils"
import { ILockingProvider } from "@medusajs/types"
import { Redis } from "ioredis"
import { setTimeout } from "node:timers/promises"

export class RedisLockingProvider
  extends MedusaService({})
  implements ILockingProvider
{
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

  constructor({ redisClient, prefix }) {
    super(...arguments)
    this.redisClient = redisClient
    this.keyNamePrefix = prefix ?? "medusa_lock:"

    // Define the custom command for acquiring locks
    this.redisClient.defineCommand("acquireLock", {
      numberOfKeys: 1,
      lua: `
        local key = KEYS[1]
        local ownerId = ARGV[1]
        local ttl = tonumber(ARGV[2])
        local awaitQueue = ARGV[3] == 'true'

        local setResult = redis.call('SET', key, ownerId, 'EX', ttl, 'NX')

        if setResult then
          return 1
        elseif not awaitQueue then
          -- Key already exists; retrieve the current ownerId
          local currentOwnerId = redis.call('GET', key)
          if currentOwnerId == ownerId then
            redis.call('SET', key, ownerId, 'EX', ttl, 'XX')
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
    const timeout = Math.max(args?.timeout ?? 5, 1)
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

    const timeout = Math.max(args?.expire ?? 5, 1)
    const timeoutSeconds = Number.isNaN(timeout) ? 1 : timeout

    const ownerId = args?.ownerId ?? "*"
    const awaitQueue = args?.awaitQueue ?? false

    const acquirePromises = keys.map(async (key) => {
      const keyName = this.getKeyName(key)

      const acquireLock = async () => {
        while (true) {
          if (cancellationToken?.cancelled) {
            return
          }

          const result = await this.redisClient.acquireLock(
            keyName,
            ownerId,
            timeoutSeconds,
            awaitQueue
          )

          if (result === 1) {
            break
          } else {
            if (awaitQueue) {
              // Wait for a short period before retrying
              await setTimeout(100)
            } else {
              throw new Error(`Failed to acquire lock for key "${key}"`)
            }
          }
        }
      }

      await acquireLock()
    })

    await Promise.all(acquirePromises)
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

    const results = await Promise.all(releasePromises)

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
