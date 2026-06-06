import { isDefined, Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The locked keys to be released
 */
export interface ReleaseLockStepInput {
  /**
   * The keys to be released
   */
  key: string | string[]
  /**
   * The ID of the lock's owner. The lock can be released either if it doesn't have an owner,
   * or if its owner ID matches the one passed in this property.
   */
  ownerId?: string
  /**
   * The provider name to use for locking. If no provider is passed,
   * the default provider (in-memory or the provider configured in medusa-config.ts) will be used.
   */
  provider?: string
  executeOnSubWorkflow?: boolean
}

export const releaseLockStepId = "release-lock-step"
/**
 * This step releases a lock for a given key. Learn more about locks in the [Locking Module](https://docs.medusajs.com/resources/infrastructure-modules/locking)
 * guide.
 *
 * @example
 * const data = releaseLockStep({
 *   key: "my-lock-key"
 * })
 */
export const releaseLockStep = createStep(
  releaseLockStepId,
  async (
    data: ReleaseLockStepInput,
    { container, parentStepIdempotencyKey }
  ) => {
    const keys = Array.isArray(data.key)
      ? data.key
      : isDefined(data.key)
      ? [data.key]
      : []

    if (!keys.length) {
      return new StepResponse(true)
    }

    const isSubWorkflow = !!parentStepIdempotencyKey
    if (isSubWorkflow && !data.executeOnSubWorkflow) {
      return StepResponse.skip() as any
    }

    const ownerId = data.ownerId
    const locking = container.resolve(Modules.LOCKING)
    const released = await locking.release(keys, {
      ownerId,
      provider: data.provider,
    })

    return new StepResponse(released)
  }
)
