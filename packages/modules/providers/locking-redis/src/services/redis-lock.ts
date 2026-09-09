import { MedusaError, promiseAll } from "@medusajs/framework/utils"
import { ILockingProvider, Logger } from "@medusajs/types"
import { RedisCacheModuleOptions } from "@types"
import { Redis } from "ioredis"
import { randomUUID } from "node:crypto"
import { setTimeout as delay } from "node:timers/promises"

/**
 * How long a lock taken by `execute` survives without being renewed. `execute`
 * renews it underneath the job, so this only bounds how long the keys stay
 * locked when the process holding them dies without releasing them.
 */
const DEFAULT_LOCK_EXPIRATION = 60

type LockCommands = {
  acquireLock: (
    key: string,
    ownerId: string,
    ttl: number,
    awaitQueue?: boolean
  ) => Promise<number>
  releaseLock: (key: string, ownerId: string) => Promise<number>
  extendLock: (key: string, ownerId: string, ttl: number) => Promise<number>
}

type InjectedDependencies = {
  redisClient: Redis & LockCommands
  prefix?: string
  logger?: Logger
}

export class RedisLockingProvider implements ILockingProvider {
  static identifier = "locking-redis"

  protected redisClient: Redis & LockCommands
  protected keyNamePrefix: string
  protected logger_?: Logger
  protected waitLockingTimeout: number = 5
  protected defaultRetryInterval: number = 20
  protected maximumRetryInterval: number = 1000
  protected backoffFactor: number = 2

