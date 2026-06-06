import { isDefined, Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"
import { setTimeout } from "timers/promises"

/**
 * The keys to be locked
 */
export interface AcquireLockStepInput {
  /**
   * The keys to be locked
   */
  key: string | string[]
  /**
   * The maximum time (in seconds) to wait for acquiring the lock. If the lock cannot be acquired within this time, an error is thrown.
   *
   * @defaultValue 0
   */
  timeout?: number
  /**
   * The time (in seconds) to wait between each retry to acquire the lock.
   *
   * @defaultValue 0.3
   */
  retryInterval?: number
  /**
   * The expiration time (in seconds) for the lock. If the lock is already acquired and the owner is the same,
   * the expiration time is extended by the value passed. If not specified, the lock does not expire.
   */
  ttl?: number
  /**
   * The owner ID for the lock. If specified, only the owner can release the lock or extend its expiration time.
   */
  ownerId?: string
  /**
   * The provider name to use for locking. If no provider is passed, the default provider
   * (in-memory or the provider configured in medusa-config.ts) will be used.
   */
  provider?: string
  executeOnSubWorkflow?: boolean
}

export const acquireLockStepId = "acquire-lock-step"
/**
 * This step acquires a lock for a given key. Learn more about locks in the [Locking Module](https://docs.medusajs.com/resources/infrastructure-modules/locking)
 * guide.
 *
 * @example
 * const data = acquireLockStep({
 *   "key": "my-lock-key",
 *   "ttl": 60
 * })
 */
export const acquireLockStep = createStep(
  acquireLockStepId,
  async (
    data: AcquireLockStepInput,
    { container, parentStepIdempotencyKey }
  ) => {
    const keys = Array.isArray(data.key)
      ? data.key
      : isDefined(data.key)
      ? [data.key]
      : []

    if (!keys.length) {
      return new StepResponse(void 0)
    }

    const isSubWorkflow = !!parentStepIdempotencyKey
    if (isSubWorkflow && !data.executeOnSubWorkflow) {
      return StepResponse.skip() as any
    }

    const locking = container.resolve(Modules.LOCKING)

    const retryInterval = data.retryInterval ?? 0.3
    const tryUntil = Date.now() + (data.timeout ?? 0) * 1000

    while (true) {
      try {
        await locking.acquire(data.key, {
          expire: data.ttl,
          ownerId: data.ownerId,
          provider: data.provider,
        })
        break
      } catch (e) {
        if (Date.now() >= tryUntil) {
          throw e
        }
      }

      await setTimeout(retryInterval * 1000)
    }

    return new StepResponse(void 0, {
      keys,
      ownerId: data.ownerId,
      provider: data.provider,
    })
  },
  async (data: any, { container }) => {
    if (!data?.keys?.length) {
      return
    }

    const locking = container.resolve(Modules.LOCKING)

    await locking.release(data.keys, {
      ownerId: data.ownerId,
      provider: data.provider,
    })

    return new StepResponse()
  }
)
