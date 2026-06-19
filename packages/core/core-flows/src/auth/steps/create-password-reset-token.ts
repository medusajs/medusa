import type { IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * Input for the create password reset token step.
 *
 * @since 2.16.0
 */
export type CreatePasswordResetTokenStepInput = {
  /** The entity ID for which to create the password reset token. */
  entityId: string
  /** The auth provider name. */
  provider: string
  /** Time-to-live for the token in seconds. */
  ttlSeconds: number
}

/**
 * Output from the create password reset token step.
 *
 * @since 2.16.0
 */
export type CreatePasswordResetTokenStepOutput = {
  /** The JWT ID (JTI) for the password reset token. */
  jti: string
  /** The expiration date and time of the token in ISO format. */
  expiresAt: string
}

/**
 * The ID of the create password reset token step.
 *
 * @since 2.16.0
 */
export const createPasswordResetTokenStepId = "create-password-reset-token"

/**
 * Issues a single-use password reset token via the auth module. The token's
 * `jti` is meant to be embedded in the JWT delivered to the user; the auth
 * module stores its hash in a dedicated table so the consume side can verify
 * and atomically delete it on first use.
 *
 * Issuing a new token automatically invalidates any prior password-reset
 * tokens for the same provider identity. Compensation consumes the token
 * (best-effort) if the workflow rolls back.
 *
 * @since 2.16.0
 */
export const createPasswordResetTokenStep = createStep(
  createPasswordResetTokenStepId,
  async (data: CreatePasswordResetTokenStepInput, { container }) => {
    const authModule = container.resolve<IAuthModuleService>(Modules.AUTH)

    const { jti, expires_at } = await authModule.createPasswordResetToken({
      provider: data.provider,
      entity_id: data.entityId,
      ttl_seconds: data.ttlSeconds,
    })

    return new StepResponse<
      CreatePasswordResetTokenStepOutput,
      { jti: string; provider: string; entityId: string }
    >(
      { jti, expiresAt: new Date(expires_at).toISOString() },
      { jti, provider: data.provider, entityId: data.entityId }
    )
  },
  async (compensateData, { container }) => {
    if (!compensateData) {
      return
    }

    const authModule = container.resolve<IAuthModuleService>(Modules.AUTH)

    try {
      await authModule.consumePasswordResetToken({
        jti: compensateData.jti,
        provider: compensateData.provider,
        entity_id: compensateData.entityId,
      })
    } catch {
      // Token may already be consumed; compensation is best-effort.
    }
  }
)