  constructor(
    { redisClient, prefix, logger }: InjectedDependencies,
    options: RedisCacheModuleOptions
  ) {
    this.redisClient = redisClient
    this.keyNamePrefix = prefix ?? "medusa_lock:"
    this.logger_ = logger

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

    // Define the custom command for extending a lock this owner still holds.
    // Owner-checked like the release below, so a renewal can never revive a
    // lease that has already lapsed and been taken over by someone else.
    this.redisClient.defineCommand("extendLock", {
      numberOfKeys: 1,
      lua: `
        local key = KEYS[1]
        local ownerId = ARGV[1]
        local ttl = tonumber(ARGV[2])

        if redis.call('GET', key) == ownerId then
          return redis.call('EXPIRE', key, ttl)
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

  /**
   * Runs `job` while holding `keys`, and keeps holding them for as long as it
   * runs: the lease is renewed underneath the job, so a job that outlives
   * `expire` no longer has its keys handed to another process mid-flight.
   *
   * The lease itself stays short regardless of how long the job takes — it is
   * what frees the keys if this process dies before reaching the release
   * below. When renewal loses the race anyway (Redis unreachable long enough
   * for the lease to lapse, or the key evicted), `job`'s signal is aborted and
   * `execute` throws, rather than reporting a critical section that wasn't one.
   */
  async execute<T>(
    keys: string | string[],
    job: (signal?: AbortSignal) => Promise<T>,
    args?: {
      timeout?: number
      expire?: number
    }
  ): Promise<T> {
    const timeout = Math.max(args?.timeout ?? this.waitLockingTimeout, 1)
    const timeoutSeconds = Number.isNaN(timeout) ? 1 : timeout

    const expire = Math.max(args?.expire ?? DEFAULT_LOCK_EXPIRATION, 1)
    const expireSeconds = Number.isNaN(expire)
      ? DEFAULT_LOCK_EXPIRATION
      : expire

    // Unique per call, so the release at the end can only delete the lock this
    // call took. One owner shared by every caller makes the release's owner
    // check vacuous: a job whose lease had already lapsed would delete the
    // lock of whichever job took the keys after it.
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
        expire: expireSeconds,
      },
      cancellationToken
    )
    promises.push(acquisition)

    try {
      await Promise.race(promises)
    } catch (error) {
      // The acquire loop can be mid-`SET` when the timeout fires, and then
      // takes keys no job is going to use. Hand them back rather than leaving
      // them locked for a whole lease.
      void acquisition.then(
        () => this.release(keys, { ownerId }),
        () => {}
      )

      throw error
    }

    const renewal = this.renewUntilStopped(keys, ownerId, expireSeconds)

    try {
      const result = await job(renewal.signal)

      // The job either ignored the signal or finished before noticing it. It
      // ran without exclusivity either way, so its result cannot be reported
      // as if it had held the lock throughout.
      if (renewal.signal.aborted) {
        throw renewal.signal.reason
      }

      return result
    } finally {
      renewal.stop()
      await this.release(keys, { ownerId })
    }
  }

  /**
   * Extends the lease on `keys` every third of its duration for as long as the
   * returned handle is live, so two renewals can fail before the keys become
   * available to anyone else.
   *
   * A renewal that reports the key as gone or owned by someone else is
   * definitive — no later renewal can win it back — so the signal aborts. A
   * renewal that could not reach Redis says nothing yet, and the next attempt
   * decides.
   */
  private renewUntilStopped(
    keys: string | string[],
    ownerId: string,
    expireSeconds: number
  ): { signal: AbortSignal; stop: () => void } {
    const allKeys = Array.isArray(keys) ? keys : [keys]
    const intervalMs = Math.max(Math.floor((expireSeconds * 1000) / 3), 250)
    const controller = new AbortController()

    let timer: NodeJS.Timeout | undefined
    let stopped = false

    const schedule = () => {
      timer = setTimeout(renew, intervalMs)
      timer.unref?.()
    }

    const renew = async () => {
      let extended: number[]

      try {
        extended = await promiseAll(
          allKeys.map((key) =>
            this.redisClient.extendLock(
              this.getKeyName(key),
              ownerId,
              expireSeconds
            )
          )
        )
      } catch (error) {
        if (!stopped) {
          this.logger_?.warn(
            `Failed to renew lock for key(s) "${allKeys.join('", "')}": ${
              error.message
            }. Retrying in ${intervalMs}ms.`
          )
          schedule()
        }

        return
      }

      if (stopped) {
        return
      }

      const lost = allKeys.filter((_, index) => extended[index] !== 1)

      if (!lost.length) {
        schedule()
        return
      }

      const message = `Lost the lock for key(s) "${lost.join(
        '", "'
      )}" while the job was still running: the lease expired before it could be renewed. Increase "expire" if the job is expected to run this long.`

      this.logger_?.warn(message)
      controller.abort(new MedusaError(MedusaError.Types.CONFLICT, message))
    }

    schedule()

    return {
      signal: controller.signal,
      stop: () => {
        stopped = true

        if (timer) {
          clearTimeout(timer)
        }
      },
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
    let retryDelay = this.defaultRetryInterval

    const ownerId = args?.ownerId ?? "*"
    const awaitQueue = args?.awaitQueue ?? false

    const acquirePromises = keys.map(async (key) => {
      const errMessage = `Failed to acquire lock for key "${key}"`
      const keyName = this.getKeyName(key)

      const acquireLock = async () => {
        while (true) {
          if (cancellationToken?.cancelled) {
            throw new MedusaError(MedusaError.Types.CONFLICT, errMessage)
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
              // Wait before retrying with exponential backoff and jitter
              const jitteredDelay = retryDelay * (0.5 + Math.random() * 0.5)
              await delay(jitteredDelay)

              retryDelay = Math.min(
                retryDelay * this.backoffFactor,
                this.maximumRetryInterval
              )
            } else {
              throw new MedusaError(MedusaError.Types.CONFLICT, errMessage)
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
            deletePipeline.unlink(key)
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
      await delay(seconds * 1000)
      cancellationToken.cancelled = true
      reject(
        new MedusaError(MedusaError.Types.CONFLICT, "Timed-out acquiring lock.")
      )
    })
  }
}
